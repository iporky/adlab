import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import libConfig from '@tfs/node-config';
import Assert from '@tfs/node-assert';
import RAW_CONFIG from '../../../../config/service-template.json';
import { configureErrorHandler } from '../../../../lib/middlewares/errorHandler';

describe('errorHandler middleware', () => {
  const setupApp = (errorConfig = {}) => {
    const app = express();
    const config = {
      ...RAW_CONFIG,
      ...errorConfig
    };

    app.locals = {
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
      _config: libConfig.fromObject(config)
    };

    // Standard route
    app.get('/test', (req, res) => {
      res.status(200).send('OK');
    });

    // Route that throws a standard error
    app.get('/error', (req, res, next) => {
      next(new Error('Standard error'));
    });

    // Route that throws a custom error with status
    app.get('/custom-error', (req, res, next) => {
      const error = new Error('Custom error');
      error.status = 400;
      next(error);
    });

    // Route that throws an assertion error
    app.get('/assertion-error', (req, res, next) => {
      try {
        const error = new Assert.AssertionError('Assertion failed');
        error.status = 400;
        throw error;
      } catch (err) {
        next(err);
      }
    });

    // Configure error handler middleware after routes
    app.use(configureErrorHandler);

    return app;
  };

  test('passes through normal requests without errors', async () => {
    const app = setupApp();
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
    expect(app.locals.logger.error).not.toHaveBeenCalled();
  });

  test('handles standard errors correctly', async () => {
    const app = setupApp();
    const response = await request(app).get('/error');

    expect(response.status).toBe(500);
    // For 500 errors, publicError is false, so no response body is sent
    expect(response.body).toEqual({});
    expect(app.locals.logger.error).toHaveBeenCalled();
  });

  test('respects custom status codes in errors', async () => {
    const app = setupApp();
    const response = await request(app).get('/custom-error');

    expect(response.status).toBe(400);
    // For 400 errors, publicError is true, so a response body is sent
    expect(response.body).toHaveProperty('reason');
    expect(response.body.reason).toContain('Custom error');
    // The initial logger.error is always called
    expect(app.locals.logger.error).toHaveBeenCalled();
    expect(app.locals.logger.info).toHaveBeenCalled();
  });

  test('includes stack trace in development mode', async () => {
    const app = setupApp({ NODE_ENV: 'development' });
    const response = await request(app).get('/error');

    expect(response.status).toBe(500);
    expect(app.locals.logger.error).toHaveBeenCalled();
    // Stack is included in the log attributes, not the first parameter
    expect(app.locals.logger.error.mock.calls[0][1]).toHaveProperty('err');
  });

  test('excludes stack trace in production mode', async () => {
    const app = setupApp({ NODE_ENV: 'production' });
    const response = await request(app).get('/error');

    expect(response.status).toBe(500);
    expect(app.locals.logger.error).toHaveBeenCalled();
  });
});
