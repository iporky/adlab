import { jest } from '@jest/globals';

const mockAd = {
  name: 'Test Ad',
  adGroupId: '67a212463f4e4efacc08f05a',
  platformAdId: 'plat_123',
  platformAdGroupId: 'plat_group_123',
  platform: 'SNAPCHAT',
  status: 'ACTIVE',
  formData: {
    _id: '67a212463f4e4efacc08f05b',
    data: { creative: 'test' },
  },
  createdBy: 'user123',
};

const mockAdGroup = {
  _id: '67a212463f4e4efacc08f05a',
  platform: 'SNAPCHAT',
  formData: {
    _id: '67a212463f4e4efacc08f05b',
    data: { targeting: 'test' },
  },
};

describe('adsDAL tests', () => {
  let adsDAL;
  let mockSave;
  let mockExec;
  let mockUpdateOne;
  let mockFindById;
  let mockFind;
  let mockInsertMany;

  beforeAll(async () => {
    mockSave = jest.fn();
    mockExec = jest.fn();
    mockUpdateOne = jest.fn();
    mockFindById = jest.fn();
    mockFind = jest.fn();
    mockInsertMany = jest.fn();

    // Mock AdModel
    const mockAdModel = function () {
      return {
        save: mockSave,
      };
    };
    mockAdModel.updateOne = mockUpdateOne;
    mockAdModel.findById = mockFindById;
    mockAdModel.find = mockFind;
    mockAdModel.insertMany = mockInsertMany;

    // Mock CampaignFormDataModel
    const mockCampaignFormDataModel = {
      updateOne: mockUpdateOne,
    };

    jest.unstable_mockModule('../../../dal/schemas/ads.js', () => ({
      AdModel: mockAdModel,
      validateDBObjectId: jest.fn(),
    }));

    jest.unstable_mockModule('../../../dal/schemas/campaignFormData.js', () => ({
      CampaignFormDataModel: mockCampaignFormDataModel,
    }));

    jest.unstable_mockModule('../../../dal/adgroupsDAL.js', () => ({
      fetchAdGroupByIdFromDB: jest.fn().mockResolvedValue(mockAdGroup),
    }));

    adsDAL = await import('../../../dal/adsDAL.js');
  });

  beforeEach(() => {
    mockSave.mockImplementation(function () {
      return { ...this };
    });
    mockExec.mockResolvedValue([]);
    mockFind.mockReturnValue({ exec: mockExec });
    mockFindById.mockReturnValue({ exec: mockExec });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdsInDB', () => {
    it('should create multiple ads', async () => {
      const adsData = [mockAd, mockAd];
      mockInsertMany.mockResolvedValueOnce(adsData);

      const result = await adsDAL.createAdsInDB(adsData);

      expect(mockInsertMany).toHaveBeenCalledWith(adsData);
      expect(result).toEqual(adsData);
    });

    it('should throw error when bulk creation fails', async () => {
      mockInsertMany.mockRejectedValueOnce(new Error('Bulk creation failed'));

      await expect(adsDAL.createAdsInDB([mockAd])).rejects.toThrow('Bulk creation failed');
    });
  });

  describe('createAdInDB', () => {
    it('should create a new ad', async () => {
      mockSave.mockResolvedValueOnce(mockAd);

      const result = await adsDAL.createAdInDB(mockAd);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockAd);
    });

    it('should throw error when creation fails', async () => {
      mockSave.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(adsDAL.createAdInDB(mockAd)).rejects.toThrow('Creation failed');
    });
  });

  describe('fetchAdsForAdGroupIdFromDB', () => {
    it('should fetch all ads for ad group', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce([mockAd]);

      const results = await adsDAL.fetchAdsForAdGroupIdFromDB(adGroupId);

      expect(mockFind).toHaveBeenCalledWith({ adGroupId });
      expect(results).toEqual([mockAd]);
    });
  });

  describe('fetchAdByIdFromDB', () => {
    it('should fetch ad with associated data', async () => {
      const adId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce({
        ...mockAd,
        toObject: () => mockAd,
      });

      const result = await adsDAL.fetchAdByIdFromDB(adId);

      expect(mockFindById).toHaveBeenCalledWith(adId);
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('formData');
    });
  });

  describe('updateAdInDB', () => {
    it('should update ad with form data', async () => {
      const adId = '67a212463f4e4efacc08f05a';
      const updatePayload = {
        formData: { _id: '123', data: {} },
        updatedBy: 'user123',
      };

      await adsDAL.updateAdInDB(adId, updatePayload);

      expect(mockUpdateOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error when no form data provided', async () => {
      const adId = '67a212463f4e4efacc08f05a';

      await expect(adsDAL.updateAdInDB(adId, {})).rejects.toThrow('Form data not found');
    });

    it('should allow update when ad is marked as deleted', async () => {
      const adId = '67a212463f4e4efacc08f05a';
      const updatePayload = {
        deleted: true,
        updatedBy: 'user123',
      };

      await adsDAL.updateAdInDB(adId, updatePayload);

      expect(mockUpdateOne).toHaveBeenCalledTimes(1);
    });
  });
});
