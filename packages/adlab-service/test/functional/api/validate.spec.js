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

describe('Validate API Tests', () => {
  beforeAll(async () => {
    const validateController = await import('../../../controllers/v1/validate.js');
    app.post('/validate', validateController.validateAdMappings);
  });

  describe('POST /validate', () => {
    it('should return 200 and an empty object for a valid payload', async () => {
      const payload = {
        optimization_goal: 'IMPRESSIONS',
        objective: 'BRAND_AWARENESS',
        creatives: [
          {
            id: 'creative1',
            ad_type: 'SNAP_AD',
            adgroup_type: 'SNAP_ADS',
            creative_type: 'SNAP_AD',
            call_to_action: 'BOOK_NOW',
          },
          {
            id: 'creative2',
            ad_type: 'APP_INSTALL',
            adgroup_type: 'SNAP_ADS',
            creative_type: 'APP_INSTALL',
            call_to_action: 'INSTALL_NOW',
          },
        ],
      };

      const response = await request(app)
        .post('/validate')
        .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
        .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({});
    });

    it('should return 200 and validation errors for an invalid payload', async () => {
      // Custom Message Test
      let payload = {
        optimization_goal: 'USES',
        objective: 'LENS_ENGAGEMENT',
        creatives: [
          {
            id: 'creative1',
            ad_type: 'REMOTE_WEBPAGE',
            adgroup_type: 'LENS',
            creative_type: 'SNAP_ADS',
            call_to_action: 'TRY',
          },
        ],
      };

      let response = await request(app).post('/validate').send(payload).expect(200);

      let expected = {
        ad_type: [
          "When 'adgroup_type = LENS', ad_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
          "When 'optimization_goal = USES', ad_type must be one of [LENS, LENS_APP_INSTALL, LENS_DEEP_LINK, LENS_REMOTE_WEBPAGE]",
        ],
        creative_type: [
          "When 'ad_type = REMOTE_WEBPAGE', creative_type must be one of [WEB_VIEW]",
          "When 'optimization_goal = USES', creative_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
          "When 'adgroup_type = LENS', creative_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
        ],
      };
      expect(response.body).toHaveProperty('creative1');
      expect(response.body.creative1).toEqual(expected);

      // Basic Validation
      payload = {
        optimization_goal: 'USES',
        objective: 'LENS_ENGAGEMENT',
        creatives: [
          {
            id: 'creative1',
            ad_type: 'REMOTE_WEBPAGE',
            adgroup_type: 'LENS',
            creative_type: 'SNAP_ADS',
            call_to_action: '',
          },
        ],
      };

      response = await request(app).post('/validate').send(payload).expect(200);

      expected = {
        ad_type: [
          "When 'adgroup_type = LENS', ad_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
          "When 'optimization_goal = USES', ad_type must be one of [LENS, LENS_APP_INSTALL, LENS_DEEP_LINK, LENS_REMOTE_WEBPAGE]",
        ],
        call_to_action: ['"call_to_action" is not allowed to be empty'],
        creative_type: [
          "When 'ad_type = REMOTE_WEBPAGE', creative_type must be one of [WEB_VIEW]",
          "When 'optimization_goal = USES', creative_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
          "When 'adgroup_type = LENS', creative_type must be one of [LENS, LENS_WEB_VIEW, LENS_APP_INSTALL, LENS_DEEP_LINK]",
        ],
      };
      expect(response.body).toHaveProperty('creative1');
      expect(response.body.creative1).toEqual(expected);
    });

    it('should return 400 for a malformed request', async () => {
      const payload = {
        optimization_goal: 'USES',
        objective: 'LENS_ENGAGEMENT',
        // Missing creatives array
      };

      const response = await request(app).post('/validate').send(payload).expect(400);

      expect(response.body).toHaveProperty('error', 'Bad Request');
    });
  });
});
