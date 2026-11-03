import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';
import bodyParser from 'body-parser';

const app = express();
app.locals = {
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
};
app.use(bodyParser.json());

const mockCreateSavedAudience = jest.fn().mockResolvedValue({ id: '1' });
const mockSaveAudienceList = jest.fn().mockResolvedValue({ audiences: [] });
const mockDeleteSavedAudience = jest.fn().mockResolvedValue({ success: true });

jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  createSavedAudience: mockCreateSavedAudience,
  getSavedAudienceList: mockSaveAudienceList,
  deleteSavedAudience: mockDeleteSavedAudience,
}));

describe('Saved Audience API Tests', () => {
  beforeAll(async () => {
    const savedAudienceController = await import('../../../controllers/v1/savedAudience.js');
    app.post('/saved-audience', savedAudienceController.createSavedAudience);
    app.get('/saved-audience', savedAudienceController.getSavedAudienceList);
    app.delete('/saved-audience/:savedAudienceId', savedAudienceController.deleteSavedAudience);
  });

  test('createSavedAudience - success', async () => {
    const response = await request(app)
      .post('/saved-audience')
      .send({
        advertiserId: '123',
        accessToken: 'token',
        savedAudienceName: 'Test Audience',
        location: 'Test Location',
      })
      .expect(200);

    expect(response.body).toEqual({ id: '1' });
  });

  test('createSavedAudience - failure', async () => {
    mockCreateSavedAudience.mockRejectedValue(new Error('Creation failed'));

    const response = await request(app)
      .post('/saved-audience')
      .send({
        advertiserId: '123',
        accessToken: 'token',
        savedAudienceName: 'Test Audience',
        location: 'Test Location',
      })
      .expect(400);

    expect(response.body).toEqual({
      message: 'Could not create Saved Audience',
      errors: 'Creation failed',
    });
  });

  test('getSavedAudienceList - success', async () => {
    const response = await request(app)
      .get('/saved-audience')
      .query({
        savedAudienceIds: '1,2,3',
        page: '1',
        pageSize: '10',
      })
      .expect(200);

    expect(response.body).toEqual({ audiences: [] });
  });

  test('getSavedAudienceList - failure', async () => {
    mockSaveAudienceList.mockRejectedValue(new Error('Fetch failed'));

    const response = await request(app)
      .get('/saved-audience')
      .query({
        savedAudienceIds: '1,2,3',
        page: '1',
        pageSize: '10',
      })
      .expect(400);

    expect(response.body).toEqual({
      message: 'Could not fetch Saved Audience List',
      errors: 'Fetch failed',
    });
  });

  test('deleteSavedAudience - success', async () => {
    const response = await request(app).delete('/saved-audience/1').expect(200);

    expect(response.body).toEqual({ success: true });
  });

  test('deleteSavedAudience - failure', async () => {
    mockDeleteSavedAudience.mockRejectedValue(new Error('Deletion failed'));

    const response = await request(app).delete('/saved-audience/1').expect(400);

    expect(response.body).toEqual({
      message: 'Could not delete Saved Audience',
      errors: 'Deletion failed',
    });
  });
});
