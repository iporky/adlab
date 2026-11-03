import * as campaignConstants from '../../../../lib/campaignConstants.js';
import { getUserContextFromReq } from '../../../../lib/util.js';
import * as genericCampaignService from '../../../../services/v2/campaign.js';

/**
 * Get generic campaign types for a specific type
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getCampaignForType = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get generic campaign types');
  const { campaignType } = req.params;

  if (
    campaignType !== campaignConstants.DEFAULT_CAMPAIGN_TYPE &&
    !(campaignType in campaignConstants.campaignConstantsMapping)
  ) {
    logger.error('Invalid Campaign Type', { campaignType });
    return res.status(400).json({ error: 'Invalid Campaign Type' });
  }

  try {
    const { clientId, accountId } = getUserContextFromReq(req);
    let genericCampaigns;

    if (campaignType === campaignConstants.DEFAULT_CAMPAIGN_TYPE) {
      genericCampaigns = await genericCampaignService.getAllCampaignsForClient({
        clientId,
        accountId,
        logger,
      });
      return res.status(200).json(genericCampaigns);
    }

    genericCampaigns = await genericCampaignService.getGenericCampaignForType({
      clientId,
      accountId,
      campaignType,
      logger,
    });
    return res.status(200).json(genericCampaigns);
  } catch (error) {
    logger.error(`Error fetching campaign types: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
