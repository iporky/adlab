import * as campaignConstants from '../../../../lib/campaignConstants.js';

/**
 * Get campaign currency options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignCurrency = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign currency options');

  try {
    return res.status(200).json(campaignConstants.CURRENCY);
  } catch (error) {
    logger.error(`Error fetching campaign currency options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
