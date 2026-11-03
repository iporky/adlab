import { AdGroupModel, validateDBObjectId } from './schemas/adgroups.js';
import { AdModel } from './schemas/ads.js';
import { CampaignFormDataModel } from './schemas/campaignFormData.js';
import { fetchCampaignByIdFromDB } from './campaignsDAL.js';

/**
 * Create a new ad group
 * @param {Object} adGroupData - Data for the new ad group
 * @returns {Promise<Object>} - Created ad group
 */
export async function createAdGroupInDB(adGroupData) {
  const adGroup = new AdGroupModel(adGroupData);
  return adGroup.save();
}

/**
 * Update an existing ad group
 * @param {string} adGroupId - ID of the ad group to update
 * @param payload - Data to update the ad group with
 * @param payload.formData
 * @param payload.formDataId
 * @param payload.updateData
 * @param unsetFields
 * @returns {Promise<Object>} - Updated ad group
 */
export async function updateAdGroupInDB(adGroupId, { formData, formDataId, ...updateData }, unsetFields = {}) {
  validateDBObjectId(adGroupId, 'adGroupId');

  if (!formData && !formDataId && !updateData.deleted) throw new Error('Form data not found');

  if (formData) {
    await CampaignFormDataModel.updateOne(
      { _id: formData._id },
      {
        $set: {
          ...formData,
          updatedBy: updateData.updatedBy,
          updatedOn: Date.now(),
        },
      },
    );
  }
  return AdGroupModel.updateOne(
    { _id: adGroupId },
    {
      $set: { ...updateData, updatedOn: Date.now() },
      $unset: unsetFields,
    },
  );
}

/**
 * Fetch all ad groups for a specific campaign ID
 * @param {string} campaignId - ID of the campaign to fetch ad groups for
 * @returns {Promise<Array>} - List of ad groups for the campaign
 */
export async function fetchAllAdGroupsForCampaignIdFromDB(campaignId) {
  validateDBObjectId(campaignId, 'campaignId');

  const { formData } = await fetchCampaignByIdFromDB(campaignId);
  const adGroups = await AdGroupModel.find({ campaignId }).exec();

  return adGroups.map((adgroup) => ({
    ...adgroup.toObject(),
    formDataId: formData._id,
  }));
}

/**
 * Fetch an ad group by ID
 * @param {string} adGroupId - ID of the ad group to fetch
 * @returns {Promise<Object>} - Fetched ad group
 */
export async function fetchAdGroupByIdFromDB(adGroupId) {
  validateDBObjectId(adGroupId, 'adGroupId');

  const adgroup = await AdGroupModel.findById(adGroupId).exec();
  const { formData, platform } = await fetchCampaignByIdFromDB(adgroup.campaignId);
  return { ...adgroup.toObject(), platform, formData };
}

/**
 * Delete an ad group by ID
 * @param {string} adGroupId - ID of the ad group to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export async function deleteAdGroupFromDB(adGroupId) {
  validateDBObjectId(adGroupId, 'adGroupId');

  const ads = await AdModel.find({ adGroupId }).exec();
  if (ads.length > 0) {
    throw new Error('Cannot delete ad group with associated ads');
  }

  return AdGroupModel.deleteOne({ _id: adGroupId });
}
