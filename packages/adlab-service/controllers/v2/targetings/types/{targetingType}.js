import * as targetingTypeService from '../../../../services/v2/targetingType.js';

export const getTargetingsForType = async function (req, res) {
  const { logger } = req.app.locals;
  logger.info('Received request to get targetings for type');

  const { targetingType } = req.params;
  const { clientId, accountId } = req.userContext;

  try {
    let targetings;
    if (targetingType === 'all') {
      targetings = await targetingTypeService.getAllTargetings({
        clientId,
        accountId,
        logger,
      });
    } else {
      targetings = await targetingTypeService.getTargetingForType({
        clientId,
        accountId,
        targetingType,
        logger,
      });
    }
    return res.status(200).json(targetings);
  } catch (error) {
    logger.error('Error getting targetings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
