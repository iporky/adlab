import { getUserContextFromReq } from '../../../lib/util.js';
import * as adService from '../../../services/v1/ads.js';

/**
 * Fetch an ad by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAdById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to fetch ad by ID');
  const { adId } = req.params;
  try {
    const adGroup = await adService.getAdById(adId);
    return res.status(200).json(adGroup);
  } catch (error) {
    logger.error(`Error fetching ad ${adId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update an ad for a specific ad ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const updateAdById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to update ad');

  const userContext = getUserContextFromReq(req);
  const { adId } = req.params;
  const { body: updateData } = req;
  try {
    await adService.updateAdById(adId, updateData, userContext, logger);
    return res.status(200).json({ message: 'Ad updated successfully' });
  } catch (error) {
    logger.error(`Error updating ad ${adId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an ad for a specific ad ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const deleteAdById = async function (req, res, next) {
  const { logger } = req.app.locals;

  const userContext = getUserContextFromReq(req);
  logger.info('Received request to delete ad');
  const { adId } = req.params;
  try {
    await adService.deleteAdById(adId, userContext, logger);
    return res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting ad ${adId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};
