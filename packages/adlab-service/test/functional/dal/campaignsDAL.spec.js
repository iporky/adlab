import { jest } from '@jest/globals';

const mockCampaign = {
  name: 'Test Campaign',
  clientId: 'client123',
  accountId: 'account123',
  platform: 'Facebook',
  createdBy: 'user123',
};

const mockFormData = {
  data: { targetAudience: 'Adults' },
  createdBy: 'user123',
};

const mockAdGroup = {
  campaignId: '67a212463f4e4efacc08f05a',
  name: 'Test Ad Group',
};

describe('campaignsDAL tests', () => {
  let campaignsDAL;
  let mockSave;
  let mockExec;
  let mockUpdateOne;
  let mockFindById;
  let mockFind;
  let mockFindOne;

  beforeAll(async () => {
    mockSave = jest.fn();
    mockExec = jest.fn();
    mockUpdateOne = jest.fn();
    mockFindById = jest.fn();
    mockFind = jest.fn();
    mockFindOne = jest.fn();

    const mockCampaignModel = function () {
      return {
        save: mockSave,
      };
    };
    mockCampaignModel.updateOne = mockUpdateOne;
    mockCampaignModel.findById = mockFindById;
    mockCampaignModel.find = mockFind;
    mockCampaignModel.deleteOne = jest.fn();

    // Mock CampaignFormDataModel
    const mockCampaignFormDataModel = function () {
      return {
        save: mockSave,
      };
    };
    mockCampaignFormDataModel.updateOne = mockUpdateOne;
    mockCampaignFormDataModel.findOne = mockFindOne;

    // Mock AdGroupModel
    const mockAdGroupModel = {
      find: mockFind,
    };

    jest.unstable_mockModule('../../../dal/schemas/campaigns.js', () => ({
      CampaignModel: mockCampaignModel,
      validateDBObjectId: jest.fn(),
      validateStringForNoSQLInjection: jest.fn(),
    }));

    jest.unstable_mockModule('../../../dal/schemas/campaignFormData.js', () => ({
      CampaignFormDataModel: mockCampaignFormDataModel,
    }));

    jest.unstable_mockModule('../../../dal/schemas/adgroups.js', () => ({
      AdGroupModel: mockAdGroupModel,
    }));

    campaignsDAL = await import('../../../dal/campaignsDAL.js');
  });

  beforeEach(() => {
    mockSave.mockImplementation(function () {
      return { ...this, toObject: () => this };
    });
    mockExec.mockResolvedValue([]);
    mockFind.mockReturnValue({ exec: mockExec });
    mockFindById.mockReturnValue({ exec: mockExec });
    mockFindOne.mockReturnValue({ exec: mockExec });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCampaignInDB', () => {
    it('should create campaign with form data', async () => {
      const payload = {
        formData: mockFormData,
        ...mockCampaign,
      };

      const result = await campaignsDAL.createCampaignInDB(payload);

      expect(mockSave).toHaveBeenCalledTimes(2);
      expect(result).toBeTruthy();
      expect(result.formData).toBeTruthy();
    });

    it('should throw error when form data is missing', async () => {
      await expect(campaignsDAL.createCampaignInDB(mockCampaign)).rejects.toThrow('Form data not found');
    });
  });

  describe('updateCampaignInDB', () => {
    it('should update campaign with new form data', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      const updatePayload = {
        formData: { _id: '67a212463f4e4efacc08f05b', data: { updated: true } },
        name: 'Updated Campaign',
        updatedBy: 'user123',
      };

      await campaignsDAL.updateCampaignInDB(campaignId, updatePayload);

      expect(mockUpdateOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error when no update data provided', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      await expect(campaignsDAL.updateCampaignInDB(campaignId, {})).rejects.toThrow('Form data not found');
    });
  });

  describe('deleteCampaignFromDB', () => {
    it('should delete campaign when no ad groups exist', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValue([]);

      await campaignsDAL.deleteCampaignFromDB(campaignId);

      expect(mockFind).toHaveBeenCalled();
    });

    it('should throw error when campaign has ad groups', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      mockExec.mockResolvedValue([mockAdGroup]);

      await expect(campaignsDAL.deleteCampaignFromDB(campaignId)).rejects.toThrow(
        'Cannot delete campaign with associated ad groups',
      );
    });
  });

  describe('fetchAllCampaignsFromDB', () => {
    it('should fetch campaigns with filters', async () => {
      const filters = {
        clientId: 'client123',
        accountId: 'account123',
        platform: 'Facebook',
      };
      mockExec.mockResolvedValue([mockCampaign]);

      const results = await campaignsDAL.fetchAllCampaignsFromDB(filters);

      expect(mockFind).toHaveBeenCalledWith(filters);
      expect(results).toEqual([mockCampaign]);
    });
  });

  describe('fetchCampaignByIdFromDB', () => {
    it('should fetch campaign with form data', async () => {
      const campaignId = '67a212463f4e4efacc08f05a';
      const mockCampaignWithFormId = {
        ...mockCampaign,
        formDataId: '67a212463f4e4efacc08f05b',
        toObject: () => ({ ...mockCampaign, formDataId: '67a212463f4e4efacc08f05b' }),
      };
      const mockFormDataResult = {
        ...mockFormData,
        toObject: () => mockFormData,
      };

      mockExec.mockResolvedValueOnce(mockCampaignWithFormId).mockResolvedValueOnce(mockFormDataResult);

      const result = await campaignsDAL.fetchCampaignByIdFromDB(campaignId);

      expect(mockFindById).toHaveBeenCalledWith(campaignId);
      expect(result.formData).toBeTruthy();
    });
  });
});
