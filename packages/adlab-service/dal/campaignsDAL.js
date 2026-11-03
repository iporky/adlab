import lodash from 'lodash';
import { CampaignModel, validateDBObjectId, validateStringForNoSQLInjection } from './schemas/campaigns.js';
import { CampaignFormDataModel } from './schemas/campaignFormData.js';
import { AdGroupModel } from './schemas/adgroups.js';

/**
 * Create a new campaign
 * @param {Object} campaignPayload - Data for the new campaign
 * @param {Object} campaignPayload.formData
 * @param {Object} campaignPayload.campaignData - Data for the new campaign
 * @returns {Promise<Object>} - Created campaign
 */
export async function createCampaignInDB({ formData, ...campaignData }) {
  if (!formData) throw new Error('Form data not found');

  const formDataDoc = await new CampaignFormDataModel({
    data: formData,
    createdBy: campaignData.createdBy,
  }).save();

  const campaign = new CampaignModel({
    formDataId: formDataDoc._id,
    ...campaignData,
  });
  const savedCampaign = await campaign.save();

  return { ...savedCampaign.toObject(), formData: formDataDoc.toObject() };
}

/**
 * Update an existing campaign
 * @param {string} campaignId - ID of the campaign to update
 * @param payload - Data to update the campaign with
 * @param payload.formData
 * @param payload.formDataId
 * @param unsetFields
 * @returns {Promise<Object>} - Updated campaign
 */
export async function updateCampaignInDB(campaignId, { formData, formDataId, ...updateData }, unsetFields = {}) {
  validateDBObjectId(campaignId, 'campaignId');
  if (!formData && !formDataId && !updateData.deleted) throw new Error('Form data not found');

  if (formData) {
    validateDBObjectId(formData._id, 'formData._id');
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

  return CampaignModel.updateOne(
    { _id: campaignId },
    {
      $set: { ...updateData, updatedOn: Date.now() },
      $unset: unsetFields,
    },
  );
}

/**
 * Delete a campaign by ID
 * @param {string} campaignId - ID of the campaign to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export async function deleteCampaignFromDB(campaignId) {
  validateDBObjectId(campaignId, 'campaignId');

  const adGroups = await AdGroupModel.find({ campaignId }).exec();
  if (adGroups.length > 0) {
    throw new Error('Cannot delete campaign with associated ad groups');
  }

  const {formData} = await fetchCampaignByIdFromDB(campaignId);
  CampaignFormDataModel.deleteOne({ _id: formData._id });

  return CampaignModel.deleteOne({ _id: campaignId });
}

/**
 * Fetch all campaigns
 * @param {Object} filters - Filters for fetching campaigns
 * @param {string} filters.clientId - Client ID to filter campaigns
 * @param {string} filters.accountId - Account ID to filter campaigns
 * @param {string} filters.platform - Platform to filter campaigns
 * @returns {Promise<Array>} - List of all campaigns
 */
export async function fetchAllCampaignsFromDB({ clientId, accountId, platform }) {
  validateStringForNoSQLInjection(clientId, 'clientId');
  validateStringForNoSQLInjection(accountId, 'accountId');

  return CampaignModel.find({
    clientId,
    accountId,
    platform,
  }).exec();
}

/**
 * Fetch a campaign by ID
 * @param {string} campaignId - ID of the campaign to fetch
 * @returns {Promise<Object>} - Fetched campaign
 */
export async function fetchCampaignByIdFromDB(campaignId) {
  validateDBObjectId(campaignId, 'campaignId');

  const campaign = await CampaignModel.findById(campaignId).exec();
  const formData = await CampaignFormDataModel.findOne({
    _id: campaign.formDataId,
  }).exec();

  return {
    ...lodash.omit(campaign.toObject(), 'formDataId'),
    formData: formData.toObject(),
  };
}
