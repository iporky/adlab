import { getUserContextFromReq } from '../../../lib/util.js';
import * as campaignService from '../../../services/v1/campaigns.js';

/**
 * Get a campaign by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getCampaignById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get campaign by ID');
  const { campaignId } = req.params;
  try {
    const campaign = await campaignService.getCampaignById(campaignId);
    return res.status(200).json(campaign);
  } catch (error) {
    logger.error(`Error fetching campaign ${campaignId}: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};

/**
 * Update a campaign by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const updateCampaignById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to update campaign');

  const {draftMode} = req.query;
  const userContext = getUserContextFromReq(req);
  const { campaignId } = req.params;
  const updateData = req.body;
  try {
    Object.assign(updateData, {
      clientId: userContext.clientId,
      accountId: userContext.accountId,
      userId: userContext.userId,
      updatedBy: userContext.userId,
      updatedOn: new Date(),
    });
    await campaignService.updateCampaignById(campaignId, draftMode, updateData, userContext, logger);
    return res.status(200).json({ message: 'Campaign updated successfully' });
  } catch (error) {
    logger.error(`Error updating campaign ${campaignId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a campaign by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const deleteCampaignById = async function (req, res, next) {
  const { logger } = req.app.locals;
  const {draftMode} = req.query;

  logger.info('Received request to delete campaign');

  const userContext = getUserContextFromReq(req);
  const { campaignId } = req.params;
  try {
    await campaignService.deleteCampaignById(campaignId, draftMode, userContext, logger);
    return res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting campaign ${campaignId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};
