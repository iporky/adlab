import { jest } from '@jest/globals';

const mockTokenConfig = {
  platform: 'Snapchat',
  clientId: 'client-123',
  accountId: 'account-123',
};

jest.unstable_mockModule('../../../dal/tokenConfigsDAL.js', () => ({
  insertTokenConfigIntoDB: jest.fn(),
  fetchTokenConfigFromDB: jest.fn(),
  updateTokenConfigInDB: jest.fn(),
  fetchAllTokenConfigsFromDB: jest.fn(),
  watchTokenConfigChangesInDB: jest.fn(),
}));

let tokenConfigsService;
let tokenConfigsDAL;

describe('Token Configs Service', () => {
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
  };
  const mockUserId = 'testUserId';

  beforeAll(async () => {
    tokenConfigsService = await import('../../../services/v1/tokenConfigs');
    tokenConfigsDAL = await import('../../../dal/tokenConfigsDAL.js');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertTokenConfig', () => {
    it('should insert token config successfully', async () => {
      const expectedConfig = { ...mockTokenConfig, userId: mockUserId };
      tokenConfigsDAL.insertTokenConfigIntoDB.mockResolvedValue(expectedConfig);

      const result = await tokenConfigsService.insertTokenConfig(mockTokenConfig, mockLogger, mockUserId);

      expect(result).toEqual(expectedConfig);
      expect(tokenConfigsDAL.insertTokenConfigIntoDB).toHaveBeenCalledWith(expectedConfig, mockLogger);
    });
  });

  describe('fetchTokenConfig', () => {
    it('should fetch token config by filters', async () => {
      const filters = { platform: 'Snapchat' };
      tokenConfigsDAL.fetchTokenConfigFromDB.mockResolvedValue(mockTokenConfig);

      const result = await tokenConfigsService.fetchTokenConfig(filters, mockLogger);

      expect(result).toEqual(mockTokenConfig);
      expect(tokenConfigsDAL.fetchTokenConfigFromDB).toHaveBeenCalledWith(filters, mockLogger);
    });
  });

  describe('updateTokenConfig', () => {
    it('should update token config successfully', async () => {
      const updateData = { platform: 'Snapchat', clientId: 'new-client-123' };
      const expectedUpdate = { ...updateData, updatedBy: mockUserId };

      await tokenConfigsService.updateTokenConfig(updateData, mockUserId, mockLogger);

      expect(tokenConfigsDAL.updateTokenConfigInDB).toHaveBeenCalledWith(
        { platform: updateData.platform },
        expectedUpdate,
        mockLogger,
      );
    });
  });

  describe('deleteTokenConfig', () => {
    it('should mark token config as deleted', async () => {
      const filters = { platform: 'Snapchat' };

      await tokenConfigsService.deleteTokenConfig(filters, mockUserId, mockLogger);

      expect(tokenConfigsDAL.updateTokenConfigInDB).toHaveBeenCalledWith(
        { ...filters, deleted: true },
        mockUserId,
        mockLogger,
      );
    });
  });

  describe('fetchAllTokenConfigs', () => {
    it('should fetch all token configs', async () => {
      const mockConfigs = [mockTokenConfig];
      tokenConfigsDAL.fetchAllTokenConfigsFromDB.mockResolvedValue(mockConfigs);

      const result = await tokenConfigsService.fetchAllTokenConfigs(mockLogger);

      expect(result).toEqual(mockConfigs);
      expect(tokenConfigsDAL.fetchAllTokenConfigsFromDB).toHaveBeenCalledWith(mockLogger);
    });
  });

  describe('watchTokenConfigChanges', () => {
    it('should watch token config changes', async () => {
      await tokenConfigsService.watchTokenConfigChanges(mockLogger);

      expect(tokenConfigsDAL.watchTokenConfigChangesInDB).toHaveBeenCalledWith(mockLogger);
    });
  });
});
