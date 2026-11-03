import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import { mocks } from 'adlab-shared';
import libConfig from '@tfs/node-config';
import * as Constants from '../../../../lib/constants';
import RAW_CONFIG from '../../../../config/service-template.json';

jest.unstable_mockModule('../../../../dal/userPermissionsDAL', () => ({
  getUserPermissionsFromDB: jest.fn(),
}));

describe('authorityVerifier middleware', () => {
  // let app;
  // let userPermissionsDAL;
  // let configureAuthorityVerifier;

  // beforeAll(async () => {
  //   userPermissionsDAL = await import('../../../../dal/userPermissionsDAL');
  //   configureAuthorityVerifier = (await import('../../../../lib/middlewares/authorityVerifier')).configureAuthorityVerifier;

  //   app = express();
  //   app.use((req, res, next) => {
  //     req.jwt = {
  //       claims: {
  //         uid: 'mock-uid',
  //       },
  //     };
  //     next();
  //   });

  //   app.locals = {
  //     logger: {
  //       info: jest.fn(),
  //       error: jest.fn(),
  //       warn: jest.fn(),
  //     },
  //     _config: libConfig.fromObject(RAW_CONFIG),
  //   };
  //   configureAuthorityVerifier(app);
  //   app.use((req, res, next) => {
  //     res.status(200).send('OK');
  //   });
  // });

  // test('allows request when user has required permissions', async () => {
  //   userPermissionsDAL.getUserPermissionsFromDB.mockResolvedValue(mocks.userPermissions);

  //   const response = await request(app)
  //     .get('/v1/campaigns')
  //     .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
  //     .set(Constants.X_TFS_ACCOUNT_ID, 'testclientone');
  //   expect(response.status).toBe(200);
  // });

  // test('blocks request when user does not have required permissions', async () => {
  //   userPermissionsDAL.getUserPermissionsFromDB.mockResolvedValue(mocks.userPermissions);

  //   const response = await request(app)
  //     .get('/v1/unauthorized')
  //     .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
  //     .set(Constants.X_TFS_ACCOUNT_ID, 'testclientone');

  //   expect(response.status).toBe(403);
  // });

  // test('block when user context is not found', async () => {
  //   userPermissionsDAL.getUserPermissionsFromDB.mockResolvedValue(mocks.userPermissions);

  //   const response = await request(app)
  //     .get('/v1/campaigns')
  //     .set(Constants.X_TFS_CLIENT_ID, 'testclientone');

  //   expect(response.status).toBe(403);
  // });

  // test('allows request when path is unprotected', async () => {
  //   const response = await request(app).get('/v1/permissions');

  //   expect(response.status).toBe(200);
  // });

  // test('blocks request when getUserPermissions returns null', async () => {
  //   userPermissionsDAL.getUserPermissionsFromDB.mockResolvedValue(null);

  //   const response = await request(app)
  //     .get('/v1/campaigns')
  //     .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
  //     .set(Constants.X_TFS_ACCOUNT_ID, 'testclientone');

  //   expect(response.status).toBe(403);
  // });

  // test('returns 500 when an error occurs in getUserPermissions', async () => {
  //   userPermissionsDAL.getUserPermissionsFromDB.mockRejectedValue(new Error('Test error'));

  //   const response = await request(app)
  //     .get('/')
  //     .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
  //     .set(Constants.X_TFS_ACCOUNT_ID, 'testclientone');

  //   expect(response.status).toBe(500);
  // });
});
