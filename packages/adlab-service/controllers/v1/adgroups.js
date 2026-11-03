import * as adGroupsService from '../../services/v1/adgroups.js';

/**
 * Fetch all ad groups for a specific campaign ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAllAdGroupsForCampaign = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get ad groups for campaign');
  const { campaignId } = req.query;
  try {
    const adGroups = await adGroupsService.getAllAdGroupsForCampaign(campaignId);
    return res.status(200).json(adGroups);
  } catch (error) {
    logger.error(`Error fetching ad groups for campaign ${campaignId}: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
