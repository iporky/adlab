import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign types
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignTypes = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign types');

  try {
    return res.status(200).json(campaignConstants.CAMPAIGN_TYPES);
  } catch (error) {
    logger.error(`Error fetching campaign types: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
