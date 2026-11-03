import { jest } from '@jest/globals';
import { mocks } from 'adlab-shared';
import * as Constants from '../../../lib/constants';

const { userAuthorityFromUMS, roleMappings } = mocks;

jest.unstable_mockModule('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: userAuthorityFromUMS,
      }),),
  },
}));
jest.unstable_mockModule('../../../dal/roleMappingDAL', () => ({
  getRoleMappingsFromDB: jest.fn(),
}));
jest.unstable_mockModule('../../../dal/userPermissionsDAL', () => ({
  getUserPermissionsFromDB: jest.fn(),
  persistUserPermissionsInDB: jest.fn(),
}));

let permissionsService;
let roleMappingDAL;
let userPermissionsDAL;

describe('Permissions Service', () => {
  let params;

  beforeAll(async () => {
    permissionsService = await import('../../../services/v1/permissions');
    roleMappingDAL = await import('../../../dal/roleMappingDAL');
    userPermissionsDAL = await import('../../../dal/userPermissionsDAL');
  });

  beforeAll(() => {
    params = {
      userId: 'testUserId',
      logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
      config: new Map(
        Object.entries({
          [Constants.UMS_AUTH_ENABLED]: true,
          [Constants.UMS_ISSUER]: 'https://test.com',
          [Constants.UMS_PRODUCT_ID]: 'testProductId',
        }),
      ),
    };

    jest.clearAllMocks();
  });

  it('should get user permissions from cache', async () => {
    roleMappingDAL.getRoleMappingsFromDB.mockImplementation(() => Promise.resolve(roleMappings));

    userPermissionsDAL.getUserPermissionsFromDB.mockImplementation(() => Promise.resolve(userAuthorityFromUMS));

    const result = await permissionsService.getUserPermissions(params);

    expect(result).toBeDefined();
    expect(roleMappingDAL.getRoleMappingsFromDB).toHaveBeenCalledTimes(0);
    expect(userPermissionsDAL.persistUserPermissionsInDB).toHaveBeenCalledTimes(0);
    expect(userPermissionsDAL.getUserPermissionsFromDB).toHaveBeenCalledTimes(1);
  });

  it('should use mock data when UMS AuthZ is disabled', async () => {
    const paramsWithDisabledUMS = {
      ...params,
      config: new Map(
        Object.entries({
          [Constants.UMS_AUTH_ENABLED]: false,
        }),
      ),
    };

    roleMappingDAL.getRoleMappingsFromDB.mockResolvedValue(roleMappings);
    userPermissionsDAL.getUserPermissionsFromDB.mockResolvedValue(undefined);
    userPermissionsDAL.persistUserPermissionsInDB.mockResolvedValue();
    const axios = await import('axios');
    const axiosGetSpy = jest.spyOn(axios.default, 'get');

    const result = await permissionsService.getUserPermissions(paramsWithDisabledUMS);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('clients');
    expect(roleMappingDAL.getRoleMappingsFromDB).toHaveBeenCalledTimes(1);
    expect(userPermissionsDAL.persistUserPermissionsInDB).toHaveBeenCalledTimes(1);

    expect(axiosGetSpy).not.toHaveBeenCalled();
    expect(params.logger.info).toHaveBeenCalledWith('UMS AuthZ is disabled. Fetching mock role mappings');
  });

  it('should deduce user permissions if cache and db returns undefined', async () => {
    roleMappingDAL.getRoleMappingsFromDB.mockImplementation(() => Promise.resolve(roleMappings));

    userPermissionsDAL.getUserPermissionsFromDB.mockImplementation(() => Promise.resolve(undefined));
    userPermissionsDAL.persistUserPermissionsInDB.mockImplementation(() => Promise.resolve());

    const result = await permissionsService.getUserPermissions(params);

    expect(result).toBeDefined();
    expect(roleMappingDAL.getRoleMappingsFromDB).toHaveBeenCalledTimes(1);
    expect(userPermissionsDAL.getUserPermissionsFromDB).toHaveBeenCalledTimes(1);
    expect(userPermissionsDAL.persistUserPermissionsInDB).toHaveBeenCalledTimes(1);
  });

  it('should handle error while fetching UMS data', async () => {
    const paramsWithDisabledUMS = {
      ...params,
      config: new Map(
        Object.entries({
          [Constants.UMS_AUTH_ENABLED]: true,
          [Constants.UMS_ISSUER]: 'https://test.com',
          [Constants.UMS_PRODUCT_ID]: 'testProductId',
        }),
      ),
    };

    const axios = await import('axios');
    const axiosGetSpy = jest.spyOn(axios.default, 'get').mockRejectedValue(new Error('UMS error'));

    try {
      await expect(permissionsService.getUserPermissions(paramsWithDisabledUMS)).rejects.toThrow('UMS error');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('UMS error');
    }

    expect(axiosGetSpy).toHaveBeenCalled();
    expect(params.logger.error).toHaveBeenCalled();
  });
});
