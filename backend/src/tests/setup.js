/**
 * Configuration globale des tests Jest
 */

// Configuration des timeouts
jest.setTimeout(10000);

// Mock des variables d'environnement
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/armoirecheck_test';

// Mock de console pour réduire le bruit dans les tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
