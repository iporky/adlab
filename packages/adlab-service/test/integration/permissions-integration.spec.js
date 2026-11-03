import request from 'supertest';
import { jest } from '@jest/globals';
import { mocks } from 'adlab-shared';
import permissionsSwaggerDoc from '../../api/v1/permissions.json';
import {
  setupDatabase, setupSwaggerServer, tearDownServer, tearDownDatabase
} from '../__helpers__';

jest.unstable_mockModule('../../lib/drivers/cache', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

jest.unstable_mockModule('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: mocks.userAuthorityFromUMS,
      }),),
  },
}));

let app;
let cache;
let roleMappingDAL;

describe('GET /v1/permissions', () => {
  beforeAll(async () => {
    cache = await import('../../lib/drivers/cache');
    roleMappingDAL = await import('../../dal/roleMappingDAL');
    [app] = await Promise.all([
      setupSwaggerServer(permissionsSwaggerDoc),
      setupDatabase(async () => {
        await roleMappingDAL.RoleMappingModel.create(mocks.roleMappings);
      }),
    ]);
    cache.get.mockReturnValue(null);
  });

  afterAll(async () => {
    await tearDownDatabase();
    await tearDownServer();
  });

  it('should exist and return JSON', async () => {
    await request(app).get('/v1/permissions').expect('Content-Type', /json/).expect(200);
  });
});
