import * as orchestrationService from '../../services/v1/orchestrator.js';

export const getReactMetricsForTargeting = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to fetch Audience Size for Targetings');
  const {
    body: targetingData,
    query: { platform },
  } = req;
  try {
    const result = await orchestrationService.getReactMetricsForTargeting({ platform, ...targetingData }, logger);
    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error('Error occurred while fetching Audience Size for Targetings', {
      error,
    });
    return res.status(400).json({
      message: 'Could not fetch Audience Size for Targetings',
      errors: error.message,
    });
  }
};
