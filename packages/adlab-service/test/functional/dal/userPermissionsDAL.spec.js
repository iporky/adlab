import { jest } from '@jest/globals';
import { mocks } from 'adlab-shared';
import * as Constants from '../../../lib/constants';
import { setupDatabase, tearDownDatabase } from '../../__helpers__';

const mockCacheGet = jest.fn();
const mockCachePut = jest.fn();
jest.unstable_mockModule('../../../lib/drivers/cache', () => ({
  get: mockCacheGet,
  put: mockCachePut,
}));

describe('userPermissionsDAL tests', () => {
  let userPermissionsDAL;

  beforeAll(async () => {
    userPermissionsDAL = await import('../../../dal/userPermissionsDAL');
    await setupDatabase();
  });

  afterEach(() => {
    mockCacheGet.mockClear();
    mockCachePut.mockClear();
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  it('should persist user permissions in DB and cache it', async () => {
    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
    };
    const userId = 'test-user';

    await userPermissionsDAL.persistUserPermissionsInDB({
      userId,
      permissions: mocks.userPermissions,
      logger,
    });

    expect(mockCachePut).toHaveBeenCalledWith({
      logger,
      key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
      value: mocks.userPermissions,
      opts: { expiresIn: Constants.H_24_IN_MS },
    });
  });

  it('should fetch user permissions from cache when available', async () => {
    const userId = 'test-user';
    mockCacheGet.mockReturnValue(mocks.userPermissions);
    const logger = {
      info: jest.fn(),
    };
    const userPermissions = await userPermissionsDAL.getUserPermissionsFromDB({
      userId,
      logger,
    });
    expect(userPermissions).toEqual(mocks.userPermissions);
    expect(mockCacheGet).toHaveBeenCalledWith({
      logger,
      key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
    });
    expect(mockCachePut).toHaveBeenCalledTimes(0);
  });

  it('should fetch user permissions from DB when not available in cache', async () => {
    const userId = 'test-user';

    mockCacheGet.mockReturnValue(null);
    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
    };
    const userPermissions = await userPermissionsDAL.getUserPermissionsFromDB({
      userId,
      logger,
    });
    expect(userPermissions).toEqual(mocks.userPermissions);
    expect(mockCacheGet).toHaveBeenCalledWith({
      logger,
      key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
    });
    expect(mockCachePut).toHaveBeenCalledWith({
      logger,
      key: `${userId}--permissions`,
      value: mocks.userPermissions,
      options: { expiresIn: Constants.H_24_IN_MS },
    });
  });
});
