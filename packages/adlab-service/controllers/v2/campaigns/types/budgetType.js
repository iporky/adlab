import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign budget types
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignBudgetTypes = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign budget types');

  try {
    return res.status(200).json(campaignConstants.BUDGET);
  } catch (error) {
    logger.error(`Error fetching campaign budget types: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
