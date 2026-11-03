import { jest } from '@jest/globals';
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

const mockTargetingOptionsResponse = {
  options: ['option1', 'option2'],
};

const mockGetTargetingOptions = jest.fn().mockResolvedValue(mockTargetingOptionsResponse);
jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  getTargetingOptions: mockGetTargetingOptions,
}));

describe('Targeting Options API Tests', () => {
  beforeAll(async () => {
    const targetingsController = await import('../../../controllers/v1/targetings.js');
    app.post('/targetings', targetingsController.getTargetingOptions);
  });
  describe('POST /targetings', () => {
    it('should return 200 and valid targeting options', async () => {
      const response = await request(app)
        .post('/targetings')
        .query({ platform: Constants.AD_PLATFORM.SNAPCHAT })
        .send({ targetingOpts: { age: 25 } })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockTargetingOptionsResponse);
    });

    it('should return 400 if targeting options are not found', async () => {
      mockGetTargetingOptions.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/targetings')
        .query({ platform: 'Unknown' })
        .send({ targetingOpts: { age: 25 } })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        message: 'Unable to fetch target options from Unknown',
      });
    });

    it('should return 500 for an internal server error', async () => {
      mockGetTargetingOptions.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/targetings')
        .send({ targetingOpts: { age: 25 }, platform: 'Facebook' })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
