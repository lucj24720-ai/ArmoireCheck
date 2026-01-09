/**
 * Middleware de validation des données avec Joi
 */

const Joi = require('joi');
const { ErrorTypes } = require('./errorHandler');

/**
 * Schémas de validation pour les différentes entités
 */
const schemas = {
  // Validation pour la création d'utilisateur
  createUser: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 100 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('user', 'admin')
      .default('user')
  }),

  // Validation pour la connexion
  login: Joi.object({
    username: Joi.string()
      .required()
      .messages({
        'any.required': 'Username is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // Validation pour la création d'armoire
  createCabinet: Joi.object({
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages({
        'string.min': 'Cabinet name must be at least 3 characters long',
        'string.max': 'Cabinet name cannot exceed 255 characters',
        'any.required': 'Cabinet name is required'
      }),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    location: Joi.string()
      .max(255)
      .allow('', null)
      .messages({
        'string.max': 'Location cannot exceed 255 characters'
      }),
    image_url: Joi.string()
      .uri()
      .allow('', null)
      .messages({
        'string.uri': 'Please provide a valid URL for the image'
      }),
    reference_image_url: Joi.string()
      .uri()
      .allow('', null)
      .messages({
        'string.uri': 'Please provide a valid URL for the reference image'
      })
  }),

  // Validation pour la création d'outil
  createTool: Joi.object({
    cabinetId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Cabinet ID must be a number',
        'number.integer': 'Cabinet ID must be an integer',
        'number.positive': 'Cabinet ID must be positive',
        'any.required': 'Cabinet ID is required'
      }),
    name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.min': 'Tool name must be at least 2 characters long',
        'string.max': 'Tool name cannot exceed 255 characters',
        'any.required': 'Tool name is required'
      }),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    quantity: Joi.number()
      .integer()
      .min(0)
      .default(1)
      .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative'
      }),
    image_url: Joi.string()
      .uri()
      .allow('', null)
      .messages({
        'string.uri': 'Please provide a valid URL for the image'
      }),
    position_x: Joi.number()
      .min(0)
      .max(1)
      .allow(null)
      .messages({
        'number.base': 'Position X must be a number',
        'number.min': 'Position X must be between 0 and 1',
        'number.max': 'Position X must be between 0 and 1'
      }),
    position_y: Joi.number()
      .min(0)
      .max(1)
      .allow(null)
      .messages({
        'number.base': 'Position Y must be a number',
        'number.min': 'Position Y must be between 0 and 1',
        'number.max': 'Position Y must be between 0 and 1'
      }),
    position_width: Joi.number()
      .min(0)
      .max(1)
      .allow(null)
      .messages({
        'number.base': 'Position width must be a number',
        'number.min': 'Position width must be between 0 and 1',
        'number.max': 'Position width must be between 0 and 1'
      }),
    position_height: Joi.number()
      .min(0)
      .max(1)
      .allow(null)
      .messages({
        'number.base': 'Position height must be a number',
        'number.min': 'Position height must be between 0 and 1',
        'number.max': 'Position height must be between 0 and 1'
      })
  }),

  // Validation pour la création de vérification
  createCheck: Joi.object({
    cabinetId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Cabinet ID must be a number',
        'number.integer': 'Cabinet ID must be an integer',
        'number.positive': 'Cabinet ID must be positive',
        'any.required': 'Cabinet ID is required'
      }),
    image: Joi.string()
      .allow('', null)
      .messages({
        'string.base': 'Image must be a string'
      }),
    missingTools: Joi.array()
      .items(Joi.number().integer().positive())
      .default([])
      .messages({
        'array.base': 'Missing tools must be an array',
        'number.base': 'Tool ID must be a number',
        'number.integer': 'Tool ID must be an integer',
        'number.positive': 'Tool ID must be positive'
      }),
    notes: Joi.string()
      .max(1000)
      .allow('', null)
      .messages({
        'string.max': 'Notes cannot exceed 1000 characters'
      })
  }),

  // Validation pour les paramètres d'ID
  idParam: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required'
      })
  })
};

/**
 * Middleware de validation générique
 * @param {string} schemaName - Nom du schéma à utiliser
 * @param {string} property - Propriété de la requête à valider ('body', 'params', 'query')
 */
const validate = (schemaName, property = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return next(ErrorTypes.INTERNAL_SERVER(`Validation schema '${schemaName}' not found`));
    }

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      const errorMessage = errors.map(e => `${e.field}: ${e.message}`).join(', ');

      return next(ErrorTypes.VALIDATION_ERROR(errorMessage));
    }

    // Remplacer la propriété validée par la valeur nettoyée
    req[property] = value;

    next();
  };
};

/**
 * Middleware de validation personnalisé
 * @param {Joi.Schema} schema - Schéma Joi personnalisé
 * @param {string} property - Propriété de la requête à valider
 */
const validateCustom = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      const errorMessage = errors.map(e => `${e.field}: ${e.message}`).join(', ');

      return next(ErrorTypes.VALIDATION_ERROR(errorMessage));
    }

    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  validateCustom,
  schemas
};
