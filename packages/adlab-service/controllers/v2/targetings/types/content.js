import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get content targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getContentTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get content targeting options');

  try {
    return res.status(200).json(targetingConstants.CONTENT);
  } catch (error) {
    logger.error(`Error fetching content targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
