/**
 * Middleware de rate limiting pour protéger contre les abus
 */

const { ErrorTypes } = require('./errorHandler');

/**
 * Store en mémoire pour le rate limiting
 * En production, utiliser Redis pour une solution scalable
 */
class RateLimitStore {
  constructor() {
    this.requests = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  /**
   * Enregistre une requête
   */
  hit(key) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    requests.push(now);
    this.requests.set(key, requests);
    return requests.length;
  }

  /**
   * Compte le nombre de requêtes dans la fenêtre de temps
   */
  count(key, windowMs) {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    this.requests.set(key, validRequests);
    return validRequests.length;
  }

  /**
   * Réinitialise le compteur pour une clé
   */
  reset(key) {
    this.requests.delete(key);
  }

  /**
   * Nettoie les anciennes entrées
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 3600000; // 1 heure

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => now - timestamp < maxAge);

      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }

  /**
   * Arrête le nettoyage automatique
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Instance globale du store
const store = new RateLimitStore();

/**
 * Options par défaut du rate limiter
 */
const defaultOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de requêtes
  message: 'Too many requests, please try again later',
  statusCode: 429,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (req) => {
    // Utiliser l'IP du client comme clé
    return req.ip || req.connection.remoteAddress;
  },
  skip: (req) => false,
  handler: (req, res, next, options) => {
    next(ErrorTypes.SERVICE_UNAVAILABLE(options.message));
  }
};

/**
 * Crée un middleware de rate limiting
 * @param {Object} options - Options de configuration
 * @returns {Function} Middleware Express
 */
const createRateLimiter = (options = {}) => {
  const opts = { ...defaultOptions, ...options };

  return (req, res, next) => {
    // Skip si la fonction skip retourne true
    if (opts.skip(req)) {
      return next();
    }

    const key = opts.keyGenerator(req);
    const current = store.count(key, opts.windowMs);

    // Headers de rate limiting
    res.setHeader('X-RateLimit-Limit', opts.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, opts.max - current - 1));
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + opts.windowMs).toISOString());

    // Vérifier si la limite est dépassée
    if (current >= opts.max) {
      res.setHeader('Retry-After', Math.ceil(opts.windowMs / 1000));
      return opts.handler(req, res, next, opts);
    }

    // Enregistrer la requête
    store.hit(key);

    // Ajouter un listener pour les requêtes échouées/réussies
    const originalSend = res.send;
    res.send = function(data) {
      const statusCode = res.statusCode;

      // Si on doit ignorer les requêtes réussies
      if (opts.skipSuccessfulRequests && statusCode < 400) {
        store.reset(key);
      }

      // Si on doit ignorer les requêtes échouées
      if (opts.skipFailedRequests && statusCode >= 400) {
        store.reset(key);
      }

      return originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Rate limiters prédéfinis pour différents endpoints
 */

// Rate limiter strict pour le login (protection contre brute force)
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true // Ne pas compter les connexions réussies
});

// Rate limiter pour la création de compte
const signupLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 comptes par heure
  message: 'Too many accounts created, please try again after an hour'
});

// Rate limiter général pour l'API
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes
  message: 'Too many API requests, please try again later'
});

// Rate limiter pour les vérifications (analyse d'images)
const checkLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 vérifications par minute
  message: 'Too many check requests, please slow down'
});

// Rate limiter pour les opérations d'écriture (create, update, delete)
const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 opérations d'écriture par minute
  message: 'Too many write operations, please slow down'
});

module.exports = {
  createRateLimiter,
  loginLimiter,
  signupLimiter,
  apiLimiter,
  checkLimiter,
  writeLimiter,
  RateLimitStore
};
