import { jest } from '@jest/globals';
import { mocks } from 'adlab-shared';
import * as Constants from '../../../lib/constants';
import { setupDatabase, tearDownDatabase } from '../../__helpers__';

const { roleMappings } = mocks;

jest.unstable_mockModule('../../../lib/drivers/cache.js', () => ({
  put: jest.fn(),
  get: jest.fn(),
}));

describe('getRoleMappings', () => {
  let cache;
  let roleMappingDAL;

  beforeAll(async () => {
    cache = await import('../../../lib/drivers/cache.js');
    roleMappingDAL = await import('../../../dal/roleMappingDAL.js');
  });

  afterEach(() => {
    cache.get.mockReset();
    cache.put.mockReset();
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  it('should get role mappings from cache', async () => {
    cache.get.mockReturnValue(roleMappings);

    const logger = {
      info: jest.fn(),
    };

    const response = await roleMappingDAL.getRoleMappingsFromDB({ logger });

    expect(response).toEqual(roleMappings);
    expect(cache.get).toHaveBeenCalledWith({
      logger,
      key: 'roleMappings',
    });
    expect(cache.put).toHaveBeenCalledTimes(0);
  });

  it('should get role mappings from db and cache it', async () => {
    await setupDatabase(async () => {
      await roleMappingDAL.getRoleMappingsFromDB.create(roleMappings);
    });

    cache.get.mockReturnValue(null);
    cache.put.mockImplementation();

    const logger = {
      info: jest.fn(),
    };

    const response = await roleMappingDAL.getRoleMappingsFromDB({ logger });

    expect(cache.get).toHaveBeenCalledWith({
      logger,
      key: 'roleMappings',
    });
    expect(cache.put).toHaveBeenCalledWith({
      logger,
      key: 'roleMappings',
      value: response,
      opts: { expiresIn: Constants.H_24_IN_MS },
    });
  });
});
