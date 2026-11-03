import * as targetingConstants from '../../lib/targetingConstants.js';
import { formatResponse } from '../utils.js';
import {
  createTargetingInDB,
  updateTargetingInDB,
  deleteTargetingFromDB,
  fetchTargetingByIdFromDB,
  fetchAllTargetingsFromDB,
  patchTargetingInDB,
} from '../../dal/v2/targetingDAL.js';

/**
 * Create a new targeting
 * @param {Object} params
 * @param {Object} params.targetingData - Targeting data
 * @param {string} params.campaignId - Campaign ID
 * @param {string} params.platform - Platform
 * @param {string} params.createdBy - User creating the targeting
 * @returns {Promise<Object>} Created targeting
 */
export async function createTargeting({ campaignId, platform, createdBy, targetingData }) {
  return createTargetingInDB({
    targeting: targetingData,
    campaignId,
    platform,
    createdBy,
  });
}

/**
 * Update an existing targeting
 * @param {string} targetingId - Targeting ID
 * @param {Object} updateData - Updated targeting data
 * @param {boolean} draftMode - Whether to update in draft mode
 * @param {Object} userContext - User context containing userId, clientId, accountId
 * @param {Object} logger - Logger instance
 * @returns {Promise<Object>} Updated targeting
 */
export async function updateTargeting(targetingId, draftMode, updateData, userContext, logger) {
  logger.info(`Updating targeting ${targetingId} in ${draftMode ? 'draft' : 'live'} mode`);

  /**
   * TODO:
   * If draftMode is true, we update the targeting in the database only.
   * If draftMode is false, we update the targeting in the database and platform as well.
   */

  return updateTargetingInDB(targetingId, {
    targeting: updateData,
    updatedBy: userContext.userId,
  });
}

/**
 * Patch an existing targeting with partial data
 * @param {string} targetingId - Targeting ID
 * @param {Object} patchData - Partial targeting data to update
 * @param {boolean} draftMode - Whether to update in draft mode
 * @param {Object} userContext - User context containing userId, clientId, accountId
 * @param {Object} logger - Logger instance
 * @returns {Promise<Object>} Updated targeting
 */
export async function patchTargeting(targetingId, draftMode, patchData, userContext, logger) {
  logger.info(`Patching targeting ${targetingId} in ${draftMode ? 'draft' : 'live'} mode`);

  /**
   * TODO:
   * If draftMode is true, we update the targeting in the database only.
   * If draftMode is false, we update the targeting in the database and platform as well.
   */

  return patchTargetingInDB(targetingId, {
    targeting: patchData,
    updatedBy: userContext.userId,
  });
}

/**
 * Delete a targeting
 * @param {string} targetingId - Targeting ID
 * @param {boolean} isDraftMode - Whether to delete in draft mode
 * @param {Object} userContext - User context
 * @param {Object} logger - Logger instance
 * @returns {Promise<void>}
 */
export async function deleteTargetingById(targetingId, isDraftMode, userContext, logger) {
  logger.info(`Deleting targeting ${targetingId} in ${isDraftMode ? 'draft' : 'live'} mode`);
  await deleteTargetingFromDB(targetingId);
}

/**
 * Get a targeting by ID
 * @param {string} targetingId - Targeting ID
 * @returns {Promise<Object>} Targeting data
 */
export async function getTargetingById(targetingId) {
  return fetchTargetingByIdFromDB(targetingId);
}

/**
 * Get all targeting configurations for a campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Array>} List of targeting configurations
 */
export async function getAllTargetingsForCampaign(campaignId) {
  return fetchAllTargetingsFromDB({ campaignId });
}

/**
 * Get targeting configuration for specific campaign and platform
 * @param {string} campaignId - Campaign ID
 * @param {string} platform - Platform
 * @returns {Promise<Object>} Targeting configuration
 */
export async function getTargetingForCampaignAndPlatform(campaignId, platform) {
  // This function is not directly available in the new DAL, so it's not implemented here.
  // If it's needed, it would require a new DAL function.
  throw new Error('getTargetingForCampaignAndPlatform is not implemented in the new DAL');
}

/**
 * Fetches targeting for a specific type
 * @param {Object} params - Parameters for the function
 * @param {string} params.clientId - The client ID
 * @param {string} params.accountId - The account ID
 * @param {string} params.targetingType - The type of targeting to fetch
 * @param {Object} params.logger - Logger instance for logging
 * @returns {Promise<Object>} - Returns a promise that resolves to the targeting data
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
  if (typeof targetingValue == 'object') {
    let res = {};
    targetingKeys.map((targetingKey) => {
      res[targetingKey] = formatResponse(targetingData[targetingKey]);
    });
    return res;
  } else {
    logger.debug('targetingValue is not an array', targetingValue);
    return formatResponse(targetingData);
  }
};

/**
 * Fetches all targetings for a client and account
 * @param {Object} params - Parameters for the function
 * @param {string} params.clientId - The client ID
 * @param {string} params.accountId - The account ID
 * @param {Object} params.logger - Logger instance for logging
 * @returns {Promise<Object>} - Returns a promise that resolves to an object containing all targetings
 */
export const getAllTargetings = async ({ clientId, accountId, logger }) => {
  logger.info(`Fetching all targetings for clientId: ${clientId}, accountId: ${accountId}`);
  const targetingKeys = Object.keys(targetingConstants.targetingConstantsMapping);

  const entries = await Promise.all(
    targetingKeys.map(async (targetingKey) => {
      const value = await getTargetingForType({
        clientId,
        accountId,
        targetingType: targetingKey,
        logger,
      });
      return [targetingKey, value];
    })
  );

  return Object.fromEntries(entries);
};
