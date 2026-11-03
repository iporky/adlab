import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign budget pacing options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignBudgetPacing = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign budget pacing options');

  try {
    return res.status(200).json(campaignConstants.BUDGET_PACING);
  } catch (error) {
    logger.error(`Error fetching campaign budget pacing options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
