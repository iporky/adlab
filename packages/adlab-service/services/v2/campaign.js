import {
  createCampaignInDB,
  updateCampaignInDB,
  deleteCampaignFromDB,
  fetchCampaignByIdFromDB,
  fetchAllCampaignsFromDB,
  updateCampaignStatusInDB,
  patchCampaignInDB,
} from '../../dal/v2/campaignsDAL.js';

import * as constants from '../../lib/campaignConstants.js';

/**
 * Create a new generic campaign
 * @param {Object} params
 * @param {Object} params.campaignData - Campaign data
 * @param {string} params.clientId - Client ID
 * @param {string} params.accountId - Account ID
 * @param {string} params.createdBy - User creating the campaign
 * @returns {Promise<Object>} Created campaign
 */
export async function createCampaign({ clientId, accountId, createdBy, campaignData }) {
  return createCampaignInDB({
    campaign: campaignData,
    clientId,
    accountId,
    createdBy,
  });
}

/**
 * Get all generic campaigns for a client
 * @param {Object} params
 * @param {string} params.clientId - Client ID
 * @param {string} params.accountId - Account ID
 * @returns {Promise<Array>} List of campaigns
 */
export async function getAllCampaignsForClient({ clientId, accountId }) {
  return fetchAllCampaignsFromDB({ clientId, accountId });
}

/**
 * Update an existing generic campaign
 * @param {string} campaignId - Campaign ID
 * @param {Object} updateData - Updated campaign data
 * @param {boolean} draftMode - Whether to update in draft mode
 * @param {Object} userContext - User context containing userId, clientId, accountId
 * @param {Object} logger - Logger instance
 * @returns {Promise<Object>} Updated campaign
 */
export async function updateCampaign(campaignId, draftMode, updateData, userContext, logger) {
  /**
   * TODO:
   * If draftMode is true, we update the campaign from the database.
   * If draftMode is false, we update the campaign in the database and platform as well.
   */

  return updateCampaignInDB(campaignId, { campaign: updateData });
}

/**
 * Delete a generic campaign
 * @param {string} campaignId - Campaign ID
 * @param {boolean} isDraftMode - Whether to delete in draft mode
 * @returns {Promise<Object>} Delete operation result
 */
export async function deleteCampaignById(campaignId, isDraftMode, userContext, logger) {
  if (isDraftMode) {
    await deleteCampaignFromDB(campaignId);
    return;
  }
  await updateCampaign(campaignId, false, { status: constants.CAMPAIGN_STATUS.DELETED }, userContext, logger);
}

/**
 * Get a generic campaign by ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} Campaign data
 */
export async function getCampaignById(campaignId) {
  return fetchCampaignByIdFromDB(campaignId);
}

/**
 * Update campaign status
 * @param {string} campaignId - Campaign ID
 * @param {string} status - New status
 * @param {string} updatedBy - User updating the status
 * @returns {Promise<Object>} Updated campaign
 */
export async function updateCampaignStatus(campaignId, status, updatedBy) {
  return updateCampaignStatusInDB(campaignId, status, updatedBy);
}

/**
 * Patch an existing campaign with partial data
 * @param {string} campaignId - Campaign ID
 * @param {Object} patchData - Partial campaign data to update
 * @param {boolean} draftMode - Whether to update in draft mode
 * @param {Object} userContext - User context containing userId, clientId, accountId
 * @param {Object} logger - Logger instance
 * @returns {Promise<Object>} Updated campaign
 */
export async function patchCampaign(campaignId, draftMode, patchData, userContext, logger) {
  logger.info(`Patching campaign ${campaignId} in ${draftMode ? 'draft' : 'live'} mode`);

  // First, get the existing campaign to validate ownership and get platform info
  const existingCampaign = await fetchCampaignByIdFromDB(campaignId);
  if (!existingCampaign) {
    throw new Error('Campaign not found');
  }

  // Validate ownership
  if (existingCampaign.clientId !== userContext.clientId || existingCampaign.accountId !== userContext.accountId) {
    throw new Error('Unauthorized to modify this campaign');
  }

  // Prepare update data with user context
  const updateData = {
    ...patchData,
    updatedBy: userContext.userId,
    updatedOn: new Date(),
  };

  // If in draft mode, just update the database
  if (draftMode) {
    return patchCampaignInDB(campaignId, { campaign: updateData });
  }

  // For live mode, we need to update both DB and platform
  let platformStatus = constants.CAMPAIGN_STATUS.PENDING;
  let reason = null;

  try {
    // First update DB with pending status
    await patchCampaignInDB(campaignId, {
      campaign: {
        ...updateData,
        status: platformStatus,
      },
    });

    // Then update platform if campaign is linked to a platform
    if (existingCampaign.platform && existingCampaign.platformCampaignId) {
      await performPlatformOperation(
        { platform: existingCampaign.platform, logger },
        async (adapter, responseHandler, errorHandler, isResponseSuccess) => {
          const response = await adapter.updateCampaigns([
            {
              ...updateData,
              id: existingCampaign.platformCampaignId,
            },
          ]);

          if (!isResponseSuccess(response)) {
            reason = errorHandler(response, 'campaigns');
            throw new Error(reason);
          }

          platformStatus = responseHandler(response, 'campaign').platformStatus || constants.CAMPAIGN_STATUS.ACTIVE;
        }
      );
    }

    // Finally update DB with success status
    return patchCampaignInDB(campaignId, {
      campaign: {
        ...updateData,
        status: platformStatus,
      },
    });
  } catch (error) {
    // Update DB with failure status
    platformStatus = constants.CAMPAIGN_STATUS.ERROR;
    reason = error.message;

    await patchCampaignInDB(campaignId, {
      campaign: {
        status: platformStatus,
        reason,
        originalRecord: existingCampaign,
      },
    });

    throw error;
  }
}
