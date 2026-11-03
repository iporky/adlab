import * as campaignsService from '../../services/v1/campaigns.js';
import * as Constants from '../../lib/constants.js';
import { getUserContextFromReq } from '../../lib/util.js';
import { postAdsFromAdvPortal } from './legacyCampaigns.js';

export const createCampaign = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to create campaign');
  return postAdsFromAdvPortal(req, res, next);
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

  const { platform } = req.query;
  if (!Constants.AVAILABLE_PLATFORMS.includes(platform)) {
    logger.error('Invalid platform');
    return res.status(400).json({ error: 'Invalid platform' });
  }

  try {
    const { clientId, accountId } = getUserContextFromReq(req);
    const campaigns = await campaignsService.getAllCampaignsForClient({
      clientId,
      accountId,
      platform,
    });
    return res.status(200).json(campaigns);
  } catch (error) {
    logger.error(`Error fetching campaigns: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
