import { TargetingModel, validateDBObjectId, validateStringForNoSQLInjection } from './schemas/targeting.js';

/**
 * Create a new generic targeting
 * @param {Object} targetingData - Data for the new targeting
 * @param {Object} targetingData.targeting - Targeting data following Targeting model structure
 * @param {string} targetingData.campaignId - Campaign ID
 * @param {string} targetingData.platform - Platform
 * @param {string} targetingData.createdBy - User creating the targeting
 * @returns {Promise<Object>} - Created targeting
 */
export async function createTargetingInDB({ targeting, campaignId, platform, createdBy }) {
  validateDBObjectId(campaignId, 'campaignId');

  const targetingDoc = new TargetingModel({
    ...targeting,
    campaignId,
    platform,
    createdBy,
  });

  return targetingDoc.save();
}

/**
 * Update an existing generic targeting
 * @param {string} targetingId - ID of the targeting to update
 * @param {Object} updateData - Data to update the targeting with
 * @param {Object} updateData.targeting - Targeting data following Targeting model structure
 * @param {string} updateData.updatedBy - User updating the targeting
 * @returns {Promise<Object>} - Updated targeting
 */
export async function updateTargetingInDB(targetingId, { targeting, updatedBy }) {
  validateDBObjectId(targetingId, 'targetingId');

  return TargetingModel.findByIdAndUpdate(
    targetingId,
    {
      $set: {
        ...targeting,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true }
  );
}

/**
 * Delete a generic targeting
 * @param {string} targetingId - ID of the targeting to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export async function deleteTargetingFromDB(targetingId) {
  validateDBObjectId(targetingId, 'targetingId');
  return TargetingModel.deleteOne({ _id: targetingId });
}

/**
 * Fetch a generic targeting by ID
 * @param {string} targetingId - ID of the targeting to fetch
 * @returns {Promise<Object>} - Fetched targeting
 */
export async function fetchTargetingByIdFromDB(targetingId) {
  validateDBObjectId(targetingId, 'targetingId');
  return TargetingModel.findById(targetingId).exec();
}

/**
 * Fetch all generic targeting configurations for a campaign
 * @param {string} campaignId - Campaign ID to fetch targeting for
 * @returns {Promise<Array>} - List of targeting configurations
 */
export async function fetchAllTargetingsFromDB({ campaignId }) {
  validateDBObjectId(campaignId, 'campaignId');

  return TargetingModel.find({ campaignId }).sort({ createdOn: -1 }).exec();
}

/**
 * Fetch targeting configuration for a specific campaign and platform
 * @param {string} campaignId - Campaign ID
 * @param {string} platform - Platform identifier
 * @returns {Promise<Object>} - Targeting configuration
 */
export async function fetchTargetingByCampaignAndPlatformFromDB(campaignId, platform) {
  validateDBObjectId(campaignId, 'campaignId');
  validateStringForNoSQLInjection(platform, 'platform');

  return TargetingModel.findOne({
    campaignId,
    platform,
  }).exec();
}

/**
 * Patch a targeting with partial data
 * @param {string} targetingId - Targeting ID
 * @param {Object} params - Update parameters
 * @param {Object} params.targeting - Partial targeting data to update
 * @param {string} params.updatedBy - User updating the targeting
 * @returns {Promise<Object>} - Updated targeting
 */
export async function patchTargetingInDB(targetingId, { targeting, updatedBy }) {
  validateDBObjectId(targetingId, 'targetingId');

  return TargetingModel.findByIdAndUpdate(
    targetingId,
    {
      $set: {
        ...targeting,
        updatedBy,
        updatedOn: new Date(),
      },
    },
    { new: true, runValidators: true }
  ).exec();
}
