import * as campaignsService from '../../services/v2/campaign.js';
import { getUserContextFromReq } from '../../lib/util.js';

export const createCampaign = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to create campaign');
  try {
    const { clientId, accountId, userId } = getUserContextFromReq(req);
    const { body } = req;
    const campaignData = body;
    const newCampaign = await campaignsService.createCampaign({
      clientId,
      accountId,
      createdBy: userId,
      campaignData,
    });
    return res.status(201).json(newCampaign);
  } catch (error) {
    logger.error(`Error creating campaign: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};

/**
 * Get all campaigns for a client
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAllCampaignsForClient = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get all campaigns for client');
  try {
    const { clientId, accountId } = getUserContextFromReq(req);
    logger.info('User context:', { clientId, accountId });

    const campaigns = await campaignsService.getAllCampaignsForClient({
      clientId,
      accountId,
    });
    logger.info(`Retrieved ${campaigns.length} campaigns`);

    return res.status(200).json({
      campaigns,
      pagination: {
        total: campaigns.length,
        page: 1,
        pageSize: campaigns.length,
        hasMore: false,
      },
    });
  } catch (error) {
    logger.error(`Error fetching campaigns: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};
