import { AdModel, validateDBObjectId } from './schemas/ads.js';
import { CampaignFormDataModel } from './schemas/campaignFormData.js';
import { fetchAdGroupByIdFromDB } from './adgroupsDAL.js';

/**
 * Create multiple ads
 * @param {Array} adsData - Data for the new ads
 * @returns {Promise<Array>} - Created ads
 */
export async function createAdsInDB(adsData) {
  return AdModel.insertMany(adsData);
}

/**
 * Create a new ad
 * @param {Object} adData - Data for the new ad
 * @returns {Promise<Object>} - Created ad
 */
export async function createAdInDB(adData) {
  const ad = new AdModel(adData);
  return ad.save();
}

/**
 * Fetch ads for a specific ad group ID
 * @param {string} adGroupId - ID of the ad group to fetch ads for
 * @returns {Promise<Array>} - List of ads for the ad group
 */
export async function fetchAdsForAdGroupIdFromDB(adGroupId) {
  validateDBObjectId(adGroupId, 'adGroupId');

  return AdModel.find({ adGroupId }).exec();
}

/**
 * Fetch an ad by ID
 * @param {string} adId - ID of the ad to fetch
 * @returns {Promise<Object>} - Fetched ad
 */
export async function fetchAdByIdFromDB(adId) {
  validateDBObjectId(adId, 'adId');

  const ad = await AdModel.findById(adId).exec();
  const { platform, formData } = await fetchAdGroupByIdFromDB(ad.adGroupId);
  return { ...ad.toObject(), platform, formData };
}

/**
 * Update an existing ad
 * @param {string} adId - ID of the ad to update
 * @param payload - Data to update the ad with
 * @param payload.formData
 * @param payload.formDataId
 * @param payload.updateData
 * @param unsetFields
 * @returns {Promise<Object>} - Updated ad
 */
export async function updateAdInDB(adId, { formData, formDataId, ...updateData }, unsetFields = {}) {
  validateDBObjectId(adId, 'adId');

  if (!formData && !formDataId && !updateData.deleted) throw new Error('Form data not found');

  if (formData) {
    await CampaignFormDataModel.updateOne(
      { _id: formData._id },
      {
        $set: {
          formData,
          updatedBy: updateData.updatedBy,
          updatedOn: Date.now(),
        },
      },
    );
  }
  return AdModel.updateOne(
    { _id: adId },
    {
      $set: { ...updateData, updatedOn: Date.now() },
      $unset: unsetFields,
    },
  );
}
