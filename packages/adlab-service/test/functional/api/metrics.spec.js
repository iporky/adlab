import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import * as Constants from '../../../lib/constants.js';

const reachMetrisPayoad = {
  platform: 'Snapchat',
  name: 'App Install, United States, All Genders, 13-24',
  status: 'ACTIVE',
  type: 'SNAP_ADS',
  targeting: {
    geos: [
      {
        country_code: 'us',
      },
    ],
    demographics: [
      {
        age_groups: ['13-17', '18-20', '21-24'],
      },
    ],
  },
  placement: 'CONTENT',
  bid_micro: 6000000,
  auto_bid: false,
  daily_budget_micro: 50000000,
  delivery_constraint: 'DAILY_BUDGET',
  optimization_goal: 'APP_INSTALLS',
  included_content_types: ['SCIENCE_TECHNOLOGY'],
};

const reachMetricsResponse = {
  request_status: 'SUCCESS',
  request_id: 'mocked-request-id',
  audience_size: {
    audience_size_minimum: 0,
    audience_size_maximum: 0,
  },
};

const mockGetReactMetricsForTargeting = jest.fn().mockResolvedValue(reachMetricsResponse);
jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  getReactMetricsForTargeting: mockGetReactMetricsForTargeting,
}));

const app = express();
app.locals = {
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
};
app.use(bodyParser.json());

describe('Metrics API Tests', () => {
  beforeAll(async () => {
    const metricsController = await import('../../../controllers/v1/metrics.js');
    app.post('/metrics', metricsController.getReactMetricsForTargeting);
  });
  describe('POST /metrics', () => {
    it('should fetch audience size for targetings successfully', async () => {
      const res = await request(app)
        .post('/metrics')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .send(reachMetrisPayoad)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(reachMetricsResponse);
    });

    it('should return 400 when error occurred while fetching audience size for targetings', async () => {
      mockGetReactMetricsForTargeting.mockRejectedValue(new Error('Mocked error'));
      const res = await request(app)
        .post('/metrics')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .send(reachMetrisPayoad)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'Could not fetch Audience Size for Targetings',
        errors: 'Mocked error',
      });
    });
  });
});
