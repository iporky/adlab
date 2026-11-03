import createErrorHandler, { createError } from '../../src/snapchat/utils/errorHandler.js';

describe('ErrorHandler', () => {
  describe('createErrorHandler', () => {
    it('should create an error handler object with the correct properties', () => {
      const statusCode = 404;
      const message = 'Not Found';
      const error = createErrorHandler(statusCode, message);

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(statusCode);
      expect(error.message).toBe(message);
      expect(error.timestamp).toBeDefined();
      expect(error.stack).toBeDefined();
    });
  });

  describe('createError', () => {
    it('should create an error handler object with the correct properties', () => {
      const params = {
        statusCode: 500,
        message: 'Internal Server Error',
      };
      const error = createError(params);

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(params.statusCode);
      const errorDetails = JSON.parse(error.message);
      expect(errorDetails.statusCode).toBe(params.statusCode);
      expect(errorDetails.message).toBe(params.message);
      expect(errorDetails.stack).toBeDefined();
      expect(errorDetails.caller).toBe('Object'); // The function name in the test case
      expect(errorDetails.additionalInfo).toBe('');
    });

    it('should handle additionalInfo as a string', () => {
      const params = {
        statusCode: 400,
        message: 'Bad Request',
        additionalInfo: 'Invalid input data',
      };
      const error = createError(params);

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(params.statusCode);
      const errorDetails = JSON.parse(error.message);
      expect(errorDetails.statusCode).toBe(params.statusCode);
      expect(errorDetails.message).toBe(params.message);
      expect(errorDetails.stack).toBeDefined();
      expect(errorDetails.caller).toBe('Object'); // The function name in the test case
      expect(errorDetails.additionalInfo).toBe(params.additionalInfo);
    });

    it('should handle additionalInfo as an object', () => {
      const params = {
        statusCode: 400,
        message: 'Bad Request',
        additionalInfo: { field: 'username', issue: 'required' },
      };
      const error = createError(params);

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(params.statusCode);
      const errorDetails = JSON.parse(error.message);
      expect(errorDetails.statusCode).toBe(params.statusCode);
      expect(errorDetails.message).toBe(params.message);
      expect(errorDetails.stack).toBeDefined();
      expect(errorDetails.caller).toBe('Object'); // The function name in the test case
      expect(errorDetails.additionalInfo).toBe(JSON.stringify(params.additionalInfo));
    });

    it('should set function name in context', () => {
      const params = {
        statusCode: 401,
        message: 'Unauthorized',
        additionalInfo: 'Missing token',
      };
      const error = createError(params);

      const errorDetails = JSON.parse(error.message);
      expect(errorDetails.caller).toBe('Object'); // The function name in the test case
    });
  });
});
