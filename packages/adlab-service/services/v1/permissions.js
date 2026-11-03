import axios from 'axios';
import Assert from '@tfs/node-assert';
import { mocks } from 'adlab-shared';
import * as Constants from '../../lib/constants.js';
import { getRoleMappingsFromDB } from '../../dal/roleMappingDAL.js';
import { getUserPermissionsFromDB, persistUserPermissionsInDB } from '../../dal/userPermissionsDAL.js';

/**
 * Deduce relevant accounts and user permissions from UMS response
 * @param umsResponse
 * @param roleMappings
 * @returns {{clients: {}}}
 * @private
 */
const _deduceRelevantAccountsAndUserPermissions = (umsResponse, roleMappings) => ({
  clients: umsResponse.clients.reduce((acc, client) => {
    const clientObj = {
      clientDisplayName: client.clientDisplayName,
      accounts: {},
    };

    client.accounts.forEach((account) => {
      const product = account.products.find((prod) => prod.productId === 'personalization');
      if (!product) return;

      const permissions = product.roles.reduce((perms, role) => {
        const roleMapping = roleMappings.find((mapping) => mapping.ecRole === role);
        if (roleMapping) {
          perms.push(...roleMapping.permissions);
        }
        return perms;
      }, []);

      clientObj.accounts[account.accountId] = {
        accountDisplayName: account.accountDisplayName,
        permissions,
      };
    });

    if (Object.keys(clientObj.accounts).length > 0) {
      acc[client.clientId] = clientObj;
    }
    return acc;
  }, {}),
});

/**
 * Fetch UMS response for the given user id
 * @param params
 * @param params.userId
 * @param params.logger
 * @param params.config
 * @returns {Promise<*>}
 * @private
 */
const _fetchUMSResponse = async ({ userId, logger, config }) => {
  let umsResponse;

  const isUMSAuthZEnabled = config.get(Constants.UMS_AUTH_ENABLED);

  if (isUMSAuthZEnabled) {
    const productId = config.get(Constants.UMS_PRODUCT_ID);
    const umsIssuerUrl = config.get(Constants.UMS_ISSUER);

    Assert.isString(userId);
    Assert.isString(productId);
    Assert.isString(umsIssuerUrl);

    try {
      umsResponse = await axios.get(`${umsIssuerUrl}/${userId}`, {
        params: {
          productId,
        },
      });
      logger.info(`User role mappings fetched for ${userId}`);
    } catch (error) {
      logger.error('Error occurred while fetching UMS data', { error });
      throw error;
    }
  } else {
    logger.info('UMS AuthZ is disabled. Fetching mock role mappings');
    umsResponse = { data: mocks.userAuthorityFromUMS };
  }

  return umsResponse.data;
};

/**
 * Get user permissions for the given oidc provider user id,
 * persist it in DB and cache it for quicker retrieval
 * @param params
 * @param params.userId
 * @param params.logger
 * @param params.config
 * @returns {Promise<*>}
 */
export const getUserPermissions = async ({ userId, logger, config }) => {
  try {
    let userPermissions = await getUserPermissionsFromDB({ userId, logger });

    if (userPermissions) {
      logger.info(`User permissions fetched from cache for ${userId}`);
      return userPermissions;
    }

    const umsResponse = await _fetchUMSResponse({ userId, logger, config });
    const roleMappings = await getRoleMappingsFromDB({ logger });

    logger.info('App level mappings fetched');

    /**
     * Transform UMS response to user permissions. Object structure:
     * { clients: {
     *   clientId1: { accounts: {
     *     accountId1: ['permission1', 'permission2'],
     *     accountId2: ['permission1', 'permission2']
     *   } },
     *   clientId2: { accounts: {
     *    accountId1: ['permission1', 'permission2'],
     *   } }
     * } }
     */
    userPermissions = _deduceRelevantAccountsAndUserPermissions(umsResponse, roleMappings);

    await persistUserPermissionsInDB({
      userId,
      permissions: userPermissions,
      logger,
    });

    return userPermissions;
  } catch (error) {
    logger.error(`Error occurred while fetching user permissions for ${userId}`, { error });
    throw error;
  }
};
