import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import libConfig from '@tfs/node-config';
import RAW_CONFIG from '../../../../config/service-template.json';
import { configureCorsHandler } from '../../../../lib/middlewares/corsHandler';

describe('corsHandler middleware', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.locals = {
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
      _config: libConfig.fromObject(RAW_CONFIG)
    };

    configureCorsHandler(app);

    app.get('/test', (req, res) => {
      res.status(200).send('OK');
    });

    // Add error handler at the end
    app.use((err, req, res, next) => {
      if (err.message.includes('CORS')) {
        return res.status(403).json({ error: err.message });
      }
      next(err);
    });
  });

  test('allows requests from permitted origins', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'https://localhost:8080');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://localhost:8080');
  });

  test('blocks requests from unauthorized origins', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'https://malicious.com');

    expect(response.status).toBe(403);
    expect(app.locals.logger.warn).toHaveBeenCalledWith(
      'server_cors_rejected',
      { origin: 'https://malicious.com' }
    );
  });

  test('handles OPTIONS preflight requests', async () => {
    const response = await request(app)
      .options('/test')
      .set('Origin', 'https://localhost:8080')
      .set('Access-Control-Request-Method', 'GET');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE');
  });

  test('allows requests without origin (same origin)', async () => {
    const response = await request(app)
      .get('/test');

    expect(response.status).toBe(200);
  });

  test('handles invalid origin URL format', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'invalid-url');

    expect(response.status).toBe(500);
    expect(app.locals.logger.error).toHaveBeenCalledWith(
      'server_cors_parse_error',
      expect.objectContaining({ origin: 'invalid-url' })
    );
  });

  test('verifies allowed HTTP methods', async () => {
    const response = await request(app)
      .options('/test')
      .set('Origin', 'https://localhost:8080')
      .set('Access-Control-Request-Method', 'PUT');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE');
  });
});
