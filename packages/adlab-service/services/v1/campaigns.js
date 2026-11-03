import _ from 'lodash';
import {
  deleteCampaignFromDB, fetchAllCampaignsFromDB, fetchCampaignByIdFromDB, updateCampaignInDB
} from '../../dal/campaignsDAL.js';
import * as Constants from '../../lib/constants.js';
import { getObjectDiff, removeDBFields } from '../../lib/util.js';
import { performPlatformOperation } from './orchestrator.js';

/**
 * Fetch all campaigns based on filters
 * @param {Object} filters - Filters for fetching campaigns
 * @param {string} filters.clientId - Client ID to filter campaigns
 * @param {string} filters.accountId - Account ID to filter campaigns
 * @param {string} filters.platform - Platform to filter campaigns
 * @returns {Promise<Array>} - List of all campaigns
 */
export async function getAllCampaignsForClient(filters) {
  try {
    return await fetchAllCampaignsFromDB(filters);
  } catch (error) {
    throw new Error(`Error fetching campaigns: ${error.message}`);
  }
}

/**
 * Fetch a campaign by ID
 * @param campaignId
 * @returns {Promise<Object>}
 */
export async function getCampaignById(campaignId) {
  try {
    return await fetchCampaignByIdFromDB(campaignId);
  } catch (error) {
    throw new Error(`Error fetching campaign: ${error.message}`);
  }
}

/**
 * Update a campaign for a specific campaign ID
 * @param campaignId
 * @param updateData
 * @param userContext
 * @param logger
 * @param isDraftMode - Whether the update is in draft mode
 * @returns {Promise<Object>}
 */
export async function updateCampaignById(campaignId, isDraftMode, updateData, userContext, logger) {
  const campaignRecInDB = await getCampaignById(campaignId);
  const campaignInDB = campaignRecInDB.originalRecord || campaignRecInDB;
  const {
    platformCampaignId,
    platform,
    status: statusInDB,
    formData: { _id: formDataId },
  } = campaignInDB;

  const { status: statusInUpdateData, ...campaignData } = updateData;
  const isStatusUpdateRequest = statusInUpdateData && statusInUpdateData !== statusInDB;
  let platformStatus;
  if (isDraftMode) {
    platformStatus = 'CREATE PENDING';
  } else {
    platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE PENDING' : 'UPDATE PENDING';
  }
  let reason = null;

  try {
    await updateCampaignInDB(campaignId, {
      ...(!updateData.formDataId && { formDataId }),
      status: platformStatus,
      updatedBy: userContext.userId,
    });

    if (!isDraftMode) {
      await performPlatformOperation(
        { platform, logger },
        async (adapter, responseHandler, errorHandler, isResponseSuccess) => {
          let response;

          const campaignPayload = {
            ...removeDBFields({ ...campaignData }, [
              'platform',
              'platformCampaignId',
              'formData',
              'reason',
              'originalRecord',
            ]),
          };

          if (platform === Constants.AD_PLATFORM.SNAPCHAT) {
            response = statusInUpdateData === 'DELETE'
              ? await adapter.deleteCampaign(platformCampaignId)
              : await adapter.updateCampaigns([
                  {
                    ...campaignPayload,
                    status: statusInUpdateData,
                    id: platformCampaignId,
                  },
                ]);
          } else if (platform === Constants.AD_PLATFORM.TIKTOK) {
            response = isStatusUpdateRequest
              ? await adapter.patchCampaign([
                {
                  campaign_id: platformCampaignId,
                  operation_status: statusInUpdateData,
                },
              ])
              : await adapter.updateCampaigns([
                {
                  ...campaignPayload,
                  campaign_id: platformCampaignId,
                },
              ]);
          }

          const isUpdateSuccess = isResponseSuccess(response);

          if (!isUpdateSuccess) {
            reason = errorHandler(response, 'campaigns');
            throw new Error(reason);
          }

          platformStatus = statusInUpdateData === 'DELETE' ? 'DELETED' : responseHandler(response, 'campaign').platformStatus;
        },
      );
    }
  } catch (error) {
    platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE FAILED' : 'UPDATE FAILED';
    reason = error.message;
  } finally {
    const getObjectDiffResult = getObjectDiff(campaignInDB, {
      ...(isStatusUpdateRequest ? { ...campaignInDB, ...updateData } : { ...updateData, status: platformStatus }),
    });

    await updateCampaignInDB(
      campaignId,
      {
        ..._.omit(getObjectDiffResult.changes, ['_id', 'reason', 'originalRecord']),
        ...(!updateData.formData && !updateData.formDataId && { formDataId }),
        status: platformStatus,
        ...(reason && { reason, originalRecord: { ...campaignInDB } }),
        updatedBy: userContext.userId,
      },
      {
        ...getObjectDiffResult.unset,
        ...(!reason && {
          reason: '',
          originalRecord: '',
        }),
      },
    );

    if (reason) {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(reason);
    }
  }
}

/**
 * Delete a campaign for a specific campaign ID
 * @param campaignId
 * @param userContext
 * @param logger
 * @param isDraftMode - Whether the delete operation is in draft mode
 * @returns {Promise<Object>} - Result of the delete operation
 */
export async function deleteCampaignById(campaignId, isDraftMode, userContext, logger) {
  if (isDraftMode) {
    return await deleteCampaignFromDB(campaignId);
  }
  return updateCampaignById(campaignId, false, { status: 'DELETE' }, userContext, logger);
}
