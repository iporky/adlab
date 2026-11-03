import { jest } from '@jest/globals';

const mockCampaign = {
  _id: 'campaign-123',
  platformCampaignId: 'platform-123',
  platform: 'snapchat',
  status: 'ACTIVE',
  formData: { _id: 'form-123' },
  originalRecord: null,
};

jest.unstable_mockModule('../../../dal/campaignsDAL.js', () => ({
  fetchAllCampaignsFromDB: jest.fn(),
  fetchCampaignByIdFromDB: jest.fn(),
  updateCampaignInDB: jest.fn(),
  deleteCampaignFromDB: jest.fn(),
}));

jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  performPlatformOperation: jest.fn(),
}));

let campaignsService;
let campaignsDAL;
let orchestrator;

describe('Campaigns Service', () => {
  let params;

  beforeAll(async () => {
    campaignsService = await import('../../../services/v1/campaigns');
    campaignsDAL = await import('../../../dal/campaignsDAL.js');
    orchestrator = await import('../../../services/v1/orchestrator.js');
  });

  beforeEach(() => {
    params = {
      userContext: { userId: 'testUserId' },
      logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
    };

    jest.clearAllMocks();
  });

  describe('getAllCampaignsForClient', () => {
    const filters = {
      clientId: 'test-client',
      accountId: 'test-account',
      platform: 'Snapchat',
    };

    it('should fetch all campaigns successfully', async () => {
      campaignsDAL.fetchAllCampaignsFromDB.mockResolvedValue([mockCampaign]);

      const result = await campaignsService.getAllCampaignsForClient(filters);

      expect(result).toEqual([mockCampaign]);
      expect(campaignsDAL.fetchAllCampaignsFromDB).toHaveBeenCalledWith(filters);
    });

    it('should handle fetch error', async () => {
      campaignsDAL.fetchAllCampaignsFromDB.mockRejectedValue(new Error('DB error'));

      await expect(campaignsService.getAllCampaignsForClient(filters)).rejects.toThrow(
        'Error fetching campaigns: DB error',
      );
    });
  });

  describe('getCampaignById', () => {
    it('should fetch campaign by id successfully', async () => {
      campaignsDAL.fetchCampaignByIdFromDB.mockResolvedValue(mockCampaign);

      const result = await campaignsService.getCampaignById('campaign-123');

      expect(result).toEqual(mockCampaign);
      expect(campaignsDAL.fetchCampaignByIdFromDB).toHaveBeenCalledWith('campaign-123');
    });

    it('should handle fetch error', async () => {
      campaignsDAL.fetchCampaignByIdFromDB.mockRejectedValue(new Error('DB error'));

      await expect(campaignsService.getCampaignById('campaign-123')).rejects.toThrow(
        'Error fetching campaign: DB error',
      );
    });
  });

  describe('updateCampaignById', () => {
    beforeEach(() => {
      campaignsDAL.fetchCampaignByIdFromDB.mockResolvedValue(mockCampaign);
      campaignsDAL.updateCampaignInDB.mockResolvedValue({});
    });

    it('should update Snapchat campaign successfully', async () => {
      const updateData = { name: 'Updated Campaign' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateCampaigns: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await campaignsService.updateCampaignById('campaign-123', false, updateData, params.userContext, params.logger);

      expect(campaignsDAL.updateCampaignInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should update TikTok campaign successfully', async () => {
      const tiktokCampaign = { ...mockCampaign, platform: 'TikTok' };
      campaignsDAL.fetchCampaignByIdFromDB.mockResolvedValue(tiktokCampaign);
      const updateData = { name: 'Updated Campaign' };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateCampaigns: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await campaignsService.updateCampaignById('campaign-123', true, updateData, params.userContext, params.logger);

      expect(campaignsDAL.updateCampaignInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle TikTok status update', async () => {
      const tiktokCampaign = { ...mockCampaign, platform: 'TikTok' };
      campaignsDAL.fetchCampaignByIdFromDB.mockResolvedValue(tiktokCampaign);
      const updateData = { status: 'PAUSED' };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchCampaign: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'PAUSED' }),
          () => {},
          () => true,
        );
      });

      await campaignsService.updateCampaignById('campaign-123', true, updateData, params.userContext, params.logger);

      expect(campaignsDAL.updateCampaignInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle update failure', async () => {
      const updateData = { name: 'Updated Campaign' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateCampaigns: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Update failed',
          () => false,
        );
      });

      await expect(
        campaignsService.updateCampaignById('campaign-123', false, updateData, params.userContext, params.logger),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteCampaignById', () => {
    it('should delete TikTok campaign successfully', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { deleteCampaign: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });

      await campaignsService.deleteCampaignById('campaign-123', false, params.userContext, params.logger);

      expect(campaignsDAL.updateCampaignInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should delete Snapchat campaign successfully', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { deleteCampaign: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });
      const snapchatCampaign = { ...mockCampaign, platform: 'Snapchat' };
      campaignsDAL.fetchCampaignByIdFromDB.mockResolvedValue(snapchatCampaign);

      await campaignsService.deleteCampaignById('campaign-123', false, params.userContext, params.logger);

      expect(campaignsDAL.updateCampaignInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should handle delete failure', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { deleteCampaign: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Delete failed',
          () => false,
        );
      });

      await expect(
        campaignsService.deleteCampaignById('campaign-123', false, params.userContext, params.logger),
      ).rejects.toThrow('Delete failed');
    });
  });
});
