import * as orchestrationService from '../../services/v1/orchestrator.js';

/**
 * Post advertisements to the social platform
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getTargetingOptions = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to fetch Targeting Options');
  const {
    body: targetingOpts,
    query: { platform },
  } = req;
  try {
    const result = await orchestrationService.getTargetingOptions(targetingOpts, platform, logger);
    if (!result) {
      return res.status(400).json({
        message: `Unable to fetch target options from ${platform}`,
      });
    }
    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error('Error occurred while posting advertisements', { error });
    return res.status(500).json({
      error: error.message,
    });
  }
};
