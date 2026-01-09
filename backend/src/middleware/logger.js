/**
 * Middleware de logging pour l'application
 * Enregistre les requêtes HTTP et autres événements importants
 */

const fs = require('fs');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Niveaux de log
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Classe Logger
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${this.getDateString()}.log`);
    this.errorFile = path.join(logsDir, `error-${this.getDateString()}.log`);
  }

  getDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, metadata = {}) {
    return JSON.stringify({
      timestamp: this.getTimestamp(),
      level,
      message,
      ...metadata
    }) + '\n';
  }

  writeToFile(file, content) {
    try {
      fs.appendFileSync(file, content);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  log(level, message, metadata = {}) {
    const formattedMessage = this.formatMessage(level, message, metadata);

    // Toujours écrire dans le fichier principal
    this.writeToFile(this.logFile, formattedMessage);

    // Écrire les erreurs dans un fichier séparé
    if (level === LogLevel.ERROR) {
      this.writeToFile(this.errorFile, formattedMessage);
    }

    // Afficher dans la console en développement
    if (process.env.NODE_ENV !== 'production') {
      const consoleMessage = `[${this.getTimestamp()}] [${level}] ${message}`;
      switch (level) {
        case LogLevel.ERROR:
          console.error(consoleMessage, metadata);
          break;
        case LogLevel.WARN:
          console.warn(consoleMessage, metadata);
          break;
        case LogLevel.DEBUG:
          console.debug(consoleMessage, metadata);
          break;
        default:
          console.log(consoleMessage, metadata);
      }
    }
  }

  error(message, metadata = {}) {
    this.log(LogLevel.ERROR, message, metadata);
  }

  warn(message, metadata = {}) {
    this.log(LogLevel.WARN, message, metadata);
  }

  info(message, metadata = {}) {
    this.log(LogLevel.INFO, message, metadata);
  }

  debug(message, metadata = {}) {
    this.log(LogLevel.DEBUG, message, metadata);
  }
}

// Instance singleton du logger
const logger = new Logger();

// Middleware pour logger les requêtes HTTP
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Capturer l'URL et la méthode originales
  const { method, url, ip } = req;

  // Logger au moment de la réponse
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    const metadata = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get('user-agent') || 'Unknown'
    };

    // Logger avec le niveau approprié selon le code de statut
    if (statusCode >= 500) {
      logger.error('HTTP Request', metadata);
    } else if (statusCode >= 400) {
      logger.warn('HTTP Request', metadata);
    } else {
      logger.info('HTTP Request', metadata);
    }
  });

  next();
};

// Middleware pour logger les erreurs non capturées
const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  next(err);
};

// Fonction pour nettoyer les anciens logs (garder 30 jours)
const cleanOldLogs = () => {
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes

  fs.readdir(logsDir, (err, files) => {
    if (err) {
      logger.error('Error reading logs directory', { error: err.message });
      return;
    }

    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          logger.error('Error getting file stats', { file, error: err.message });
          return;
        }

        const now = Date.now();
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              logger.error('Error deleting old log file', { file, error: err.message });
            } else {
              logger.info('Deleted old log file', { file });
            }
          });
        }
      });
    });
  });
};

// Nettoyer les anciens logs au démarrage
cleanOldLogs();

// Nettoyer les anciens logs tous les jours
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

module.exports = {
  logger,
  requestLogger,
  errorLogger,
  LogLevel
};
