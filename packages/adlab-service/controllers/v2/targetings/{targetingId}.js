import { getUserContextFromReq } from '../../../lib/util.js';
import * as targetingService from '../../../services/v2/targeting.js';

/**
 * Get a targeting by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getTargetingById = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get targeting by ID');
  const { targetingId } = req.params;
  try {
    const targeting = await targetingService.getTargetingById(targetingId);
    return res.status(200).json(targeting);
  } catch (error) {
    logger.error(`Error fetching targeting ${targetingId}: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};

/**
 * Update a targeting by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const updateTargetingById = async function (req, res, next) {
  const { targetingId } = req.params;
  const { draftMode } = req.query;
  const updateData = req.body;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  try {
    Object.assign(updateData, {
      updatedBy: userContext.userId,
      updatedOn: new Date(),
    });

    const updatedTargeting = await targetingService.updateTargeting(
      targetingId,
      draftMode,
      updateData,
      userContext,
      logger
    );
    return res.status(200).json(updatedTargeting);
  } catch (error) {
    logger.error(`Error updating targeting ${targetingId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a targeting by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const deleteTargetingById = async function (req, res, next) {
  const { targetingId } = req.params;
  const { draftMode } = req.query;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  logger.info('Received request to delete targeting');

  try {
    await targetingService.deleteTargetingById(targetingId, draftMode, userContext, logger);
    return res.status(200).json({ message: 'Targeting deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting targeting ${targetingId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Patch a targeting by ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const patchTargetingById = async function (req, res, next) {
  const { targetingId } = req.params;
  const { draftMode } = req.query;
  const patchData = req.body;
  const userContext = getUserContextFromReq(req);
  const { logger } = req.app.locals;

  try {
    Object.assign(patchData, {
      updatedBy: userContext.userId,
      updatedOn: new Date(),
    });

    const updatedTargeting = await targetingService.patchTargeting(
      targetingId,
      draftMode,
      patchData,
      userContext,
      logger
    );
    return res.status(200).json(updatedTargeting);
  } catch (error) {
    logger.error(`Error patching targeting ${targetingId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};
