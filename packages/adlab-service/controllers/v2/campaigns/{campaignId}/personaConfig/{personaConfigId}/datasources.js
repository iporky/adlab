import { getUserContextFromReq } from "../../../../../../lib/util.js";
import * as personaDataService from '../../../../../../services/v2/personaData.js';
import mongoose from 'mongoose';
export const createPersonaData = async function (req, res, next) {
  const { logger } = req.app.locals;
  const { campaignId, personaConfigId } = req.params;
  logger.info('Received request to create persona config');
  try {
    validatePersonaConfigIdAndCampaignId(personaConfigId, campaignId);
    const result = await personaDataService.generatePersonaData(personaConfigId, campaignId);
    return res.status(201).json({ "data": result });
  } catch (error) {
    logger.error(`Error creating persona data: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};
export const getDataSources = async function (req, res, next) {
  const { logger } = req.app.locals;
  const { campaignId, personaConfigId } = req.params;

  logger.info('Received request to get data sources');
  try {
    validatePersonaConfigIdAndCampaignId(personaConfigId, campaignId);
    const { offset, count } = validatePagination(req.query);
    const dataSources = await personaDataService.getPersonaDataPaginated(campaignId, personaConfigId, { offset, count });
    return res.status(200).json(dataSources);
  } catch (error) {
    logger.error(`Error getting data sources: ${error.message}`);
    return res.status(400).json({ error: error.message || 'Bad Request' });
  }
};
function validatePersonaConfigIdAndCampaignId(personaConfigId, campaignId) {
  if (!mongoose.Types.ObjectId.isValid(personaConfigId)) {
    throw new Error('Invalid persona config ID');
  }
  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    throw new Error('Invalid campaign ID');
  }
}
function validatePagination(query) {
  let {
    offset = 0,
    count = 10,
  } = query;
  offset = parseInt(offset, 10);
  count = parseInt(count, 10);

  if (isNaN(offset) || offset < 0) {
    ;
    throw new Error('Invalid "offset": must be a non-negative number');
  }

  if (isNaN(count) || count <= 0) {
    throw new Error('Invalid "count": must be a positive integer');
  }

  return { offset, count };
}