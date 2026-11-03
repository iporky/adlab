import { jest } from '@jest/globals';
import * as Constants from '../../../lib/constants';
import { setupDatabase, tearDownDatabase } from '../../__helpers__';
import { TokenConfigModel } from '../../../dal/schemas/tokenConfig.js';

const mockTokenConfig = {
  platform: 'Snapchat',
  xTFSAccountId: '(24)7.ai, Inc. Self Service',
  adAccountId: 'mock-ad-account-id',
  apiBaseUrl: 'https://adsapi.snapchat.com/v1',
  bypassJoiSchemaValidation: false,
  apps: [
    {
      clientId: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      accessToken: 'mock-access-token',
    },
  ],
  createdBy: 'migrations',
};

const mockCacheGet = jest.fn();
const mockCachePut = jest.fn();
const mockCacheRemove = jest.fn();

jest.unstable_mockModule('../../../lib/drivers/cache', () => ({
  get: mockCacheGet,
  put: mockCachePut,
  remove: mockCacheRemove,
  keys: () => ['tokenConfig-Snapchat'],
}));

describe('tokenConfigsDAL tests', () => {
  let tokenConfigsDAL;

  beforeAll(async () => {
    tokenConfigsDAL = await import('../../../dal/tokenConfigsDAL');
    await setupDatabase();
  });

  afterEach(() => {
    mockCacheGet.mockClear();
    mockCachePut.mockClear();
    mockCacheRemove.mockClear();
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  describe('insertTokenConfigIntoDB', () => {
    it('should insert token config and update cache when not replica set', async () => {
      const logger = { info: jest.fn() };
      mockCacheGet.mockReturnValue(false);

      await tokenConfigsDAL.insertTokenConfigIntoDB(mockTokenConfig, logger);

      expect(mockCachePut).toHaveBeenCalledWith({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform),
        value: mockTokenConfig,
      });
    });
  });

  describe('fetchTokenConfigFromDB', () => {
    it('should fetch token config from cache when available', async () => {
      const logger = { info: jest.fn() };
      mockCacheGet.mockReturnValue(mockTokenConfig);

      const result = await tokenConfigsDAL.fetchTokenConfigFromDB({ platform: mockTokenConfig.platform }, logger);

      expect(result).toEqual(mockTokenConfig);
      expect(mockCacheGet).toHaveBeenCalledWith({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform),
      });
      expect(mockCachePut).not.toHaveBeenCalled();
    });

    it('should fetch token config from DB and cache it when not in cache', async () => {
      const logger = { info: jest.fn() };
      mockCacheGet.mockReturnValue(null);

      await tokenConfigsDAL.insertTokenConfigIntoDB({ ...mockTokenConfig, platform: 'TikTok' }, logger);
      const result = await tokenConfigsDAL.fetchTokenConfigFromDB({ platform: mockTokenConfig.platform }, logger);

      expect(result).toBeTruthy();
      expect(mockCachePut).toHaveBeenCalled();
    });
  });

  describe('updateTokenConfigInDB', () => {
    it('should update token config and cache when not replica set', async () => {
      const logger = { info: jest.fn() };
      const updateData = { clientSecret: 'new-secret' };
      mockCacheGet.mockReturnValue(false);

      await tokenConfigsDAL.updateTokenConfigInDB({ platform: mockTokenConfig.platform }, updateData, logger);

      expect(mockCachePut).toHaveBeenCalled();
    });
  });

  describe('deleteTokenConfigFromDB', () => {
    it('should delete token config and remove from cache when not replica set', async () => {
      const logger = { info: jest.fn() };
      mockCacheGet.mockReturnValue(false);

      await tokenConfigsDAL.deleteTokenConfigFromDB({ platform: mockTokenConfig.platform }, logger);

      expect(mockCacheRemove).toHaveBeenCalledWith({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform),
      });
    });
  });

  describe('fetchAllTokenConfigsFromDB', () => {
    it('should fetch all token configs', async () => {
      const logger = { info: jest.fn() };

      await tokenConfigsDAL.insertTokenConfigIntoDB(mockTokenConfig, logger);
      const results = await tokenConfigsDAL.fetchAllTokenConfigsFromDB(logger);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('watchTokenConfigChangesInDB', () => {
    let mockWatch;
    let mockOn;

    beforeEach(() => {
      mockOn = jest.fn();
      mockWatch = jest.fn().mockReturnValue({ on: mockOn });
      TokenConfigModel.watch = mockWatch;
    });

    it('should not start watching if not replica set', async () => {
      const logger = { info: jest.fn(), warn: jest.fn() };
      mockCacheGet.mockReturnValue(false);

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);

      expect(logger.warn).toHaveBeenCalledWith('Cannot watch token config changes on non-replica set db');
      expect(mockWatch).not.toHaveBeenCalled();
    });

    it('should start watching if replica set', async () => {
      const logger = { info: jest.fn(), warn: jest.fn() };
      mockCacheGet.mockReturnValue(true);

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);

      expect(mockWatch).toHaveBeenCalled();
      expect(mockOn).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should handle insert operation', async () => {
      const logger = { info: jest.fn() };
      mockCacheGet.mockReturnValue(true);

      const change = {
        operationType: 'insert',
        fullDocument: { ...mockTokenConfig },
      };

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);
      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler(change);

      expect(mockCachePut).toHaveBeenCalledWith({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform),
        value: change.fullDocument,
      });
    });

    it('should handle update operation', async () => {
      const logger = { info: jest.fn() };
      const cacheKey = Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform);
      const documentKey = { _id: '123' };
      const updatedFields = { clientSecret: 'updated-secret' };

      mockCacheGet
        .mockReturnValueOnce(true) // for replica set check
        .mockReturnValueOnce({ _id: '123', ...mockTokenConfig }); // for cached entity

      const change = {
        operationType: 'update',
        documentKey,
        updateDescription: { updatedFields },
      };

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);
      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler(change);

      expect(mockCachePut).toHaveBeenCalledWith({
        logger,
        key: cacheKey,
        value: true,
      });
    });

    it('should handle delete operation', async () => {
      const logger = { info: jest.fn() };
      const cacheKey = Constants.TOKEN_CONFIG_CACHE_KEY(mockTokenConfig.platform);
      const documentKey = { _id: '123' };

      mockCacheGet
        .mockReturnValueOnce(true) // for replica set check
        .mockReturnValueOnce({ _id: '123', ...mockTokenConfig }); // for cached entity

      const change = {
        operationType: 'delete',
        documentKey,
      };

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);
      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler(change);

      expect(mockCacheRemove).toHaveBeenCalledWith({
        logger,
        key: cacheKey,
      });
    });

    it('should log warning for unhandled operations', async () => {
      const logger = { info: jest.fn(), warn: jest.fn() };
      mockCacheGet.mockReturnValue(true);

      const change = {
        operationType: 'unknown',
      };

      await tokenConfigsDAL.watchTokenConfigChangesInDB(logger);
      const changeHandler = mockOn.mock.calls[0][1];
      await changeHandler(change);

      expect(logger.warn).toHaveBeenCalledWith('Unhandled operation unknown on token config collection');
    });
  });
});
