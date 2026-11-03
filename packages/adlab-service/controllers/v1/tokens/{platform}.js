import { getUserContextFromReq } from '../../../lib/util.js';
import * as Constants from '../../../lib/constants.js';
import * as tokensService from '../../../services/v1/tokenConfigs.js';

/**
 * Controller to fetch a token configuration by platform.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const fetchTokenConfig = async (req, res, next) => {
  const { platform } = req.params;
  const { logger } = req.app.locals;

  if (!Constants.AVAILABLE_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: 'Bad Request. Invalid platform.' });
  }

  try {
    const result = await tokensService.fetchTokenConfig({ platform }, logger);
    if (result) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ error: 'Token config not found' });
  } catch (error) {
    logger.error('Error fetching token config', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to update a token configuration by platform.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const updateTokenConfig = async (req, res, next) => {
  const { platform } = req.params;

  if (!Constants.AVAILABLE_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: 'Bad Request. Invalid platform.' });
  }

  const { body: updateData } = req;
  const { logger } = req.app.locals;

  const { userId } = getUserContextFromReq(req);
  if (!userId) {
    logger.error('User context not found');
    return res.status(400).json({ error: 'Bad Request' });
  }

  try {
    await tokensService.updateTokenConfig({ ...updateData, platform }, userId, logger);
    return res.status(204).send();
  } catch (error) {
    logger.error('Error updating token config', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Controller to delete a token configuration by platform.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const deleteTokenConfig = async (req, res, next) => {
  const { platform } = req.params;

  if (!Constants.AVAILABLE_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: 'Bad Request. Invalid platform.' });
  }

  const { logger } = req.app.locals;

  const { userId } = getUserContextFromReq(req);
  if (!userId) {
    logger.error('User context not found');
    return res.status(400).json({ error: 'Bad Request' });
  }

  try {
    await tokensService.deleteTokenConfig({ platform }, userId, logger);
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting token config', error);
    return res.status(500).json({ error: error.message });
  }
};
