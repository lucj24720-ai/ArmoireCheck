module.exports = {
  // Environnement de test
  testEnvironment: 'node',

  // Fichiers de setup
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],

  // Pattern des fichiers de test
  testMatch: [
    '**/src/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Dossiers à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/'
  ],

  // Couverture de code
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!**/node_modules/**'
  ],

  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Format des rapports de couverture
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Verbose pour plus de détails
  verbose: true,

  // Arrêter au premier échec
  bail: false,

  // Clear mocks entre les tests
  clearMocks: true,

  // Reset mocks entre les tests
  resetMocks: true,

  // Restore mocks entre les tests
  restoreMocks: true
};
