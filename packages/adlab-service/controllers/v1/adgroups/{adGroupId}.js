import * as adGroupsService from '../../../services/v1/adgroups.js';
import { getUserContextFromReq } from '../../../lib/util.js';

/**
 * Fetch an ad group by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAdGroupById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get ad group by ID');
  const { adGroupId } = req.params;
  try {
    const adGroup = await adGroupsService.getAdGroupById(adGroupId);
    return res.status(200).json(adGroup);
  } catch (error) {
    logger.error(`Error fetching ad group ${adGroupId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update an ad group by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const updateAdGroupById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to update ad group');

  const userContext = getUserContextFromReq(req);
  const { adGroupId } = req.params;
  const { body: updateData } = req;
  try {
    await adGroupsService.updateAdGroupById(adGroupId, updateData, userContext, logger);
    return res.status(200).json({ message: 'Ad group updated successfully' });
  } catch (error) {
    logger.error(`Error updating ad group ${adGroupId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an ad group by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const deleteAdGroupById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to delete ad group');

  const userContext = getUserContextFromReq(req);
  const { adGroupId } = req.params;
  try {
    await adGroupsService.deleteAdGroupById(adGroupId, userContext, logger);
    return res.status(200).json({ message: 'Ad group deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting ad group ${adGroupId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};
