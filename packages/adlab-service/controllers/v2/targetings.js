import * as targetingService from '../../services/v2/targeting.js';
import { getUserContextFromReq } from '../../lib/util.js';

export const createTargeting = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to create targeting');
  try {
    const { clientId, accountId, userId } = getUserContextFromReq(req);
    const { campaignId } = req.params;
    const { platform } = req.body;
    const targetingData = {
      ...req.body,
      clientId,
      accountId,
    };

    const newTargeting = await targetingService.createTargeting({
      campaignId,
      platform,
      createdBy: userId,
      targetingData,
    });
    return res.status(201).json(newTargeting);
  } catch (error) {
    logger.error(`Error creating targeting: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};

/**
 * Get all targeting configurations for a campaign
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAllTargetingForCampaign = async function (req, res, next) {
  const { logger } = req.app.locals;
  const { campaignId } = req.params;

  logger.info(`Received request to get all targeting for campaign ${campaignId}`);
  try {
    const targeting = await targetingService.getAllTargetingsForCampaign(campaignId);
    return res.status(200).json(targeting);
  } catch (error) {
    logger.error(`Error fetching targeting for campaign ${campaignId}: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};

/**
 * Get targeting for specific campaign and platform
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getTargetingForCampaignAndPlatform = async function (req, res, next) {
  const { logger } = req.app.locals;
  const { campaignId, platform } = req.params;

  logger.info(`Received request to get targeting for campaign ${campaignId} and platform ${platform}`);
  try {
    const targeting = await targetingService.getTargetingForCampaignAndPlatform(campaignId, platform);
    return res.status(200).json(targeting);
  } catch (error) {
    logger.error(`Error fetching targeting for campaign ${campaignId} and platform ${platform}: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};
