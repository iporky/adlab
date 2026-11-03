import * as cache from '../lib/drivers/cache.js';
import * as Constants from '../lib/constants.js';
import { TokenConfigModel } from './schemas/tokenConfig.js';

/**
 * Insert a new token configuration into the database and cache it.
 * @param {Object} tokenConfig - The token configuration to insert.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<Object>} The inserted token configuration.
 */
export const insertTokenConfigIntoDB = async (tokenConfig, logger) => {
  logger.info('Inserting token config', tokenConfig);
  const token = new TokenConfigModel(tokenConfig);
  await token.save();

  // Manually insert to cache only if db is not a replica set. ChangeStream handle cache update for replica set
  if (!cache.get({ logger, key: Constants.IS_DB_REPLICA_SET_CACHE_KEY })) {
    cache.put({
      logger,
      key: Constants.TOKEN_CONFIG_CACHE_KEY(tokenConfig.platform),
      value: tokenConfig,
    });
  }
  return token;
};

/**
 * Fetch a token configuration by platform from cache or database.
 * @param {Object} filters - The filters containing platform.
 * @param {Object} filters.platform
 * @param {Object} logger - The logger instance.
 * @returns {Promise<Object|null>} The fetched token configuration.
 */
export const fetchTokenConfigFromDB = async ({ platform }, logger) => {
  logger.info('Fetching token config', { platform });

  let tokenConfig = cache.get({
    logger,
    key: Constants.TOKEN_CONFIG_CACHE_KEY(platform),
  });

  if (!tokenConfig) {
    logger.info('Token config not found in cache, fetching from DB');
    tokenConfig = await TokenConfigModel.findOne({ platform })
      .exec()
      .then((doc) => doc.toObject());

    if (tokenConfig) {
      cache.put({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(platform),
        value: tokenConfig,
      });
    }
  }

  return tokenConfig;
};

/**
 * Update a token configuration by platform and cache the updated configuration.
 * @param {Object} filters - The filters containing platform.
 * @param {Object} filters.platform
 * @param {Object} updateData - The data to update.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const updateTokenConfigInDB = async ({ platform }, updateData, logger) => {
  logger.info('Updating token config', { platform });
  const newUpdate = { ...updateData, updatedOn: Date.now() };
  await TokenConfigModel.updateOne({ platform }, { $set: { ...newUpdate } });

  // Manually update cache only if db is not a replica set. ChangeStream handle cache update for replica set
  if (!cache.get({ logger, key: Constants.IS_DB_REPLICA_SET_CACHE_KEY })) {
    cache.put({
      logger,
      key: Constants.TOKEN_CONFIG_CACHE_KEY(platform),
      value: { ...newUpdate },
    });
  }
};

/**
 * Delete a token configuration by platform and remove it from cache.
 * @param {Object} filters - The filters containing platform.
 * @param {Object} filters.platform
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const deleteTokenConfigFromDB = async ({ platform }, logger) => {
  logger.info('Deleting token config', { platform });

  await TokenConfigModel.deleteOne({ platform });

  // Manually delete from cache only if db is not a replica set. ChangeStream handle cache update for replica set
  if (!cache.get({ logger, key: Constants.IS_DB_REPLICA_SET_CACHE_KEY })) {
    cache.remove({ logger, key: Constants.TOKEN_CONFIG_CACHE_KEY(platform) });
  }
};

/**
 * Fetch all token configurations from the database.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<Array>} The list of all token configurations.
 */
export const fetchAllTokenConfigsFromDB = async (logger) => {
  logger.info('Fetching all token configs');
  return TokenConfigModel.find().exec();
};

/**
 * Watch for changes in the token configuration collection and update cache accordingly.
 * @param {Object} logger - The logger instance.
 * @returns {Promise<void>}
 */
export const watchTokenConfigChangesInDB = async (logger) => {
  if (!cache.get({ logger, key: Constants.IS_DB_REPLICA_SET_CACHE_KEY })) {
    logger.warn('Cannot watch token config changes on non-replica set db');
    return;
  }

  logger.info('Watching token config changes on db...');

  TokenConfigModel.watch().on('change', async (change) => {
    const { operationType, documentKey } = change;

    const actOnCacheEntry = (action) => {
      const cacheKeyPrefix = 'tokenConfig-';

      for (const key of cache.keys({ logger })) {
        if (key.startsWith(cacheKeyPrefix)) {
          const cachedValue = cache.get({ logger, key });
          if (cachedValue && cachedValue._id.toString() === documentKey._id.toString()) {
            action(key);
            break;
          }
        }
      }
    };
    switch (operationType) {
    case 'insert': {
      const { fullDocument } = change;
      cache.put({
        logger,
        key: Constants.TOKEN_CONFIG_CACHE_KEY(fullDocument.platform),
        value: fullDocument,
      });
      break;
    }
    case 'update':
      actOnCacheEntry((key) => {
        const cacheEntity = cache.get({ logger, key });
        Object.assign(cacheEntity, change.updateDescription.updatedFields);
        cache.put({
          logger,
          key,
          value: cacheEntity,
        });
      });
      break;
    case 'delete':
      actOnCacheEntry((key) => cache.remove({ logger, key }));
      break;
    default:
      logger.warn(`Unhandled operation ${operationType} on token config collection`);
    }
  });
};
