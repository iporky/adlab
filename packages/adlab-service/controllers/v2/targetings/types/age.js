import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get age targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getAgeTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get age targeting options');

  try {
    return res.status(200).json(targetingConstants.AGE);
  } catch (error) {
    logger.error(`Error fetching age targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
