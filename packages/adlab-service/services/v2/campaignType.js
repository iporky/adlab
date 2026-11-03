import * as campaignConstants from '../../lib/campaignConstants.js';
import { formatResponse } from '../utils.js';

/**
 * Fetches campaign for a specific type.
 * @param {Object} params - Parameters for the function.
 * @param {string} params.clientId - The client ID.
 * @param {string} params.accountId - The account ID.
 * @param {string} params.campaignType - The type of campaign to fetch.
 * @param {Object} params.logger - Logger instance for logging.
 * @returns {Promise<Object>} - Returns a promise that resolves to the campaign data.
 */
export const getCampaignForType = async ({ clientId, accountId, campaignType, logger }) => {
  logger.info(`Fetching campaign for type: ${campaignType} for clientId: ${clientId}, accountId: ${accountId}`);
  const campaignData = campaignConstants?.campaignConstantsMapping[campaignType];
  if (!campaignData) {
    logger.error(`Campaign type ${campaignType} not found`);
    throw new Error('Campaign type not found');
  }

  const campaignKeys = Object.keys(campaignData);
  const campaignValue = campaignData[campaignKeys[0]];

  if (typeof campaignValue === 'object') {
    const res = {};
    campaignKeys.forEach((campaignKey) => {
      res[campaignKey] = formatResponse(campaignData[campaignKey]);
    });
    return res;
  }
  return formatResponse(campaignData);
};
