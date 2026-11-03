import * as tokenConfigsDAL from '../../dal/tokenConfigsDAL.js';

/**
 * Service to insert a new token configuration.
 * @param {Object} tokenConfig - The token configuration to insert.
 * @param {Object} logger - The logger instance.
 * @param userId
 * @returns {Promise<Object>} The inserted token configuration.
 */
export const insertTokenConfig = async (tokenConfig, logger, userId) =>
  tokenConfigsDAL.insertTokenConfigIntoDB({ ...tokenConfig, userId }, logger);

/**
 * Service to fetch a token configuration by platform.
 * @param {Object} filters - The filters containing platform.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<Object|null>} The fetched token configuration.
 */
export const fetchTokenConfig = async (filters, logger) => tokenConfigsDAL.fetchTokenConfigFromDB(filters, logger);

/**
 * Service to update a token configuration by platform.
 * @param {Object} updateData - The data to update.
 * @param userId
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const updateTokenConfig = async (updateData, userId, logger) =>
  tokenConfigsDAL.updateTokenConfigInDB(
    { platform: updateData.platform },
    { ...updateData, updatedBy: userId },
    logger,
  );

/**
 * Service to delete a token configuration by platform.
 * @param {Object} filters - The filters containing platform.
 * @param userId
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const deleteTokenConfig = async (filters, userId, logger) =>
  tokenConfigsDAL.updateTokenConfigInDB({ ...filters, deleted: true }, userId, logger);

/**
 * Service to fetch all token configurations.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<Array>} The list of all token configurations.
 */
export const fetchAllTokenConfigs = async (logger) => tokenConfigsDAL.fetchAllTokenConfigsFromDB(logger);

/**
 * Service to watch for changes in the token configuration collection.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const watchTokenConfigChanges = async (logger) => tokenConfigsDAL.watchTokenConfigChangesInDB(logger);
