import { beforeAll, describe, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import * as Constants from '../../../lib/constants.js';

const app = express();
app.locals = {
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
};
app.use(bodyParser.json());

const mockTokenConfigResponse = {
  id: 'mocked-id',
  name: 'mocked-token',
  value: 'mocked-value',
};

const mockInsertTokenConfig = jest.fn().mockResolvedValue(mockTokenConfigResponse);
const mockFetchAllTokenConfigs = jest.fn().mockResolvedValue([mockTokenConfigResponse]);
const mockWatchTokenConfigChanges = jest.fn().mockResolvedValue();
const mockFetchTokenConfig = jest.fn().mockResolvedValue(mockTokenConfigResponse);
const mockUpdateTokenConfig = jest.fn().mockResolvedValue();
const mockDeleteTokenConfig = jest.fn().mockResolvedValue();

jest.unstable_mockModule('../../../services/v1/tokenConfigs.js', () => ({
  insertTokenConfig: mockInsertTokenConfig,
  fetchAllTokenConfigs: mockFetchAllTokenConfigs,
  watchTokenConfigChanges: mockWatchTokenConfigChanges,
  fetchTokenConfig: mockFetchTokenConfig,
  updateTokenConfig: mockUpdateTokenConfig,
  deleteTokenConfig: mockDeleteTokenConfig,
}));

describe('Token Config API Tests', () => {
  beforeAll(async () => {
    const tokensController = await import('../../../controllers/v1/tokens.js');
    app.post('/tokens', tokensController.insertTokenConfig);
    app.get('/tokens', tokensController.fetchAllTokenConfigs);
    app.get('/tokens/watch', tokensController.watchTokenConfigChanges);

    const tokenController = await import('../../../controllers/v1/tokens/{platform}.js');
    app.get('/tokens/:platform', tokenController.fetchTokenConfig);
    app.put('/tokens/:platform', tokenController.updateTokenConfig);
    app.delete('/tokens/:platform', tokenController.deleteTokenConfig);
  });

  describe('POST /tokens', () => {
    it('should insert a new token config and return 201', async () => {
      const response = await request(app)
        .post('/tokens')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(mockTokenConfigResponse);
    });

    it('should return 400 if user context is not found', async () => {
      const response = await request(app)
        .post('/tokens')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 500 for an internal server error', async () => {
      mockInsertTokenConfig.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/tokens')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /tokens', () => {
    it('should fetch all token configs and return 200', async () => {
      const response = await request(app).get('/tokens').expect('Content-Type', /json/).expect(200);

      expect(response.body).toEqual([mockTokenConfigResponse]);
    });

    it('should return 500 for an internal server error', async () => {
      mockFetchAllTokenConfigs.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app).get('/tokens').expect('Content-Type', /json/).expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /tokens/watch', () => {
    it('should watch token config changes and return 200', async () => {
      const response = await request(app).get('/tokens/watch').expect(200);

      expect(response.text).toBe('Watching token config changes');
    });

    it('should return 500 for an internal server error', async () => {
      mockWatchTokenConfigChanges.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app).get('/tokens/watch').expect('Content-Type', /json/).expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /tokens/{platform}', () => {
    it('should fetch a token config by platform and return 200', async () => {
      const response = await request(app).get('/tokens/Snapchat').expect('Content-Type', /json/).expect(200);

      expect(response.body).toEqual(mockTokenConfigResponse);
    });

    it('should return 400 if platform is invalid', async () => {
      const response = await request(app).get('/tokens/invalid-platform').expect('Content-Type', /json/).expect(400);

      expect(response.body).toEqual({ error: 'Bad Request. Invalid platform.' });
    });

    it('should return 404 if token config is not found', async () => {
      mockFetchTokenConfig.mockResolvedValue(null);

      const response = await request(app).get('/tokens/Snapchat').expect('Content-Type', /json/).expect(404);

      expect(response.body).toEqual({ error: 'Token config not found' });
    });

    it('should return 500 for an internal server error', async () => {
      mockFetchTokenConfig.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app).get('/tokens/Snapchat').expect('Content-Type', /json/).expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('PUT /tokens/{platform}', () => {
    it('should update a token config by platform and return 204', async () => {
      const response = await request(app)
        .put('/tokens/Snapchat')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect(204);

      expect(response.body).toEqual({});
    });

    it('should return 400 if platform is invalid', async () => {
      const response = await request(app)
        .put('/tokens/invalid-platform')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Bad Request. Invalid platform.' });
    });

    it('should return 400 if user context is not found', async () => {
      const response = await request(app)
        .put('/tokens/Snapchat')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 500 for an internal server error', async () => {
      mockUpdateTokenConfig.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .put('/tokens/Snapchat')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .send({ name: 'mocked-token', value: 'mocked-value' })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('DELETE /tokens/{platform}', () => {
    it('should delete a token config by platform and return 204', async () => {
      const response = await request(app)
        .delete('/tokens/Snapchat')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .expect(204);

      expect(response.body).toEqual({});
    });

    it('should return 400 if platform is invalid', async () => {
      const response = await request(app).delete('/tokens/invalid-platform').expect('Content-Type', /json/).expect(400);

      expect(response.body).toEqual({ error: 'Bad Request. Invalid platform.' });
    });

    it('should return 400 if user context is not found', async () => {
      const response = await request(app).delete('/tokens/Snapchat').expect('Content-Type', /json/).expect(400);

      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 500 for an internal server error', async () => {
      mockDeleteTokenConfig.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .delete('/tokens/Snapchat')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
