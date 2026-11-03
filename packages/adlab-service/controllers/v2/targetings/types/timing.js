import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get timing targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getTimingTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get timing targeting options');

  try {
    return res.status(200).json(targetingConstants.TIMING);
  } catch (error) {
    logger.error(`Error fetching timing targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
