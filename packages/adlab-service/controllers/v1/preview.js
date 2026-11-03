import * as orchestrationService from '../../services/v1/orchestrator.js';

/**
 * Returns creative preview for the given creative id or pre-creation payload
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export const getPreviewForCreative = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to get creative preview');

  const { creativeId, platform } = req.query;
  const previewOptions = req.body;

  if (!platform) {
    return res.status(400).json({ error: 'Invalid platform' });
  }

  // Check for either creativeId in query or creative_info in body
  if (!creativeId && !Object.keys(previewOptions).length) {
    return res
      .status(400)
      .json({ error: 'Either creativeId in query params or creative_info in request body must be provided' });
  }

  try {
    const previewResponse = await orchestrationService.getPreviewForCreative(
      creativeId,
      platform,
      previewOptions,
      logger,
    );
    return res.status(200).json(previewResponse);
  } catch (error) {
    logger.error('Failed to get preview for creative', {
      error,
      creativeId,
      platform,
      previewOptions,
    });
    return res.status(500).json({ error: error.message });
  }
};
