import { CampaignModel, validateDBObjectId, validateStringForNoSQLInjection } from './schemas/campaign.js';
/**
 * Create a new generic campaign
 * @param {Object} campaignData - Data for the new campaign
 * @param {Object} campaignData.campaign - Campaign data following Campaign model structure
 * @param {string} campaignData.clientId - Client ID
 * @param {string} campaignData.accountId - Account ID
 * @param {string} campaignData.createdBy - User creating the campaign
 * @returns {Promise<Object>} - Created campaign
 */
export async function createCampaignInDB({ campaign, clientId, accountId, createdBy }) {
  // Create campaign document
  const campaignDoc = new CampaignModel({
    ...campaign,
    clientId,
    accountId,
    createdBy,
  });

  return campaignDoc.save();
}

/**
 * Update an existing generic campaign
 * @param {string} campaignId - ID of the campaign to update
 * @param {Object} updateData - Data to update the campaign with
 * @param {Object} updateData.campaign - Campaign data following Campaign model structure
 * @param {string} updateData.updatedBy - User updating the campaign
 * @returns {Promise<Object>} - Updated campaign
 */
export async function updateCampaignInDB(campaignId, { campaign, updatedBy }) {
  validateDBObjectId(campaignId, 'campaignId');
  return CampaignModel.findByIdAndUpdate(
    campaignId,
    {
      $set: {
        ...campaign,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true }
  );
}

/**
 * Delete a generic campaign
 * @param {string} campaignId - ID of the campaign to delete
 * @returns {Promise<Object>} - Result of the delete operation
 */
export async function deleteCampaignFromDB(campaignId) {
  validateDBObjectId(campaignId, 'campaignId');
  return CampaignModel.deleteOne({ _id: campaignId });
}

/**
 * Fetch a generic campaign by ID
 * @param {string} campaignId - ID of the campaign to fetch
 * @returns {Promise<Object>} - Fetched campaign
 */
export async function fetchCampaignByIdFromDB(campaignId) {
  validateDBObjectId(campaignId, 'campaignId');
  return CampaignModel.findById(campaignId).exec();
}

/**
 * Fetch all generic campaigns matching filters
 * @param {Object} filters - Filters for fetching campaigns
 * @param {string} filters.clientId - Client ID to filter campaigns
 * @param {string} filters.accountId - Account ID to filter campaigns
 * @param {string} [filters.status] - Optional status to filter campaigns
 * @returns {Promise<Array>} - List of matching campaigns
 */
export async function fetchAllCampaignsFromDB({ clientId, accountId }) {
  validateStringForNoSQLInjection(clientId, 'clientId');
  validateStringForNoSQLInjection(accountId, 'accountId');

  const query = { clientId, accountId };
  const campaigns = await CampaignModel.find(query).sort({ createdOn: -1 }).exec();
  return campaigns;
}

/**
 * Update campaign status
 * @param {string} campaignId - ID of the campaign to update
 * @param {string} status - New status
 * @param {string} updatedBy - User updating the status
 * @returns {Promise<Object>} - Updated campaign
 */
export async function updateCampaignStatusInDB(campaignId, status, updatedBy) {
  validateDBObjectId(campaignId, 'campaignId');

  return CampaignModel.findByIdAndUpdate(
    campaignId,
    {
      $set: {
        status,
        updatedBy,
        updatedOn: Date.now(),
      },
    },
    { new: true }
  );
}

/**
 * Patch a campaign with partial data
 * @param {string} campaignId - Campaign ID
 * @param {Object} params - Update parameters
 * @param {Object} params.campaign - Partial campaign data to update
 * @returns {Promise<Object>} - Updated campaign
 */
export async function patchCampaignInDB(campaignId, { campaign }) {
  validateDBObjectId(campaignId, 'campaignId');

  return CampaignModel.findByIdAndUpdate(campaignId, { $set: campaign }, { new: true, runValidators: true }).exec();
}
