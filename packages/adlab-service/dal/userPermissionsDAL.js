import * as cache from '../lib/drivers/cache.js';
import * as Constants from '../lib/constants.js';
import { UserPermissionsModel } from './schemas/userPermissions.js';

/**
 * Persist user permissions in DB and cache it for retrieval
 * @param params
 * @param params.userId
 * @param params.permissions
 * @param params.logger
 * @returns {Promise<void>}
 */
export const persistUserPermissionsInDB = async ({ userId, permissions, logger }) => {
  const updatedPermissions = await UserPermissionsModel.findOneAndUpdate(
    { userId },
    { permissions, createdAt: Date.now() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (updatedPermissions) {
    cache.put({
      logger,
      key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
      value: permissions,
      opts: { expiresIn: Constants.H_24_IN_MS },
    });
    logger.info(`User permissions persisted in DB and cached for ${userId}`);
  } else {
    logger.warn(`Failed to persist user permissions in DB for ${userId}`);
  }
};

/**
 * Get user permissions from cache or from DB and cache it for later retrieval
 * @param params
 * @param params.userId
 * @param params.logger
 * @returns {Promise<*>}
 */
export const getUserPermissionsFromDB = async ({ userId, logger }) => {
  let permissions;

  if (!permissions) {
    permissions = cache.get({
      logger,
      key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
    });
  }
  if (!permissions) {
    const permissionsObj = await UserPermissionsModel.findOne({ userId });
    if (permissionsObj) {
      permissions = permissionsObj.permissions;
      if (permissions) {
        cache.put({
          logger,
          key: Constants.USER_PERMISSIONS_CACHE_KEY(userId),
          value: permissions,
          options: { expiresIn: Constants.H_24_IN_MS },
        });
        logger.info(`User permissions fetched from DB and cached for ${userId}`);
      } else {
        logger.warn(`User permissions not found in DB for ${userId}`);
        return undefined;
      }
    }
  } else {
    logger.info(`User permissions fetched from cache for ${userId}`);
  }
  return permissions;
};
