import _ from 'lodash';
import { fetchAdByIdFromDB, fetchAdsForAdGroupIdFromDB, updateAdInDB } from '../../dal/adsDAL.js';
import * as Constants from '../../lib/constants.js';
import { getObjectDiff, removeDBFields } from '../../lib/util.js';
import { performPlatformOperation } from './orchestrator.js';

/**
 * Fetch all ads for a specific ad group ID
 * @param {string} adGroupId - ID of the ad group to fetch ads for
 * @returns {Promise<Array>} - List of ads for the ad group
 */
export async function getAdsForAdGroup(adGroupId) {
  try {
    return await fetchAdsForAdGroupIdFromDB(adGroupId);
  } catch (error) {
    throw new Error(`Error fetching ads: ${error.message}`);
  }
}

/**
 * Fetch an ad for a specific ad ID
 * @param adId
 * @returns {Promise<Object>}
 */
export async function getAdById(adId) {
  try {
    return await fetchAdByIdFromDB(adId);
  } catch (error) {
    throw new Error(`Error fetching ad: ${error.message}`);
  }
}

/**
 * Update an ad for a specific ad ID
 * @param adId
 * @param updateData
 * @param userContext
 * @param logger
 * @returns {Promise<Object>}
 */
export async function updateAdById(adId, updateData, userContext, logger) {
  const adRecInDB = await getAdById(adId);
  const adInDB = adRecInDB.originalRecord || adRecInDB;
  const {
    platformAdId,
    platformAdGroupId,
    platform,
    status: statusInDB,
    formData: { _id: formDataId },
  } = adInDB;

  const { status: statusInUpdateData, ...adData } = updateData;
  const isStatusUpdateRequest = statusInUpdateData && statusInUpdateData !== statusInDB;
  let platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE PENDING' : 'UPDATE PENDING';
  let reason = null;

  try {
    await updateAdInDB(adId, {
      ...(!updateData.formDataId && { formDataId }),
      status: platformStatus,
      updatedBy: userContext.userId,
    });

    await performPlatformOperation(
      { platform, logger },
      async (adapter, responseHandler, errorHandler, isResponseSuccess) => {
        let response;

        const adPayload = {
          ...removeDBFields(adData, [
            'platform',
            'platformAdId',
            'formData',
            'adGroupId',
            'platformAdGroupId',
            'reason',
            'originalRecord',
          ]),
        };

        if (platform === Constants.AD_PLATFORM.SNAPCHAT) {
          response =
            statusInUpdateData === 'DELETE'
              ? await adapter.deleteAd(platformAdId)
              : await adapter.updateAds({
                  adGroupId: adData.platformAdGroupId,
                  adData: [
                    {
                      ...adPayload,
                      status: statusInUpdateData,
                      id: platformAdId,
                      ad_squad_id: adData.platformAdGroupId,
                    },
                  ],
                });
        } else if (platform === Constants.AD_PLATFORM.TIKTOK) {
          response = isStatusUpdateRequest
            ? await adapter.patchAd([
                {
                  ad_id: platformAdId,
                  operation_status: statusInUpdateData,
                },
              ])
            : await adapter.updateAds([
                {
                  ...adPayload,
                  creatives: adPayload.creatives.map((creative) => ({
                    ...creative,
                    ad_id: platformAdId,
                  })),
                  adgroup_id: platformAdGroupId,
                },
              ]);
        }

        const isUpdateSuccess = isResponseSuccess(response);

        if (!isUpdateSuccess) {
          reason = errorHandler(response, 'ads');
          throw new Error(reason);
        }

        platformStatus = statusInUpdateData === 'DELETE' ? 'DELETED' : responseHandler(response, 'ad').platformStatus;
      },
    );
  } catch (error) {
    platformStatus = statusInUpdateData === 'DELETE' ? 'DELETE FAILED' : 'UPDATE FAILED';
    reason = error.message;
  } finally {
    const getObjectDiffResult = getObjectDiff(adInDB, {
      ...(isStatusUpdateRequest ? { ...adInDB, ...updateData } : { ...updateData, status: platformStatus }),
    });

    await updateAdInDB(
      adId,
      {
        ..._.omit(getObjectDiffResult.changes, ['_id', 'platform', 'reason', 'originalRecord']),
        ...(!updateData.formData && !updateData.formDataId && { formDataId }),
        status: platformStatus,
        ...(reason && { reason, originalRecord: { ...adInDB } }),
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
 * Delete an ad for a specific ad ID
 * @param adId
 * @param userContext
 * @param logger
 * @returns {Promise<Object>}
 */
export async function deleteAdById(adId, userContext, logger) {
  return updateAdById(adId, { status: 'DELETE' }, userContext, logger);
}
