/**
 * Middleware de gestion des erreurs centralisé
 * Fournit une gestion cohérente des erreurs à travers l'application
 */

// Classe d'erreur personnalisée pour les erreurs API
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Erreurs courantes pré-définies
const ErrorTypes = {
  BAD_REQUEST: (message = 'Bad request') => new ApiError(400, message),
  UNAUTHORIZED: (message = 'Unauthorized') => new ApiError(401, message),
  FORBIDDEN: (message = 'Forbidden') => new ApiError(403, message),
  NOT_FOUND: (message = 'Resource not found') => new ApiError(404, message),
  CONFLICT: (message = 'Resource conflict') => new ApiError(409, message),
  VALIDATION_ERROR: (message = 'Validation error') => new ApiError(422, message),
  INTERNAL_SERVER: (message = 'Internal server error') => new ApiError(500, message, false),
  DATABASE_ERROR: (message = 'Database error') => new ApiError(500, message, false),
  SERVICE_UNAVAILABLE: (message = 'Service unavailable') => new ApiError(503, message, false)
};

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Si ce n'est pas une ApiError, traiter comme erreur serveur
  if (!err.isOperational) {
    statusCode = 500;
    message = 'Internal server error';

    // Log l'erreur complète pour le débogage
    console.error('Non-operational error:', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    // Log les erreurs opérationnelles de manière moins verbose
    console.warn('Operational error:', {
      statusCode,
      message,
      url: req.url,
      method: req.method
    });
  }

  // Erreurs spécifiques de PostgreSQL
  if (err.code) {
    switch (err.code) {
      case '23505': // Violation de contrainte unique
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case '23503': // Violation de clé étrangère
        statusCode = 400;
        message = 'Invalid reference to related resource';
        break;
      case '23502': // Violation not null
        statusCode = 400;
        message = 'Required field is missing';
        break;
      case '22P02': // Invalid text representation
        statusCode = 400;
        message = 'Invalid data format';
        break;
      case '42P01': // Table indéfinie
        statusCode = 500;
        message = 'Database configuration error';
        break;
      default:
        if (err.code.startsWith('23')) {
          statusCode = 400;
          message = 'Data constraint violation';
        }
    }
  }

  // Erreurs de validation JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Préparer la réponse d'erreur
  const errorResponse = {
    status: 'error',
    statusCode,
    message
  };

  // En mode développement, inclure plus d'informations
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || null;
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware pour gérer les routes non trouvées
const notFoundHandler = (req, res, next) => {
  const error = ErrorTypes.NOT_FOUND(`Route ${req.originalUrl} not found`);
  next(error);
};

// Wrapper pour les fonctions async pour capturer les erreurs
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation des données d'entrée
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(ErrorTypes.VALIDATION_ERROR(message));
    }

    next();
  };
};

module.exports = {
  ApiError,
  ErrorTypes,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validateRequest
};
