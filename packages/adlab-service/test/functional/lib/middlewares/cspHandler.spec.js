import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import libConfig from '@tfs/node-config';
import RAW_CONFIG from '../../../../config/service-template.json';
import { configureCSPHandler } from '../../../../lib/middlewares/cspHandler';
import * as Constants from '../../../../lib/constants.js';

describe('cspHandler middleware', () => {
  const setupApp = (cspEnabled = true, cspDirectives = { 'default-src': ["'self'"], 'script-src': ["'self'", "'unsafe-inline'"] }) => {
    const app = express();
    const config = {
      ...RAW_CONFIG,
      csp: { ...RAW_CONFIG.csp, enabled: cspEnabled, directives: cspDirectives || RAW_CONFIG.csp.directives },
    };

    app.locals = {
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
      _config: libConfig.fromObject(config)
    };

    configureCSPHandler(app);

    app.get('/test', (req, res) => {
      res.status(200).send('OK');
    });

    return app;
  };

  test('applies CSP headers when enabled', async () => {
    const app = setupApp(true);
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
    expect(app.locals.logger.info).toHaveBeenCalledWith('Server Content Security Policy enabled. Setting up CSP headers...');
  });

  test('does not apply CSP headers when disabled', async () => {
    const app = setupApp(false);
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.headers['content-security-policy']).toBeUndefined();
    expect(response.headers['strict-transport-security']).toBeUndefined();
    expect(app.locals.logger.info).not.toHaveBeenCalled();
  });

  test('applies correct CSP directives from configuration', async () => {
    const customDirectives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", 'trusted-scripts.com'],
      'img-src': ['img.example.com', 'data:']
    };

    const app = setupApp(true, customDirectives);
    const response = await request(app).get('/test');

    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    expect(response.headers['content-security-policy']).toContain("script-src 'self' trusted-scripts.com");
    expect(response.headers['content-security-policy']).toContain('img-src img.example.com data:');
  });

  test('throws assertion error with invalid CSP directives', () => {
    const mockConfig = {
      ...RAW_CONFIG,
      [Constants.IS_CSP_ENABLED]: true,
      [Constants.CSP_DIRECTIVES]: null // Invalid directives
    };

    const app = express();
    app.locals = {
      logger: { info: jest.fn() },
      _config: {
        get: (key) => {
          if (key === Constants.IS_CSP_ENABLED) return true;
          if (key === Constants.CSP_DIRECTIVES) return null;
          return mockConfig[key];
        }
      }
    };

    expect(() => configureCSPHandler(app)).toThrow();
  });

  test('formats multiple CSP directives correctly', async () => {
    const directives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'connect-src': ["'self'", 'api.example.com']
    };

    const app = setupApp(true, directives);
    const response = await request(app).get('/test');

    const cspHeader = response.headers['content-security-policy'];
    expect(cspHeader).toContain("default-src 'self'");
    expect(cspHeader).toContain("script-src 'self' 'unsafe-inline'");
    expect(cspHeader).toContain("connect-src 'self' api.example.com");
  });
});
