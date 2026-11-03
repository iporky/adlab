import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get device targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getDeviceTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get device targeting options');

  try {
    const deviceOptions = {
      deviceTypes: targetingConstants.DEVICE_TYPE,
      operatingSystems: targetingConstants.OPERATING_SYSTEM,
      manufacturers: targetingConstants.DEVICE_MAKE,
    };
    return res.status(200).json(deviceOptions);
  } catch (error) {
    logger.error(`Error fetching device targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
