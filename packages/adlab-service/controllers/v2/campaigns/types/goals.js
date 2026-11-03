import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign objective goals
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignObjectiveGoals = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign objective goals');

  try {
    return res.status(200).json(campaignConstants.CAMPAIGN_GOALS);
  } catch (error) {
    logger.error(`Error fetching campaign objective goals: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
