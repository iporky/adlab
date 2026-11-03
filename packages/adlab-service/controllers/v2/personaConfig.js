import * as personaConfigService from '../../services/v2/personaConfig.js';
import { getUserContextFromReq } from '../../lib/util.js';

export const createPersonaConfig = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to create persona config');

  try {
    const { campaignId } = req.params;
    const { clientId, accountId, userId } = getUserContextFromReq(req);
    const { template, status, combinations = [] } = req.body;

    const personaConfig = await personaConfigService.createPersonaConfig({
      campaignId,
      clientId,
      accountId,
      createdBy: userId,
      template,
      status,
      combinations,
    });

    return res.status(201).json(personaConfig);
  } catch (error) {
    logger.error('Error creating persona config:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};

export const getPersonaConfig = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to get persona config');

  try {
    const { campaignId } = req.params;
    const includeCombinations = req.query.includeCombinations === 'true';

    const personaConfig = await personaConfigService.getPersonaConfig(campaignId, includeCombinations);
    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }
    return res.status(200).json(personaConfig);
  } catch (error) {
    logger.error('Error getting persona config:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};

export const getPersonaConfigById = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to get persona config by ID');

  try {
    const { personaConfigId } = req.params;
    const personaConfig = await personaConfigService.getPersonaConfigById(personaConfigId);
    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }
    return res.status(200).json(personaConfig);
  } catch (error) {
    logger.error('Error getting persona config by ID:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};

export const updatePersonaConfig = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to update persona config');

  try {
    const { personaConfigId } = req.params;
    const { template, status } = req.body;
    const { userId } = getUserContextFromReq(req);

    const personaConfig = await personaConfigService.updatePersonaConfig(personaConfigId, {
      template,
      status,
      updatedBy: userId,
    });

    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }
    return res.status(200).json(personaConfig);
  } catch (error) {
    logger.error('Error updating persona config:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};

export const patchPersonaConfig = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to patch persona config');

  try {
    const { personaConfigId } = req.params;
    const { userId } = getUserContextFromReq(req);
    const patchData = req.body;

    const personaConfig = await personaConfigService.patchPersonaConfig(personaConfigId, patchData, userId);
    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }
    return res.status(200).json(personaConfig);
  } catch (error) {
    logger.error('Error patching persona config:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};

export const deletePersonaConfig = async (req, res) => {
  const { logger } = req.app.locals;
  logger.info('Received request to delete persona config');

  try {
    const { personaConfigId } = req.params;
    const personaConfig = await personaConfigService.deletePersonaConfig(personaConfigId);
    if (!personaConfig) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Persona config not found',
      });
    }
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting persona config:', error);
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: error.message,
    });
  }
};
