import Assert from '@tfs/node-assert';
import { LRUCache } from 'lru-cache';
import * as Constants from '../constants.js';

let cache;

/**
 * Initialize cache
 * @param params
 * @param params.logger
 */
export const init = ({ logger }) => {
  cache = new LRUCache({
    max: 500,
    ttl: Constants.H_24_IN_MS,
    ttlAutopurge: true,
    allowStale: false,
    dispose(key, value) {
      logger.info(`cache expired for ${key}`);
    },
  });
  logger.info('Cache initialized...');
};

/**
 * Cache information to lru cache store
 * @param params
 * @param params.logger
 * @param params.key
 * @param params.value
 */
export const put = ({ logger, key, value }) => {
  Assert.notEmpty(key);
  cache.set(key, value);
  logger.info(`cache updated for ${key}`);
};

/**
 * Get information from cache
 * @param req
 * @param req.logger
 * @param req.key
 * @returns {*}
 */
export const get = ({ logger, key }) => {
  Assert.notEmpty(key);
  logger.info(`fetching from cache for ${key}`);
  return cache.get(key);
};

/**
 * Delete a specific entry from the cache
 * @param req
 * @param req.logger
 * @param req.key
 */
export const remove = ({ logger, key }) => {
  Assert.notEmpty(key);
  logger.info(`deleting from cache for ${key}`);
  if (cache.has(key)) {
    cache.delete(key);
  } else {
    logger.info(`key ${key} not found in cache`);
  }
};

/**
 * Get all keys from cache
 * @param params
 * @param params.logger
 * @returns {*}
 */
export const keys = ({ logger }) => {
  logger.info('fetching all keys from cache');
  return cache.keys();
};

/**
 * Clear all entries from the cache
 * @param params
 * @param params.logger
 */
export const clear = ({ logger }) => {
  logger.info('clearing all entries from cache');
  cache.clear();
};

/**
 * Print cache dump
 * @param params
 * @param params.logger
 * @warning Do not use this function in production
 */
// eslint-disable-next-line camelcase
export const _DO_NOT_USE_IN_PROD_printCache = ({ logger }) => {
  logger.warn('Do not use this function in production');
  if (cache.size === 0) {
    logger.log('Cache is empty');
    return;
  }
  logger.log('Printing Cache entries...');
  [...cache.keys({ logger })].forEach((key) => {
    logger.log({ [key]: cache.get(key) });
  });
};
