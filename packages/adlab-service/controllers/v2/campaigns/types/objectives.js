import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign objectives
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignObjectives = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign objectives');

  try {
    return res.status(200).json(campaignConstants.CAMPAIGN_OBJECTIVE);
  } catch (error) {
    logger.error(`Error fetching campaign objectives: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
