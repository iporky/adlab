import { jest } from '@jest/globals';

const mockAdGroup = {
  name: 'Test Ad Group',
  campaignId: '67a212463f4e4efacc08f05a',
  platformAdGroupId: 'plat_123',
  platformCampaignId: 'plat_camp_123',
  platform: 'SNAPCHAT',
  status: 'ACTIVE',
  formData: {
    _id: '67a212463f4e4efacc08f05b',
    data: { targeting: 'test' },
  },
  createdBy: 'user123',
};

const mockCampaign = {
  _id: '67a212463f4e4efacc08f05a',
  platform: 'SNAPCHAT',
  formData: {
    _id: '67a212463f4e4efacc08f05b',
    data: { targeting: 'test' },
  },
};

describe('adgroupsDAL tests', () => {
  let adgroupsDAL;
  let mockSave;
  let mockExec;
  let mockUpdateOne;
  let mockFindById;
  let mockFind;
  let mockFindOne;
  let mockDeleteOne;

  beforeAll(async () => {
    mockSave = jest.fn();
    mockExec = jest.fn();
    mockUpdateOne = jest.fn();
    mockFindById = jest.fn();
    mockFind = jest.fn();
    mockFindOne = jest.fn();
    mockDeleteOne = jest.fn();

    // Mock AdGroupModel
    const mockAdGroupModel = function () {
      return {
        save: mockSave,
      };
    };
    mockAdGroupModel.updateOne = mockUpdateOne;
    mockAdGroupModel.findById = mockFindById;
    mockAdGroupModel.find = mockFind;
    mockAdGroupModel.findOne = mockFindOne;
    mockAdGroupModel.deleteOne = mockDeleteOne;

    // Mock AdModel
    const mockAdModel = {
      find: mockFind,
    };

    // Mock CampaignFormDataModel
    const mockCampaignFormDataModel = {
      updateOne: mockUpdateOne,
    };

    jest.unstable_mockModule('../../../dal/schemas/adgroups.js', () => ({
      AdGroupModel: mockAdGroupModel,
      validateDBObjectId: jest.fn(),
    }));

    jest.unstable_mockModule('../../../dal/schemas/ads.js', () => ({
      AdModel: mockAdModel,
    }));

    jest.unstable_mockModule('../../../dal/schemas/campaignFormData.js', () => ({
      CampaignFormDataModel: mockCampaignFormDataModel,
    }));

    jest.unstable_mockModule('../../../dal/campaignsDAL.js', () => ({
      fetchCampaignByIdFromDB: jest.fn().mockResolvedValue(mockCampaign),
    }));

    adgroupsDAL = await import('../../../dal/adgroupsDAL.js');
  });

  beforeEach(() => {
    mockSave.mockImplementation(function () {
      return { ...this };
    });
    mockExec.mockResolvedValue([]);
    mockFind.mockReturnValue({ exec: mockExec });
    mockFindById.mockReturnValue({ exec: mockExec });
    mockFindOne.mockReturnValue({ exec: mockExec });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdGroupInDB', () => {
    it('should create a new ad group', async () => {
      mockSave.mockResolvedValueOnce(mockAdGroup);

      const result = await adgroupsDAL.createAdGroupInDB(mockAdGroup);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockAdGroup);
    });

    it('should throw error when creation fails', async () => {
      mockSave.mockRejectedValueOnce(new Error('Creation failed'));

      await expect(adgroupsDAL.createAdGroupInDB(mockAdGroup)).rejects.toThrow('Creation failed');
    });
  });

  describe('updateAdGroupInDB', () => {
    it('should update ad group with form data', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';
      const updatePayload = {
        formData: { _id: '123', data: {} },
        updatedBy: 'user123',
      };

      await adgroupsDAL.updateAdGroupInDB(adGroupId, updatePayload);

      expect(mockUpdateOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error when no form data provided', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';

      await expect(adgroupsDAL.updateAdGroupInDB(adGroupId, {})).rejects.toThrow('Form data not found');
    });
  });

  describe('fetchAllAdGroupsForCampaignIdFromDB', () => {
    it('should fetch all ad groups for campaign', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce([{ ...mockAdGroup, toObject: () => mockAdGroup }]);

      const results = await adgroupsDAL.fetchAllAdGroupsForCampaignIdFromDB(campaignId);

      expect(mockFind).toHaveBeenCalledWith({ campaignId });
      expect(results[0]).toHaveProperty('formDataId');
    });
  });

  describe('fetchAdGroupByIdFromDB', () => {
    it('should fetch ad group with form data', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce({
        ...mockAdGroup,
        toObject: () => mockAdGroup,
      });

      const result = await adgroupsDAL.fetchAdGroupByIdFromDB(adGroupId);

      expect(mockFindById).toHaveBeenCalledWith(adGroupId);
      expect(result).toHaveProperty('platform');
      expect(result).toHaveProperty('formData');
    });
  });

  describe('deleteAdGroupFromDB', () => {
    it('should delete ad group when no associated ads exist', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce([]);

      await adgroupsDAL.deleteAdGroupFromDB(adGroupId);

      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: adGroupId });
    });

    it('should throw error when ad group has associated ads', async () => {
      const adGroupId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValueOnce([{ id: 'ad1' }]);

      await expect(adgroupsDAL.deleteAdGroupFromDB(adGroupId)).rejects.toThrow('Cannot delete ad group with associated ads');
    });
  });
});
