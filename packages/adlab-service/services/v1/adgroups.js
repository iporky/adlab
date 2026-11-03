import _ from 'lodash';
import {
  fetchAdGroupByIdFromDB,
  fetchAllAdGroupsForCampaignIdFromDB,
  updateAdGroupInDB,
} from '../../dal/adgroupsDAL.js';
import * as Constants from '../../lib/constants.js';
import { getObjectDiff, removeDBFields } from '../../lib/util.js';
import { performPlatformOperation } from './orchestrator.js';

/**
 * Fetch all ad groups for a specific campaign ID
 * @param {string} campaignId - ID of the campaign to fetch ad groups for
 * @returns {Promise<Array>} - List of ad groups for the campaign
 */
export async function getAllAdGroupsForCampaign(campaignId) {
  try {
    return await fetchAllAdGroupsForCampaignIdFromDB(campaignId);
  } catch (error) {
    throw new Error(`Error fetching ad groups: ${error.message}`);
  }
}

/**
 * Fetch an ad group for a specific ad group ID
 * @param adGroupId
 * @returns {Promise<Object>}
 */
export async function getAdGroupById(adGroupId) {
  try {
    return await fetchAdGroupByIdFromDB(adGroupId);
  } catch (error) {
    throw new Error(`Error fetching ad group: ${error.message}`);
  }
}

/**
 * Update an ad group for a specific ad group ID
 * @param adGroupId
 * @param updateData
 * @param userContext
 * @param logger
 * @returns {Promise<Object>}
 */
export async function updateAdGroupById(adGroupId, updateData, userContext, logger) {
  const adGroupRecInDB = await getAdGroupById(adGroupId);
  const adGroupInDB = adGroupRecInDB.originalRecord || adGroupRecInDB;
  const {
    platformAdGroupId,
    platformCampaignId,
    platform,
    status: statusInDB,
    formData: { _id: formDataId },
  } = adGroupInDB;

  const { status: statusInUpdateData, ...adGroupData } = updateData;
  const isStatusUpdateRequest = statusInUpdateData && statusInUpdateData !== statusInDB;
  let platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE PENDING' : 'UPDATE PENDING';
  let reason = null;

  try {
    await updateAdGroupInDB(adGroupId, {
      ...(!updateData.formDataId && { formDataId }),
      status: platformStatus,
      updatedBy: userContext.userId,
    });

    await performPlatformOperation(
      { platform, logger },
      async (adapter, responseHandler, errorHandler, isResponseSuccess) => {
        let response;
        const adGroupDataPayload = {
          ...removeDBFields(adGroupData, [
            'platform',
            'formData',
            'campaignId',
            'platformCampaignId',
            'platformAdGroupId',
            'dsRowId',
            'reason',
            'originalRecord',
          ]),
        };

        if (platform === Constants.AD_PLATFORM.SNAPCHAT) {
          response =
            statusInUpdateData === 'DELETE'
              ? await adapter.deleteAdGroup(platformAdGroupId)
              : await adapter.updateAdGroups({
                  campaignId: platformCampaignId,
                  adGroupData: [
                    {
                      ...adGroupDataPayload,
                      status: statusInUpdateData,
                      id: platformAdGroupId,
                      campaign_id: platformCampaignId,
                    },
                  ],
                });
        } else if (platform === Constants.AD_PLATFORM.TIKTOK) {
          response = isStatusUpdateRequest
            ? await adapter.patchAdGroup([
                {
                  adgroup_id: platformAdGroupId,
                  operation_status: statusInUpdateData,
                },
              ])
            : await adapter.updateAdGroups([
                {
                  ...adGroupDataPayload,
                  adgroup_id: platformAdGroupId,
                  campaign_id: platformCampaignId,
                },
              ]);
        }

        const isUpdateSuccess = isResponseSuccess(response);

        if (!isUpdateSuccess) {
          reason = errorHandler(response, 'adgroups');
          throw new Error(reason);
        }

        platformStatus =
          statusInUpdateData === 'DELETE' ? 'DELETED' : responseHandler(response, 'adgroup').platformStatus;
      },
    );
  } catch (error) {
    platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE FAILED' : 'UPDATE FAILED';
    reason = error.message;
  } finally {
    const getObjectDiffResult = getObjectDiff(adGroupInDB, {
      ...(isStatusUpdateRequest ? { ...adGroupInDB, ...updateData } : { ...updateData, status: platformStatus }),
    });

    await updateAdGroupInDB(
      adGroupId,
      {
        ..._.omit(getObjectDiffResult.changes, ['_id', 'platform', 'reason', 'originalRecord']),
        ...(!updateData.formData && !updateData.formDataId && { formDataId }),
        status: platformStatus,
        ...(reason && { reason, originalRecord: { ...adGroupInDB } }),
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
 * Delete an ad group for a specific ad group ID
 * @param adGroupId
 * @param userContext
 * @param logger
 * @returns {Promise<Object>}
 */
export async function deleteAdGroupById(adGroupId, userContext, logger) {
  return updateAdGroupById(adGroupId, { status: 'DELETE' }, userContext, logger);
}
