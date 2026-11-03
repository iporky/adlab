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

const campaignPayload = {
  platform: Constants.AD_PLATFORM.SNAPCHAT,
  adsList: [
    {
      'Campaign ID': 'campaign_123',
      'Campaign End Time': new Date('2027-12-01T00:00:00Z').toISOString(), // Must be in ISO 8601 date format
      'Campaign Name': 'Holiday Campaign',
      'Campaign Start Time': new Date('2027-11-01T00:00:00Z').toISOString(), // Must be in ISO 8601 date format
      'Campaign Status': 'ACTIVE',
      'iOS App ID': '1234567890',
      'Android App URL': 'example.domain_name',
      'Campaign Objective': 'BRAND_AWARENESS',
      'Buy Model': 'AUCTION',
      'Restricted Delivery Signals': 'true',
      'Ad Set Name': 'Ad Set 1',
      'MOAT Auto-Tagging': true,
      'DoubleVerify Auto-Tagging': false,
      Bid: 1000000,
      'Child Ad Type': 'SNAP_AD',
      'Forced View Setting': 'FULL_DURATION',
      'Ad Set Daily Spend Cap': 5000000, // Must be >= 5000000
      'Ad Set End Time': new Date('2027-12-01T00:00:00Z').toISOString(), // Must be in ISO 8601 date format
      'Optimization Goal': 'APP_INSTALLS',
      'Conversion Window': 'SWIPE_28DAY_VIEW_1DAY',
      'Ad Set Start Time': new Date('2027-11-01T00:00:00Z').toISOString(), // Must be in ISO 8601 date format
      'Ad Set Status': 'ACTIVE',
      'Ad Set Type': 'SNAP_ADS',
      'Bid Strategy': 'LOWEST_COST_WITH_MAX_BID',
      'Ad Set Delivery Constraint': 'DAILY_BUDGET',
      'Ad Name': 'Ad 1',
      'Ad Type': 'SNAP_AD',
      'Ad Status': 'ACTIVE',
      'Creative ID': 'creative_123',
    },
  ],
};
const mockOrchestrateCampaignCreation = jest.fn();
jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  orchestrateCampaignCreation: mockOrchestrateCampaignCreation,
  performPlatformOperation: jest.fn(),
}));

describe('Ads API Tests', () => {
  beforeAll(async () => {
    const adsController = await import('../../../controllers/v1/ads.js');
    app.post('/ads', adsController.postAds);
  });
  describe('POST /ads', () => {
    it('should post ads and return 200', async () => {
      mockOrchestrateCampaignCreation.mockResolvedValue({
        tally: 10,
        errors: {},
      });

      const response = await request(app)
        .post('/ads')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .set(Constants.X_TFS_USER_ID, 'testuserone')
        .send(campaignPayload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: '10 advertisements posted successfully to Snapchat.',
      });
    });

    it('should return 400 when platform throws errors', async () => {
      mockOrchestrateCampaignCreation.mockResolvedValue({
        tally: 0,
        errors: {
          campaign_123: 'Error creating campaign',
        },
      });
      const response = await request(app)
        .post('/ads')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .set(Constants.X_TFS_USER_ID, 'testuserone')
        .send(campaignPayload)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        message: `Could not publish ads to the ${campaignPayload.platform}`,
        errors: {
          campaign_123: 'Error creating campaign',
        },
      });
    });

    it('should return 400 for payload validation errors', async () => {
      const response = await request(app)
        .post('/ads')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .set(Constants.X_TFS_USER_ID, 'testuserone')
        .send({
          ...campaignPayload,
          adsList: [
            {
              ...campaignPayload.adsList[0],
              'Campaign End Time': new Date().toISOString(),
              'Campaign Start Time': new Date().toISOString(),
            },
          ],
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        message: 'Invalid request payload',
        errors: expect.any(Object),
      });
    });

    it('should return 400 for invalid platform', async () => {
      const response = await request(app)
        .post('/ads')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .set(Constants.X_TFS_USER_ID, 'testuserone')
        .send({
          clientId: 'client-id',
          userId: 'user-id',
          accountId: 'account-id',
          platform: 'InvalidPlatform',
          adsList: [],
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid platform selected',
      });
    });

    it('should return 403 if user context is missing', async () => {
      const response = await request(app)
        .post('/ads')
        .send({
          platform: 'Snapchat',
          adsList: [{ 'Campaign ID': '123', row: 1 }],
        })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toEqual({
        error: 'Invalid user context',
      });
    });

    it('should return 500 for internal server error', async () => {
      mockOrchestrateCampaignCreation.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/ads')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .set(Constants.X_TFS_USER_ID, 'testuserone')
        .send(campaignPayload)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
