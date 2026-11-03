import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get placement targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getPlacementTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get placement targeting options');

  try {
    return res.status(200).json(targetingConstants.PLACEMENT);
  } catch (error) {
    logger.error(`Error fetching placement targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
