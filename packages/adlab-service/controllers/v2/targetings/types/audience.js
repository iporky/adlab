import * as targetingConstants from '../../../../lib/targetingConstants.js';

/**
 * Get audience targeting options
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const getAudienceTargeting = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get audience targeting options');

  try {
    const audienceOptions = {
      categories: targetingConstants.AUDIENCE_CATEGORY,
      groups: targetingConstants.AUDIENCE_GROUP,
      demographics: targetingConstants.DEMOGRAPHIC,
      interests: targetingConstants.INTEREST,
      interestCategories: targetingConstants.INTEREST_CATEGORY,
    };
    return res.status(200).json(audienceOptions);
  } catch (error) {
    logger.error(`Error fetching audience targeting options: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
