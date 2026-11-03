import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import libConfig from '@tfs/node-config';
import RAW_CONFIG from '../../../../config/service-template.json';

const config = libConfig.fromObject(RAW_CONFIG);
const mockJwt = { claims: { uid: '123' } };

jest.unstable_mockModule('@okta/jwt-verifier', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    verifyAccessToken: jest.fn().mockImplementation((token) => {
      if (token === 'Invalid') {
        return Promise.reject(new Error('Invalid token'));
      }
      return Promise.resolve(mockJwt);
    }),
  })),
}));

describe('JWT Verification Middleware', () => {
  let app;

  beforeAll(async () => {
    const configureOIDCMiddleware = (await import('../../../../lib/middlewares/oidcJwtVerifier')).configureOIDCJwtVerifier;
    app = express();
    app.locals = {
      logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
      _config: config,
    };
    app.use(express.json());
    configureOIDCMiddleware(app);
    app.use((req, res) => {
      const sanitizedJwt = encodeURIComponent(JSON.stringify(req.jwt));
      res.status(200).send({ jwt: JSON.parse(decodeURIComponent(sanitizedJwt)) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if Authorization header is not present', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(401);
  });

  it('should return 401 if Authorization header does not contain Bearer token', async () => {
    const response = await request(app).get('/').set('Authorization', '');
    expect(response.status).toBe(401);
  });

  it('should return 200 and jwt object if token verification is successful', async () => {
    const response = await request(app).get('/').set('Authorization', 'Bearer token');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jwt: mockJwt });
  });

  it('should return 401 if token verification fails', async () => {
    const response = await request(app).get('/').set('Authorization', 'Bearer Invalid');
    expect(response.status).toBe(401);
  });
});
