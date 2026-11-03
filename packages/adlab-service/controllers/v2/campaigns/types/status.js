import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign status options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignStatus = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign status options');

  try {
    return res.status(200).json(campaignConstants.CAMPAIGN_STATUS);
  } catch (error) {
    logger.error(`Error fetching campaign status options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
