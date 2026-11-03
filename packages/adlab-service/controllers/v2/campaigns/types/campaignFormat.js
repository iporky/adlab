import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign formats
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignFormats = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign formats');

  try {
    return res.status(200).json(campaignConstants.CAMPAIGN_FORMATS);
  } catch (error) {
    logger.error(`Error fetching campaign formats: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
