import { jest } from '@jest/globals';

const mockAdGroup = {
  _id: 'adgroup-123',
  platformAdGroupId: 'platform-adgroup-123',
  platformCampaignId: 'platform-campaign-123',
  platform: 'Snapchat',
  status: 'ACTIVE',
  formData: { _id: 'form-123' },
  originalRecord: null,
};

jest.unstable_mockModule('../../../dal/adgroupsDAL.js', () => ({
  fetchAllAdGroupsForCampaignIdFromDB: jest.fn(),
  fetchAdGroupByIdFromDB: jest.fn(),
  updateAdGroupInDB: jest.fn(),
}));

jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  performPlatformOperation: jest.fn(),
}));

let adGroupsService;
let adGroupsDAL;
let orchestrator;

describe('Ad Groups Service', () => {
  let params;

  beforeAll(async () => {
    adGroupsService = await import('../../../services/v1/adgroups');
    adGroupsDAL = await import('../../../dal/adgroupsDAL.js');
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

  describe('getAllAdGroupsForCampaign', () => {
    it('should fetch all ad groups successfully', async () => {
      adGroupsDAL.fetchAllAdGroupsForCampaignIdFromDB.mockResolvedValue([mockAdGroup]);

      const result = await adGroupsService.getAllAdGroupsForCampaign('campaign-123');

      expect(result).toEqual([mockAdGroup]);
      expect(adGroupsDAL.fetchAllAdGroupsForCampaignIdFromDB).toHaveBeenCalledWith('campaign-123');
    });

    it('should handle fetch error', async () => {
      adGroupsDAL.fetchAllAdGroupsForCampaignIdFromDB.mockRejectedValue(new Error('DB error'));

      await expect(adGroupsService.getAllAdGroupsForCampaign('campaign-123')).rejects.toThrow(
        'Error fetching ad groups: DB error',
      );
    });
  });

  describe('getAdGroupById', () => {
    it('should fetch ad group by id successfully', async () => {
      adGroupsDAL.fetchAdGroupByIdFromDB.mockResolvedValue(mockAdGroup);

      const result = await adGroupsService.getAdGroupById('adgroup-123');

      expect(result).toEqual(mockAdGroup);
      expect(adGroupsDAL.fetchAdGroupByIdFromDB).toHaveBeenCalledWith('adgroup-123');
    });

    it('should handle fetch error', async () => {
      adGroupsDAL.fetchAdGroupByIdFromDB.mockRejectedValue(new Error('DB error'));

      await expect(adGroupsService.getAdGroupById('adgroup-123')).rejects.toThrow('Error fetching ad group: DB error');
    });
  });

  describe('updateAdGroupById', () => {
    beforeEach(() => {
      adGroupsDAL.fetchAdGroupByIdFromDB.mockResolvedValue(mockAdGroup);
      adGroupsDAL.updateAdGroupInDB.mockResolvedValue({});
    });

    it('should update Snapchat ad group successfully', async () => {
      const updateData = { name: 'Updated Ad Group' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateAdGroups: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await adGroupsService.updateAdGroupById('adgroup-123', updateData, params.userContext, params.logger);

      expect(adGroupsDAL.updateAdGroupInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should update TikTok ad group successfully', async () => {
      const tiktokAdGroup = { ...mockAdGroup, platform: 'TikTok' };
      adGroupsDAL.fetchAdGroupByIdFromDB.mockResolvedValue(tiktokAdGroup);
      const updateData = { name: 'Updated Ad Group' };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateAdGroups: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await adGroupsService.updateAdGroupById('adgroup-123', updateData, params.userContext, params.logger);

      expect(adGroupsDAL.updateAdGroupInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle TikTok status update', async () => {
      const tiktokAdGroup = { ...mockAdGroup, platform: 'TikTok' };
      adGroupsDAL.fetchAdGroupByIdFromDB.mockResolvedValue(tiktokAdGroup);
      const updateData = { status: 'PAUSED' };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAdGroup: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'PAUSED' }),
          () => {},
          () => true,
        );
      });

      await adGroupsService.updateAdGroupById('adgroup-123', updateData, params.userContext, params.logger);

      expect(adGroupsDAL.updateAdGroupInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle update failure', async () => {
      const updateData = { name: 'Updated Ad Group' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateAdGroups: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Update failed',
          () => false,
        );
      });

      await expect(
        adGroupsService.updateAdGroupById('adgroup-123', updateData, params.userContext, params.logger),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteAdGroupById', () => {
    it('should delete Snapchat ad group successfully', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { deleteAdGroup: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });

      await adGroupsService.deleteAdGroupById('adgroup-123', params.userContext, params.logger);

      expect(adGroupsDAL.updateAdGroupInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should delete TikTok ad group successfully', async () => {
      const tiktokAdGroup = { ...mockAdGroup, platform: 'TikTok' };
      adGroupsDAL.fetchAdGroupByIdFromDB.mockResolvedValue(tiktokAdGroup);

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAdGroup: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });

      await adGroupsService.deleteAdGroupById('adgroup-123', params.userContext, params.logger);

      expect(adGroupsDAL.updateAdGroupInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle delete failure', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAdGroup: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Delete failed',
          () => false,
        );
      });

      await expect(adGroupsService.deleteAdGroupById('adgroup-123', params.userContext, params.logger)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
