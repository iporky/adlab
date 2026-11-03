import { utils, schemas } from 'adlab-shared';

const { schemaUtils } = utils;
const {
  snapchat: { adCreativeMappingsSchema },
} = schemas;

/**
 * Validate ad mappings
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const validateAdMappings = async (req, res, next) => {
  const { logger } = req.app.locals;
  logger.info('Received request to validate ad mappings');

  const {
    body: { creatives, ...goalsAndObjective },
  } = req;
  logger.info('Validating ad mappings', { creatives, goalsAndObjective });
  try {
    const validations = creatives.reduce((acc, { id, ...payload }) => {
      logger.info('Validating ad mapping', { id, payload });
      const { error } = schemaUtils.validate(
        {
          ...payload,
          ...goalsAndObjective,
        },
        adCreativeMappingsSchema,
        { groupErrorsByPath: true },
      );
      logger.info('Validation result', { id, error });
      if (error) {
        acc[id] = error;
      }
      logger.info('Validation result', { acc });
      return acc;
    }, {});
    return res.status(200).json(validations);
  } catch (error) {
    logger.error(`Error validating ad mappings: ${error.message}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
};
