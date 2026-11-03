import request from 'supertest';
import { jest } from '@jest/globals';
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

const mockUserPermissions = {
  client1: {
    app1: ['role1', 'role2'],
  },
};
const mockGetUserPermissions = jest.fn().mockResolvedValue(mockUserPermissions);
jest.unstable_mockModule('../../../services/v1/permissions', () => ({
  getUserPermissions: mockGetUserPermissions,
}));

describe('Permissions API Tests', () => {
  beforeAll(async () => {
    const permissionsController = await import('../../../controllers/v1/permissions.js');
    app.get('/permissions', permissionsController.getUserPermissions);
  });
  describe('GET /permissions', () => {
    it('should return user permission if user is authentic ', async () => {
      const response = await request(app)
        .get('/permissions')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockUserPermissions);
    });

    it('should return 400 if user context not found', async () => {
      const response = await request(app).get('/permissions').expect('Content-Type', /json/).expect(400);

      expect(response.body).toEqual({ error: 'Invalid user context' });
    });

    it('should return 404 if data not found', async () => {
      mockGetUserPermissions.mockResolvedValue(undefined);

      const response = await request(app)
        .get('/permissions')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({ error: 'Data not found' });
    });

    it('should return 500 if an error occurs', async () => {
      mockGetUserPermissions.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .get('/permissions')
        .set(Constants.X_TFS_USER_ID, 'test-user-one')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
