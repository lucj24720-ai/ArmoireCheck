/**
 * Tests pour le middleware errorHandler
 */

const { ApiError, ErrorTypes, errorHandler } = require('../../middleware/errorHandler');

describe('ErrorHandler Middleware', () => {
  describe('ApiError', () => {
    test('should create an ApiError with correct properties', () => {
      const error = new ApiError(404, 'Not found');

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.isOperational).toBe(true);
    });

    test('should create a non-operational error', () => {
      const error = new ApiError(500, 'Server error', false);

      expect(error.isOperational).toBe(false);
    });
  });

  describe('ErrorTypes', () => {
    test('BAD_REQUEST should return 400 error', () => {
      const error = ErrorTypes.BAD_REQUEST('Invalid input');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    test('UNAUTHORIZED should return 401 error', () => {
      const error = ErrorTypes.UNAUTHORIZED();

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    test('NOT_FOUND should return 404 error', () => {
      const error = ErrorTypes.NOT_FOUND('User not found');

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });

    test('INTERNAL_SERVER should return 500 error', () => {
      const error = ErrorTypes.INTERNAL_SERVER('Database error');

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Database error');
      expect(error.isOperational).toBe(false);
    });
  });

  describe('errorHandler', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        url: '/test',
        method: 'GET',
        body: {},
        params: {},
        query: {}
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      next = jest.fn();

      // Mock console methods
      console.error = jest.fn();
      console.warn = jest.fn();
    });

    test('should handle operational ApiError', () => {
      const error = new ApiError(400, 'Bad request');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Bad request'
      });
    });

    test('should handle non-operational error as 500', () => {
      const error = new Error('Unexpected error');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error'
      });
      expect(console.error).toHaveBeenCalled();
    });

    test('should handle PostgreSQL unique constraint error', () => {
      const error = new Error('Duplicate key');
      error.code = '23505';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 409,
        message: 'Resource already exists'
      });
    });

    test('should handle PostgreSQL foreign key error', () => {
      const error = new Error('Foreign key violation');
      error.code = '23503';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Invalid reference to related resource'
      });
    });

    test('should handle JWT errors', () => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 401,
        message: 'Invalid token'
      });
    });

    test('should handle expired token errors', () => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 401,
        message: 'Token expired'
      });
    });

    test('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new ApiError(400, 'Test error');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.stack).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });

    test('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new ApiError(400, 'Test error');

      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.stack).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
