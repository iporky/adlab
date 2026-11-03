import * as targetingConstants from '../../lib/targetingConstants.js';
import { formatResponse } from '../utils.js';

/**
 * Fetches targeting for a specific type.
 * @param {Object} params - Parameters for the function.
 * @param {string} params.clientId - The client ID.
 * @param {string} params.accountId - The account ID.
 * @param {string} params.targetingType - The type of targeting to fetch.
 * @param {Object} params.logger - Logger instance for logging.
 * @returns {Promise<Object>} - Returns a promise that resolves to the targeting data.
 */
export const getTargetingForType = async ({ clientId, accountId, targetingType, logger }) => {
  logger.info(`Fetching targeting for type: ${targetingType} for clientId: ${clientId}, accountId: ${accountId}`);
  const targetingData = targetingConstants?.targetingConstantsMapping[targetingType];
  if (!targetingData) {
    logger.error(`Targeting type ${targetingType} not found`);
    throw new Error('Targeting type not found');
  }

  const targetingKeys = Object.keys(targetingData);
  const targetingValue = targetingData[targetingKeys[0]];

  if (typeof targetingValue === 'object') {
    const res = {};
    targetingKeys.forEach((targetingKey) => {
      res[targetingKey] = formatResponse(targetingData[targetingKey]);
    });
    return res;
  }
  return formatResponse(targetingData);
};
