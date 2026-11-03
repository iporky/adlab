import { jest } from '@jest/globals';

const mockAd = {
  _id: 'ad-123',
  platformAdId: 'platform-ad-123',
  platformAdGroupId: 'platform-adgroup-123',
  platform: 'Snapchat',
  status: 'ACTIVE',
  formData: { _id: 'form-123' },
  originalRecord: null,
  creatives: [
    {
      creative_id: 'creative-123',
      media_id: 'media-123',
    },
  ],
};

jest.unstable_mockModule('../../../dal/adsDAL.js', () => ({
  fetchAdsForAdGroupIdFromDB: jest.fn(),
  fetchAdByIdFromDB: jest.fn(),
  updateAdInDB: jest.fn(),
}));

jest.unstable_mockModule('../../../services/v1/orchestrator.js', () => ({
  performPlatformOperation: jest.fn(),
}));

let adsService;
let adsDAL;
let orchestrator;

describe('Ads Service', () => {
  let params;

  beforeAll(async () => {
    adsService = await import('../../../services/v1/ads');
    adsDAL = await import('../../../dal/adsDAL.js');
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

  describe('getAdsForAdGroup', () => {
    it('should fetch all ads successfully', async () => {
      adsDAL.fetchAdsForAdGroupIdFromDB.mockResolvedValue([mockAd]);

      const result = await adsService.getAdsForAdGroup('adgroup-123');

      expect(result).toEqual([mockAd]);
      expect(adsDAL.fetchAdsForAdGroupIdFromDB).toHaveBeenCalledWith('adgroup-123');
    });

    it('should handle fetch error', async () => {
      adsDAL.fetchAdsForAdGroupIdFromDB.mockRejectedValue(new Error('DB error'));

      await expect(adsService.getAdsForAdGroup('adgroup-123')).rejects.toThrow('Error fetching ads: DB error');
    });
  });

  describe('getAdById', () => {
    it('should fetch ad by id successfully', async () => {
      adsDAL.fetchAdByIdFromDB.mockResolvedValue(mockAd);

      const result = await adsService.getAdById('ad-123');

      expect(result).toEqual(mockAd);
      expect(adsDAL.fetchAdByIdFromDB).toHaveBeenCalledWith('ad-123');
    });

    it('should handle fetch error', async () => {
      adsDAL.fetchAdByIdFromDB.mockRejectedValue(new Error('DB error'));

      await expect(adsService.getAdById('ad-123')).rejects.toThrow('Error fetching ad: DB error');
    });
  });

  describe('updateAdById', () => {
    beforeEach(() => {
      adsDAL.fetchAdByIdFromDB.mockResolvedValue(mockAd);
      adsDAL.updateAdInDB.mockResolvedValue({});
    });

    it('should update Snapchat ad successfully', async () => {
      const updateData = { name: 'Updated Ad' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateAds: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await adsService.updateAdById('ad-123', updateData, params.userContext, params.logger);

      expect(adsDAL.updateAdInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should handle creative updates for TikTok', async () => {
      const tiktokAd = { ...mockAd, platform: 'TikTok' };
      adsDAL.fetchAdByIdFromDB.mockResolvedValue(tiktokAd);
      const updateData = {
        creatives: [
          {
            creative_id: 'new-creative-123',
            media_id: 'new-media-123',
          },
        ],
      };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          {
            updateAds: jest.fn().mockResolvedValue({ success: true }),
            updateCreatives: jest.fn().mockResolvedValue({ success: true }),
          },
          () => ({ platformStatus: 'ACTIVE' }),
          () => {},
          () => true,
        );
      });

      await adsService.updateAdById('ad-123', updateData, params.userContext, params.logger);

      expect(adsDAL.updateAdInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle TikTok status update', async () => {
      const tiktokAd = { ...mockAd, platform: 'TikTok' };
      adsDAL.fetchAdByIdFromDB.mockResolvedValue(tiktokAd);
      const updateData = { status: 'PAUSED' };

      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAd: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'PAUSED' }),
          () => {},
          () => true,
        );
      });

      await adsService.updateAdById('ad-123', updateData, params.userContext, params.logger);

      expect(adsDAL.updateAdInDB).toHaveBeenCalledTimes(2);
    });

    it('should handle update failure', async () => {
      const updateData = { name: 'Updated Ad' };
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { updateAds: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Update failed',
          () => false,
        );
      });

      await expect(adsService.updateAdById('ad-123', updateData, params.userContext, params.logger)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('deleteAdById', () => {
    it('should delete Snapchat ad successfully', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { deleteAd: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });

      await adsService.deleteAdById('ad-123', params.userContext, params.logger);

      expect(adsDAL.updateAdInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should delete TikTok ad successfully', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAd: jest.fn().mockResolvedValue({ success: true }) },
          () => ({ platformStatus: 'DELETED' }),
          () => {},
          () => true,
        );
      });
      const tiktokAd = { ...mockAd, platform: 'TikTok' };
      adsDAL.fetchAdByIdFromDB.mockResolvedValue(tiktokAd);
      await adsService.deleteAdById('ad-123', params.userContext, params.logger);

      expect(adsDAL.updateAdInDB).toHaveBeenCalledTimes(2);
      expect(orchestrator.performPlatformOperation).toHaveBeenCalled();
    });

    it('should handle delete failure', async () => {
      orchestrator.performPlatformOperation.mockImplementation(async (_, callback) => {
        await callback(
          { patchAd: jest.fn().mockResolvedValue({ success: false }) },
          () => {},
          () => 'Delete failed',
          () => false,
        );
      });

      await expect(adsService.deleteAdById('ad-123', params.userContext, params.logger)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
