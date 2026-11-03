import * as cache from '../lib/drivers/cache.js';
import * as Constants from '../lib/constants.js';
import { RoleMappingModel } from './schemas/roleMappings.js';

/**
 * Get role mappings from db and cache it for retrieval
 * @param req
 * @param req.logger
 * @returns {Promise<*>}
 */
export const getRoleMappingsFromDB = async ({ logger }) => {
  let roleMappings = cache.get({ logger, key: 'roleMappings' });

  if (!roleMappings) {
    roleMappings = await RoleMappingModel.find().exec();
    cache.put({
      logger,
      key: 'roleMappings',
      value: roleMappings,
      opts: { expiresIn: Constants.H_24_IN_MS },
    });
    logger.info('Role mappings fetched from DB and cached');
  } else {
    logger.info('Role mappings fetched from cache');
  }

  return roleMappings;
};
