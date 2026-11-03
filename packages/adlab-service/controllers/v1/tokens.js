import * as tokenConfigsService from '../../services/v1/tokenConfigs.js';
import { getUserContextFromReq } from '../../lib/util.js';

/**
 * Controller to insert a new token configuration.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const insertTokenConfig = async (req, res, next) => {
  const { body: tokenConfig } = req;
  const { logger } = req.app.locals;

  const { userId } = getUserContextFromReq(req);
  if (!userId) {
    logger.error('User context not found');
    return res.status(400).json({ error: 'Bad Request' });
  }

  try {
    const result = await tokenConfigsService.insertTokenConfig(tokenConfig, logger, userId);
    return res.status(201).json(result);
  } catch (error) {
    logger.error('Error inserting token config', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to fetch all token configurations.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const fetchAllTokenConfigs = async (req, res, next) => {
  const { logger } = req.app.locals;

  try {
    const result = await tokenConfigsService.fetchAllTokenConfigs(logger);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Error fetching all token configs', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to watch for changes in the token configuration collection.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const watchTokenConfigChanges = async (req, res, next) => {
  const { logger } = req.app.locals;

  try {
    await tokenConfigsService.watchTokenConfigChanges(logger);
    return res.status(200).send('Watching token config changes');
  } catch (error) {
    logger.error('Error watching token config changes', error);
    return res.status(500).json({ error: error.message });
  }
};
