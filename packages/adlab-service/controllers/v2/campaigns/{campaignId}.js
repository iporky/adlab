import { getUserContextFromReq } from '../../../lib/util.js';
import * as campaignService from '../../../services/v2/campaign.js';

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
  const { campaignId } = req.params;
  const { draftMode } = req.query;
  const updateData = req.body;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  try {
    Object.assign(updateData, {
      updatedBy: userContext.userId,
      updatedOn: new Date(),
    });
    const updatedCampaign = await campaignService.updateCampaign(
      campaignId,
      draftMode,
      updateData,
      userContext,
      logger
    );
    return res.status(200).json(updatedCampaign);
  } catch (error) {
    logger.error(`Error updating campaign ${campaignId}: ${error.message}`);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        reason: error.message,
        details: error.errors,
      });
    }

    // Handle other errors
    if (error.message === 'Campaign not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Campaign not found',
      });
    }

    if (error.message === 'Unauthorized to modify this campaign') {
      return res.status(403).json({
        code: 'UNAUTHORIZED',
        reason: 'You are not authorized to modify this campaign',
      });
    }

    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: error.message,
    });
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
  const { campaignId } = req.params;
  const { draftMode } = req.query;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  logger.info('Received request to delete campaign');

  try {
    await campaignService.deleteCampaignById(campaignId, draftMode, userContext, logger);
    return res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting campaign ${campaignId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Patch a campaign by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const patchCampaignById = async function (req, res, next) {
  const { campaignId } = req.params;
  const { draftMode } = req.query;
  const patchData = req.body;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  try {
    Object.assign(patchData, {
      updatedBy: userContext.userId,
      updatedOn: new Date(),
    });
    const updatedCampaign = await campaignService.patchCampaign(campaignId, draftMode, patchData, userContext, logger);
    return res.status(200).json(updatedCampaign);
  } catch (error) {
    logger.error(`Error patching campaign ${campaignId}: ${error.message}`);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        reason: error.message,
        details: error.errors,
      });
    }

    // Handle other errors
    if (error.message === 'Campaign not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Campaign not found',
      });
    }

    if (error.message === 'Unauthorized to modify this campaign') {
      return res.status(403).json({
        code: 'UNAUTHORIZED',
        reason: 'You are not authorized to modify this campaign',
      });
    }

    return res.status(500).json({
      code: 'INTERNAL_ERROR',
      reason: error.message,
    });
  }
};
