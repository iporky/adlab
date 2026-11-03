import * as orchestrationService from '../../services/v1/orchestrator.js';

export const createSavedAudience = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to create Saved Audience');

  const {
    advertiserId, accessToken, savedAudienceName, location
  } = req.body;

  try {
    const result = await orchestrationService.createSavedAudience(logger, {
      advertiserId,
      accessToken,
      savedAudienceName,
      location,
    });
    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error('Error occurred while creating Saved Audience', {
      error,
    });
    return res.status(400).json({
      message: 'Could not create Saved Audience',
      errors: error.message,
    });
  }
};

export const getSavedAudienceList = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to fetch Saved Audience List');

  const { savedAudienceIds, page, pageSize } = req.query;
  try {
    const result = await orchestrationService.getSavedAudienceList(logger, { savedAudienceIds, page, pageSize });
    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error('Error occurred while fetching Saved Audience List', {
      error,
    });
    return res.status(400).json({
      message: 'Could not fetch Saved Audience List',
      errors: error.message,
    });
  }
};

export const deleteSavedAudience = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to delete Saved Audience');

  const { savedAudienceId } = req.params;

  try {
    const result = await orchestrationService.deleteSavedAudience(logger, { savedAudienceId });
    return res.status(200).json({ ...result });
  } catch (error) {
    logger.error('Error occurred while deleting Saved Audience', {
      error,
    });
    return res.status(400).json({
      message: 'Could not delete Saved Audience',
      errors: error.message,
    });
  }
};
