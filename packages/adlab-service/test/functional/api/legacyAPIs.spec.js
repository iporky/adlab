import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { jest } from '@jest/globals';
import * as Constants from '../../../lib/constants.js';
import { payload as campaignPayload } from '../../__payloads__/snapchat/reqCampaigns.js';

const app = express();
app.locals = {
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
};
app.use(bodyParser.json());

describe('Legacy API Tests', () => {
  describe('/campaigns', () => {
    const mockCampaignsResponse = [
      {
        _id: '67a2129715e954fe3ef3aad2',
        platformCampaignId: null,
        campaign_name: 'tiktok-adlab-test-01',
      },
    ];
    const mockOrchestrateCampaignCreation = jest.fn().mockResolvedValue({ tally: 1, errors: {} });
    jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
      performPlatformOperation: jest.fn(),
      createCreativeFromMedia: jest.fn(),
      createMediaAndUpload: jest.fn(),
      orchestrateCampaignCreation: mockOrchestrateCampaignCreation,
    }));

    const mockGetAllCampaignsForClient = jest.fn().mockResolvedValue(mockCampaignsResponse);
    const mockGetCampaignById = jest.fn().mockResolvedValue({ id: '1', name: 'Test Campaign' });
    const mockUpdateCampaignById = jest.fn().mockResolvedValue({ message: 'Campaign updated successfully' });
    const mockDeleteCampaignById = jest.fn().mockResolvedValue({ message: 'Campaign deleted successfully' });
    jest.unstable_mockModule('../../../services/v1/campaigns.js', () => ({
      getAllCampaignsForClient: mockGetAllCampaignsForClient,
      getCampaignById: mockGetCampaignById,
      updateCampaignById: mockUpdateCampaignById,
      deleteCampaignById: mockDeleteCampaignById,
    }));

    beforeAll(async () => {
      const campaignsController = await import('../../../controllers/v1/campaigns.js');
      app.post('/campaigns', campaignsController.createCampaign);
      app.get('/campaigns', campaignsController.getAllCampaignsForClient);

      const campaignController = await import('../../../controllers/v1/campaigns/{campaignId}.js');
      app.get('/campaigns/:campaignId', campaignController.getCampaignById);
      app.put('/campaigns/:campaignId', campaignController.updateCampaignById);
      app.delete('/campaigns/:campaignId', campaignController.deleteCampaignById);
    });

    describe('POST /campaigns', () => {
      it('should create a new campaign and return it', async () => {
        const response = await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send(campaignPayload)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({
          message: '1 advertisements posted successfully to Snapchat.',
        });
      });

      it('should return a 403 status code if user context is not found', async () => {
        const response = await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .send(campaignPayload)
          .expect(403);

        expect(response.body).toEqual({ message: 'Invalid user context' });
      });

      it('should return a 400 status code if invalid platform is selected', async () => {
        const response = await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({ ...campaignPayload, platform: 'invalid' })
          .expect(400);

        expect(response.body).toEqual({ message: 'Invalid platform selected' });
      });

      it('should return a 400 status code if request payload is invalid', async () => {
        const response = await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({ ...campaignPayload, start_time: '01-24-2025' })
          .expect(400);

        expect(response.body).toEqual({
          message: 'Invalid request payload',
          errors: expect.any(Object),
        });
      });

      it('should return a 400 status code if an error occurs', async () => {
        mockOrchestrateCampaignCreation.mockResolvedValue({
          tally: 0,
          errors: {
            5436: { message: 'Error creating campaign' },
          },
        });
        const response = await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send(campaignPayload)
          .expect(400);

        expect(response.body).toEqual({
          message: `Could not publish ads to the ${campaignPayload.platform}`,
          errors: { 5436: { message: 'Error creating campaign' } },
        });
      });

      it('should return a 500 status code if an error occurs', async () => {
        mockOrchestrateCampaignCreation.mockRejectedValueOnce(new Error('Mocked error'));
        await request(app)
          .post('/campaigns')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send(campaignPayload)
          .expect(500);
      });
    });

    describe('GET /campaigns', () => {
      it('should return a list of campaigns', async () => {
        const response = await request(app)
          .get('/campaigns?platform=Snapchat')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual(mockCampaignsResponse);
      });

      it('should return a 400 status code if an invalid platform is selected', async () => {
        const response = await request(app)
          .get('/campaigns?platform=invalid-platform')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body).toEqual({
          error: 'Invalid platform',
        });
      });
      it('should return a 400 status code if user context is not found', async () => {
        const response = await request(app)
          .get('/campaigns?platform=TikTok')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone') // Missing client ID
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body).toEqual({ error: 'Bad Request' });
      });

      it('should return a 400 status code if an error occurs', async () => {
        mockGetAllCampaignsForClient.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app)
          .get('/campaigns?platform=Snapchat')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .expect('Content-Type', /json/)
          .expect(400);

        expect(response.body).toEqual({ error: 'Bad Request' });
      });
    });

    describe('GET /campaigns/{campaignId}', () => {
      it('should return 200 and the campaign data', async () => {
        const res = await request(app).get('/campaigns/1').expect('Content-Type', /json/).expect(200);

        expect(res.body).toEqual({ id: '1', name: 'Test Campaign' });
      });

      it('should return 400 if there is an error', async () => {
        mockGetCampaignById.mockRejectedValue(new Error('Error fetching campaign'));
        const res = await request(app).get('/campaigns/1').expect('Content-Type', /json/).expect(400);

        expect(res.body).toEqual({ error: 'Bad Request' });
      });
    });

    describe('PUT /campaigns/{campaignId}', () => {
      it('should return 200 and a success message', async () => {
        const res = await request(app)
          .put('/campaigns/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({ name: 'Updated Campaign' })
          .expect('Content-Type', /json/)
          .expect(200);

        expect(res.body).toEqual({ message: 'Campaign updated successfully' });
      });

      it('should return 403 if user context is missing', async () => {
        const res = await request(app)
          .put('/campaigns/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone') // Missing user ID
          .expect('Content-Type', /json/)
          .expect(403);

        expect(res.body).toEqual({ error: 'User context not found' });
      });

      it('should return 500 if there is an error', async () => {
        mockUpdateCampaignById.mockRejectedValue(new Error('Error updating campaign'));
        const res = await request(app)
          .put('/campaigns/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({ name: 'Updated Campaign' })
          .expect('Content-Type', /json/)
          .expect(500);

        expect(res.body).toEqual({ error: 'Error updating campaign' });
      });
    });

    describe('DELETE /campaigns/{campaignId}', () => {
      it('should return 200 and a success message', async () => {
        const res = await request(app)
          .delete('/campaigns/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(res.body).toEqual({ message: 'Campaign deleted successfully' });
      });

      it('should return 403 if user context is missing', async () => {
        const res = await request(app).delete('/campaigns/1').expect('Content-Type', /json/).expect(403);

        expect(res.body).toEqual({ error: 'User context not found' });
      });

      it('should return 500 if there is an error', async () => {
        mockDeleteCampaignById.mockRejectedValue(new Error('Error deleting campaign'));
        const res = await request(app)
          .delete('/campaigns/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(500);

        expect(res.body).toEqual({ error: 'Error deleting campaign' });
      });
    });
  });

  describe('/adgroups', () => {
    const mockAdGroupsResponse = { adGroups: [{ id: '1', name: 'Test Ad Group' }] };
    const mockGetAllAdGroupsForCampaign = jest.fn().mockResolvedValue(mockAdGroupsResponse);
    const mockGetAdGroupById = jest.fn().mockResolvedValue({ id: '1', name: 'Test Ad Group' });
    const mockUpdateAdGroupById = jest.fn().mockResolvedValue({ message: 'Ad group updated successfully' });
    const mockDeleteAdGroupById = jest.fn().mockResolvedValue({ message: 'Ad group deleted successfully' });
    jest.unstable_mockModule('../../../services/v1/adgroups.js', () => ({
      getAllAdGroupsForCampaign: mockGetAllAdGroupsForCampaign,
      getAdGroupById: mockGetAdGroupById,
      updateAdGroupById: mockUpdateAdGroupById,
      deleteAdGroupById: mockDeleteAdGroupById,
    }));

    beforeAll(async () => {
      const adGroupsController = await import('../../../controllers/v1/adgroups.js');
      app.get('/adgroups', adGroupsController.getAllAdGroupsForCampaign);

      const adGroupController = await import('../../../controllers/v1/adgroups/{adGroupId}.js');
      app.get('/adgroups/:adGroupId', adGroupController.getAdGroupById);
      app.put('/adgroups/:adGroupId', adGroupController.updateAdGroupById);
      app.delete('/adgroups/:adGroupId', adGroupController.deleteAdGroupById);
    });

    describe('GET /adgroups', () => {
      it('should return a list of ad groups', async () => {
        const response = await request(app).get('/adgroups?campaignId=123').expect('Content-Type', /json/).expect(200);

        expect(response.body).toEqual(mockAdGroupsResponse);
      });

      it('should return a 500 status code if an error occurs', async () => {
        mockGetAllAdGroupsForCampaign.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app).get('/adgroups?campaignId=123').expect('Content-Type', /json/).expect(500);

        expect(response.body).toEqual({ error: 'Internal server error' });
      });
    });

    describe('GET /adgroups/{adGroupId}', () => {
      it('should fetch an ad group by ID', async () => {
        const response = await request(app).get('/adgroups/1').expect('Content-Type', /json/).expect(200);

        expect(response.body).toEqual({ id: '1', name: 'Test Ad Group' });
      });

      it('should return 500 if there is an error', async () => {
        mockGetAdGroupById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app).get('/adgroups/1').expect('Content-Type', /json/).expect(500);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('PUT /adgroups/{adGroupId}', () => {
      it('should update an ad group by ID', async () => {
        const updateData = { name: 'Updated Ad Group' };
        const response = await request(app)
          .put('/adgroups/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send(updateData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({ message: 'Ad group updated successfully' });
      });

      it('should return 403 if user context is not found', async () => {
        const response = await request(app).put('/adgroups/1').send({}).expect(403);

        expect(response.body).toEqual({ message: 'Invalid user context' });
      });

      it('should return 500 if there is an error', async () => {
        mockUpdateAdGroupById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app)
          .put('/adgroups/invalid-id')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({})
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({ error: 'Mocked error' });
      });
    });

    describe('DELETE /adgroups/{adGroupId}', () => {
      it('should delete an ad group by ID', async () => {
        const response = await request(app)
          .delete('/adgroups/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({ message: 'Ad group deleted successfully' });
      });

      it('should return 403 if user context is not found', async () => {
        const response = await request(app).delete('/adgroups/1').expect(403);

        expect(response.body).toEqual({ message: 'Invalid user context' });
      });

      it('should return 500 if there is an error', async () => {
        mockDeleteAdGroupById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app)
          .delete('/adgroups/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({ error: 'Mocked error' });
      });
    });
  });

  describe('/ads', () => {
    const mockAdsResponse = { ads: [{ id: '1', name: 'Test Ad' }] };
    const mockGetAdsForAdGroup = jest.fn().mockResolvedValue(mockAdsResponse);
    const mockGetAdById = jest.fn().mockResolvedValue({ id: '1', name: 'Test Ad' });
    const mockUpdateAdById = jest.fn().mockResolvedValue({ message: 'Ad updated successfully' });
    const mockDeleteAdById = jest.fn().mockResolvedValue({ message: 'Ad deleted successfully' });
    jest.unstable_mockModule('../../../services/v1/ads.js', () => ({
      getAdsForAdGroup: mockGetAdsForAdGroup,
      getAdById: mockGetAdById,
      updateAdById: mockUpdateAdById,
      deleteAdById: mockDeleteAdById,
    }));

    beforeAll(async () => {
      const adsController = await import('../../../controllers/v1/ads.js');
      app.get('/ads', adsController.getAdsForAdGroup);

      const adController = await import('../../../controllers/v1/ads/{adId}.js');
      app.get('/ads/:adId', adController.getAdById);
      app.put('/ads/:adId', adController.updateAdById);
      app.delete('/ads/:adId', adController.deleteAdById);
    });

    describe('GET /ads', () => {
      it('should return a list of ads', async () => {
        const response = await request(app).get('/ads?adGroupId=123').expect('Content-Type', /json/).expect(200);

        expect(response.body).toEqual(mockAdsResponse);
      });

      it('should return a 500 status code if an error occurs', async () => {
        mockGetAdsForAdGroup.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app).get('/ads?adGroupId=123').expect('Content-Type', /json/).expect(500);

        expect(response.body).toEqual({ error: 'Internal server error' });
      });
    });

    describe('GET /ads/{adId}', () => {
      it('should fetch an ad by ID', async () => {
        const response = await request(app).get('/ads/1').expect('Content-Type', /json/).expect(200);

        expect(response.body).toEqual({ id: '1', name: 'Test Ad' });
      });

      it('should return 500 if there is an error', async () => {
        mockGetAdById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app).get('/ads/1').expect('Content-Type', /json/).expect(500);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('PUT /ads/{adId}', () => {
      it('should update an ad by ID', async () => {
        const updateData = { name: 'Updated Ad' };
        const response = await request(app)
          .put('/ads/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send(updateData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({ message: 'Ad updated successfully' });
      });

      it('should return 403 if user context is not found', async () => {
        const response = await request(app).put('/ads/1').send({}).expect(403);

        expect(response.body).toEqual({ error: 'Invalid user context' });
      });

      it('should return 500 if there is an error', async () => {
        mockUpdateAdById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app)
          .put('/ads/invalid-id')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .send({})
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({ error: 'Mocked error' });
      });
    });

    describe('DELETE /ads/{adId}', () => {
      it('should delete an ad by ID', async () => {
        const response = await request(app)
          .delete('/ads/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toEqual({ message: 'Ad deleted successfully' });
      });

      it('should return 403 if user context is not found', async () => {
        const response = await request(app).delete('/ads/1').expect(403);

        expect(response.body).toEqual({ error: 'Invalid user context' });
      });

      it('should return 500 if there is an error', async () => {
        mockDeleteAdById.mockRejectedValueOnce(new Error('Mocked error'));
        const response = await request(app)
          .delete('/ads/1')
          .set(Constants.X_TFS_CLIENT_ID, 'testclientone')
          .set(Constants.X_TFS_ACCOUNT_ID, 'testaccountone')
          .set(Constants.X_TFS_USER_ID, 'testuserone')
          .expect('Content-Type', /json/)
          .expect(500);

        expect(response.body).toEqual({ error: 'Mocked error' });
      });
    });
  });
});
