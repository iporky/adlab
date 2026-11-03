import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
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

const previewRequest = {
  creativeId: '8b5e671e-6f0c-4b6d-99fa-3b143487941d',
  platform: 'Snapchat',
};
const mockPreviewResponse = {
  creative_id: '8b5e671e-6f0c-4b6d-99fa-3b143487941d',
  request_status: 'SUCCESS',
  expires_at: '2021-09-30T00:00:00.000Z',
  request_id: 'mocked-request-id',
  snapcode_link: 'https://snapchat.com/snapcode',
};

const mockGetPreviewForCreative = jest.fn().mockResolvedValue(mockPreviewResponse);
jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  getPreviewForCreative: mockGetPreviewForCreative,
}));

describe('Preview API Tests', () => {
  beforeAll(async () => {
    const previewController = await import('../../../controllers/v1/preview.js');
    app.get('/preview', previewController.getPreviewForCreative);
  });
  describe('GET /preview', () => {
    it('should return 200 and an valid preview response', async () => {
      const response = await request(app)
        .get('/preview')
        .query(previewRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPreviewResponse);
    });

    it('should return error for invalid platform', async () => {
      const response = await request(app)
        .get('/preview')
        .query({ creativeId: previewRequest.creativeId })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Invalid platform' });
    });

    it('should return 400 and validation errors for an invalid payload', async () => {
      const response = await request(app)
        .get('/preview')
        .query({ platform: 'Snapchat' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Either creativeId in query params or creative_info in request body must be provided',
      });
    });

    it('should return 500 for an internal server error', async () => {
      mockGetPreviewForCreative.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .get('/preview')
        .query(previewRequest)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
