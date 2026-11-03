import campaignServices from '../../src/snapchat/services/campaignServices.js';
import RequestHelper from '../../src/snapchat/helpers/requestHelper.js';
import campaignSchema from '../../../adlab-shared/src/schemas/snapchat/campaignSchema.js';
import { createError } from '../../src/snapchat/utils/errorHandler.js';
import { mapCampaignData } from '../../src/snapchat/utils/parameterMapper.js';

jest.mock('../../src/snapchat/helpers/requestHelper.js');
jest.mock('../../../adlab-shared/src/schemas/snapchat/campaignSchema.js');
jest.mock('../../src/snapchat/utils/errorHandler.js');
jest.mock('../../src/snapchat/utils/parameterMapper.js');

describe('campaignServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCampaigns', () => {
    it('should retrieve all campaigns for a given ad account', async () => {
      const adAccountId = '123';
      const mockResponse = { data: 'some data' };
      RequestHelper.get.mockResolvedValue(mockResponse);

      const result = await campaignServices.getAllCampaigns({ adAccountId });

      expect(RequestHelper.get).toHaveBeenCalledWith(`/adaccounts/${adAccountId}/campaigns/`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCampaign', () => {
    it('should retrieve a specific campaign by its ID', async () => {
      const campaignId = '456';
      const mockResponse = { data: 'some data' };
      RequestHelper.get.mockResolvedValue(mockResponse);

      const result = await campaignServices.getCampaign({ campaignId });

      expect(RequestHelper.get).toHaveBeenCalledWith(`/campaigns/${campaignId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createCampaigns', () => {
    it('should create new campaigns for a given ad account', async () => {
      const adAccountId = '123';
      const campaignData = [{ name: 'Campaign 1' }];
      const mappedData = { name: 'Mapped Campaign 1' };
      const mockResponse = { data: 'some data' };

      campaignSchema.validate.mockReturnValue({ error: null });
      mapCampaignData.mockReturnValue(mappedData);
      RequestHelper.post.mockResolvedValue(mockResponse);

      const result = await campaignServices.createCampaigns({
        adAccountId,
        campaignData,
      });

      expect(RequestHelper.post).toHaveBeenCalledWith(`/adaccounts/${adAccountId}/campaigns/`, {
        campaigns: [mappedData],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if campaignData is not an array', async () => {
      const adAccountId = '123';
      const campaignData = 'not an array';

      createError.mockImplementation(() => {
        throw new Error('campaignData should be an array of campaigns');
      });

      await expect(campaignServices.createCampaigns({ adAccountId, campaignData })).rejects.toThrow(
        'campaignData should be an array of campaigns',
      );
    });

    it('should throw an error if campaign data is invalid', async () => {
      const adAccountId = '123';
      const campaignData = [{ name: 'Invalid Campaign' }];
      const validationError = { details: [{ message: 'Invalid data' }] };

      campaignSchema.validate.mockReturnValue({ error: validationError });
      createError.mockImplementation(() => {
        throw new Error(validationError.details[0].message);
      });

      await expect(campaignServices.createCampaigns({ adAccountId, campaignData })).rejects.toThrow('Invalid data');
    });
  });

  describe('updateCampaigns', () => {
    it('should update existing campaigns for a given ad account', async () => {
      const adAccountId = '123';
      const campaignData = [{ name: 'Campaign 1', status: 'active' }];
      const mappedData = { name: 'Mapped Campaign 1', status: 'active' };
      const mockResponse = { data: 'some data' };

      campaignSchema.validate.mockReturnValue({ error: null });
      mapCampaignData.mockReturnValue(mappedData);
      RequestHelper.put.mockResolvedValue(mockResponse);

      const result = await campaignServices.updateCampaigns({
        adAccountId,
        campaignData,
      });

      expect(RequestHelper.put).toHaveBeenCalledWith(`/adaccounts/${adAccountId}/campaigns/`, {
        campaigns: [mappedData],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if campaignData is not an array', async () => {
      const adAccountId = '123';
      const campaignData = 'not an array';

      createError.mockImplementation(() => {
        throw new Error('campaignData should be an array of campaigns');
      });

      await expect(campaignServices.updateCampaigns({ adAccountId, campaignData })).rejects.toThrow(
        'campaignData should be an array of campaigns',
      );
    });

    it('should throw an error if campaign data exceeds the limit', async () => {
      const adAccountId = '123';
      const campaignData = new Array(101).fill({ name: 'Campaign' });

      createError.mockImplementation(() => {
        throw new Error('adAccount can have only 100 campaigns');
      });

      await expect(campaignServices.updateCampaigns({ adAccountId, campaignData })).rejects.toThrow(
        'adAccount can have only 100 campaigns',
      );
    });

    it('should throw an error if campaign data is invalid', async () => {
      const adAccountId = '123';
      const campaignData = [{ name: 'Invalid Campaign' }];
      const validationError = { details: [{ message: 'Invalid data' }] };

      campaignSchema.validate.mockReturnValue({ error: validationError });
      createError.mockImplementation(() => {
        throw new Error(validationError.details[0].message);
      });

      await expect(campaignServices.updateCampaigns({ adAccountId, campaignData })).rejects.toThrow('Invalid data');
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a specific campaign by its ID', async () => {
      const campaignId = '456';
      const mockResponse = { data: 'some data' };
      RequestHelper.remove.mockResolvedValue(mockResponse);

      const result = await campaignServices.deleteCampaign({ campaignId });

      expect(RequestHelper.remove).toHaveBeenCalledWith(`/campaigns/${campaignId}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
