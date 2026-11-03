import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import libConfig from '@tfs/node-config';
import zlib from 'zlib';
import RAW_CONFIG from '../../../../config/service-template.json';
import { configureRequestContentParser } from '../../../../lib/middlewares/requestContentParser';
import * as Constants from '../../../../lib/constants.js';

describe('requestContentParser middleware', () => {
  const setupApp = (parserConfig = {}) => {
    const app = express();
    const config = {
      ...RAW_CONFIG,
      parser: {
        jsonLimit: '10mb' || parserConfig[Constants.PARSER_JSON_LIMIT],
        urlencodedLimit: '10mb' || parserConfig[Constants.PARSER_URLENCODED_LIMIT],
        bodyLimit: '1mb' || parserConfig[Constants.PARSER_BODY_LIMIT]
      }
    };

    app.locals = {
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
      _config: libConfig.fromObject(config)
    };

    // Configure the request parser middleware
    configureRequestContentParser(app);

    // Echo route for testing
    app.post('/echo', (req, res) => {
      res.status(200).json(req.body);
    });

    // Add error handler
    app.use((err, req, res, next) => {
      if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Payload Too Large' });
      }
      return res.status(500).json({ error: err.message });
    });

    return app;
  };

  test('parses URL-encoded requests correctly', async () => {
    const app = setupApp();
    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=test&value=123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'test', value: '123' });
    expect(app.locals.logger.info).toHaveBeenCalledWith('Configuring Request Content Parser...');
  });

  test('parses JSON requests correctly', async () => {
    const app = setupApp();
    const testData = { name: 'test', value: 123, nested: { key: 'value' } };

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send(testData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testData);
  });

  test.skip('parses gzip-compressed JSON requests correctly', async () => {
    const app = setupApp();
    const testData = { name: 'test', value: 123, compressed: true };
    const jsonString = JSON.stringify(testData);
    const compressedData = zlib.gzipSync(Buffer.from(jsonString));

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'gzip')
      .send(compressedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(testData);
  });

  test('handles invalid JSON in gzip-compressed request', async () => {
    const app = setupApp();

    // Create invalid JSON data
    const compressedData = zlib.gzipSync(Buffer.from('{ "invalid": JSON }'));

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'gzip')
      .send(compressedData);

    expect(response.status).toBe(500);
  });

  test('handles non-buffer data in gzip decompression', async () => {
    const app = setupApp();

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'gzip')
      .send('');

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('unexpected end of file');
  });

  test.skip('respects body size limit for JSON requests', async () => {
    // Use a very small limit that will definitely be exceeded
    const app = setupApp({
      [Constants.PARSER_JSON_LIMIT]: '1b',
      [Constants.PARSER_BODY_LIMIT]: '1b'
    });

    // Create a request that exceeds the limit
    const largeData = { data: 'x'.repeat(100) };

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send(largeData);

    expect(response.status).toBe(413);
  });

  test.skip('respects body size limit for URL-encoded requests', async () => {
    // Use a very small limit that will definitely be exceeded
    const app = setupApp({
      [Constants.PARSER_URLENCODED_LIMIT]: '1b',
      [Constants.PARSER_BODY_LIMIT]: '1b'
    });

    const response = await request(app)
      .post('/echo')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`data=${'x'.repeat(100)}`);

    expect(response.status).toBe(413);
  });
});
