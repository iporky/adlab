import { SnapchatAdapter, TiktokAdapter } from 'adlab-adapters';
import lodash from 'lodash';
import * as Constants from '../../lib/constants.js';
import { eventEmitter } from '../../lib/eventsEmitter.js';
import { createAdGroupInDB, updateAdGroupInDB } from '../../dal/adgroupsDAL.js';
import { createAdsInDB } from '../../dal/adsDAL.js';
import { createCampaignInDB, fetchCampaignByIdFromDB, updateCampaignInDB } from '../../dal/campaignsDAL.js';
import { fetchTokenConfig, updateTokenConfig } from './tokenConfigs.js';

const { keys, capitalize, values, omit } = lodash;

/**
 * Get the adapter for the platform
 * @param platform
 * @returns {*}
 */
const getAdapter = (platform) => {
  const adapterMap = {
    Snapchat: SnapchatAdapter,
    TikTok: TiktokAdapter,
  };

  return adapterMap[platform];
};

const isSuccessfulResponse = (platform) => (response) => {
  const responseHandler = {
    TikTok: () => (response[0] || response).code === 0,
    Snapchat: () => response.request_status === 'SUCCESS',
  };
  return responseHandler[platform]();
};

const handlePlatformResponse = (platform) => (response, type) => {
  const responseHandler = {
    TikTok: () => ({
      platformId: (response[0] || response).data[`${type}_id`],
      platformStatus:
        (response[0] || response).message === 'OK'
          ? response[0]?.data.operation_status ||
            response[0]?.data.creatives?.[0]?.operation_status ||
            response.data.status
          : 'FAILED',
    }),
    Snapchat: () => {
      const typ = type === 'adgroup' ? 'adsquad' : type;
      return {
        platformId: response[`${typ}s`][0][typ].id,
        platformStatus: response[`${typ}s`][0][typ].status,
      };
    },
  };

  return responseHandler[platform]();
};

const collateErrorMessages = (platform) => (collection, key) => {
  switch (platform) {
    case 'TikTok':
      return collection
        .filter((ele) => ele.code !== 0)
        .map((ele) => ele.message)
        .join(', ');
    case 'Snapchat':
      return collection[key === 'adgroups' ? 'adsquads' : key]
        .filter((ele) => ele.sub_request_status !== 'SUCCESS')
        .map((ele) => ele.sub_request_error_reason)
        .join(', ');
    default:
      throw new Error('Invalid Platform selected');
  }
};

/**
 * Create platform adapter
 * @param platform
 * @param logger
 * @returns {Promise<*>}
 */
const createPlatformAdapter = async (platform, logger) => {
  const PlatformAdapter = getAdapter(platform);
  if (!PlatformAdapter) {
    throw new Error('Invalid Platform selected');
  }
  const tokenConfigsForPlatform = await fetchTokenConfig({ platform }, logger);
  const {
    adAccountId,
    tokenUrl,
    apiBaseUrl,
    apps: [appTokenConfig],
  } = tokenConfigsForPlatform;

  return new PlatformAdapter({
    adAccountId,
    tokenUrl,
    apiBaseUrl,
    ...appTokenConfig,
    updateAccessTokenCallback: async (updatedTokens) => {
      Object.assign(appTokenConfig, updatedTokens);
      await updateTokenConfig(tokenConfigsForPlatform, 'orchestrator', logger);
    },
  });
};

export const performPlatformOperation = async (args, callback) => {
  const { platform, logger } = args;
  try {
    const adapter = await createPlatformAdapter(platform, logger);

    return await callback(
      adapter,
      handlePlatformResponse(platform),
      collateErrorMessages(platform),
      isSuccessfulResponse(platform),
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Create campaigns, its ad-groups and ads for ad-groups on the platform
 * @param userContext
 * @param userContext.userId
 * @param userContext.clientId
 * @param userContext.accountId
 * @param platform
 * @param campaigns
 * @param recordsCount
 * @param logger
 * @returns {Promise<{errors: {}}>}
 */
export const orchestrateCampaignCreation = async (
  { userId, clientId, accountId },
  platform,
  campaigns,
  recordsCount,
  logger,
  isDraftMode,
  campaignIdInDB,
  formDataIdInDB,
) => {
  const adapter = await createPlatformAdapter(platform, logger);

  eventEmitter.emit('pub-ads-progress', {
    progress: undefined,
    message: `Publishing ads to ${capitalize(platform)}...`,
  });

  const errors = {};
  let publishedAdCount = 0;

  /* CAMPAIGNS - START */
  for (const placeholderId of keys(campaigns)) {
    let campaignId = placeholderId;
    try {
      const { adGroups: adGroupsMap, formData, ...campaignData } = campaigns[placeholderId];
      let dbCampaignDoc;
      if (!campaignIdInDB) {
        dbCampaignDoc = await createCampaignInDB({
          formData,
          ...omit(campaignData, ['operation_status']),
          platform,
          clientId,
          accountId,
          status: 'CREATE PENDING',
          createdBy: userId,
        });
      } else {
        try {
          await updateCampaignInDB(campaignIdInDB, {
            ...campaignData,
            formData: { _id: formDataIdInDB, data: formData },
            formDataId: formDataIdInDB,
            _id: campaignIdInDB,
            status: 'CREATE PENDING',
            updatedBy: userId,
            updateOn: Date.now(),
            clientId,
            accountId,
          });
          dbCampaignDoc = await fetchCampaignByIdFromDB(campaignIdInDB);
        } catch (error) {
          logger.error('Error updating campaign in DB', { error: error.message });
          throw new Error(`Error updating campaign in DB: ${error.message}`);
        }
      }

      if (!isDraftMode) {
        campaignId = dbCampaignDoc._id;
        const campaignResponse = await adapter.createCampaigns([
          {
            ...campaignData,
            status:
              platform === 'Snapchat'
                ? campaignData.status !== 'ACTIVE'
                  ? 'PAUSED'
                  : 'ACTIVE'
                : campaignData.status !== 'ENABLE'
                  ? 'DISABLE'
                  : 'ENABLE',
          },
        ]);

        const isCampaignRequestSuccessful = isSuccessfulResponse(platform)(campaignResponse);
        const { platformId: platformCampaignId, platformStatus: platformCampaignStatus } = isCampaignRequestSuccessful
          ? handlePlatformResponse(platform)(campaignResponse, 'campaign')
          : { platformId: undefined, platformStatus: undefined };

        await updateCampaignInDB(dbCampaignDoc._id, {
          ...dbCampaignDoc,
          platformCampaignId,
          status: !isCampaignRequestSuccessful ? 'CREATE FAILED' : platformCampaignStatus,
          ...(!isCampaignRequestSuccessful && {
            reason: collateErrorMessages(platform)(campaignResponse, 'campaigns'),
          }),
          updatedBy: 'orchestrator',
        });

        if (!isCampaignRequestSuccessful) {
          errors[placeholderId] = collateErrorMessages(platform)(campaignResponse, 'campaigns');
          continue;
        }

        /* AD GROUPS - START */
        for (const adGroup of values(adGroupsMap)) {
          let adGrpId = adGroup.id;
          try {
            const { ads, dsRowId, ...restOfAdGrp } = adGroup;

            const dbAdGroupDoc = await createAdGroupInDB({
              ...omit(restOfAdGrp, ['operation_status']),
              dsRowId,
              campaignId: dbCampaignDoc._id,
              platformCampaignId,
              status: 'CREATE PENDING',
              createdBy: userId,
            });

            adGrpId = dbAdGroupDoc._id;
            const adGroupResponse = await adapter.createAdGroups({
              campaignId: platformCampaignId,
              adGroupData: [
                {
                  ...restOfAdGrp,
                  status:
                    platform === 'Snapchat'
                      ? restOfAdGrp.status !== 'ACTIVE'
                        ? 'PAUSED'
                        : 'ACTIVE'
                      : restOfAdGrp.status !== 'ENABLE'
                        ? 'DISABLE'
                        : 'ENABLE',
                },
              ],
            });

            const isAdGroupRequestSuccessful = isSuccessfulResponse(platform)(adGroupResponse);
            const { platformId: platformAdGroupId, platformStatus: platformAdGroupStatus } = isAdGroupRequestSuccessful
              ? handlePlatformResponse(platform)(adGroupResponse, 'adgroup')
              : { platformId: undefined, platformStatus: undefined };

            await updateAdGroupInDB(dbAdGroupDoc._id, {
              formData: dbCampaignDoc.formData,
              platformAdGroupId,
              status: !isAdGroupRequestSuccessful ? 'CREATE FAILED' : platformAdGroupStatus,
              ...(!isAdGroupRequestSuccessful && {
                reason: collateErrorMessages(platform)(adGroupResponse, 'adgroups'),
              }),
              updatedBy: 'orchestrator',
            });

            if (!isAdGroupRequestSuccessful) {
              errors[placeholderId] = collateErrorMessages(platform)(adGroupResponse, 'adgroups');
              continue;
            }

            /* ADS - START */
            try {
              const adsResponse = await adapter.createAds({
                adGroupId: platformAdGroupId,
                adData: ads,
              });

              await createAdsInDB(
                [
                  ...(platform === Constants.AD_PLATFORM.SNAPCHAT ? adsResponse.ads : []),
                  ...(platform === Constants.AD_PLATFORM.TIKTOK ? adsResponse : []),
                ].map(
                  (
                    {
                      /* Snapchat */
                      sub_request_status: subReqStatus,
                      ad,
                      sub_request_error_reason: reason,
                      /* TikTok */
                      code,
                      message,
                      data: { ad_ids: adIds, creatives } = {},
                    },
                    index,
                  ) => ({
                    adGroupId: dbAdGroupDoc._id,
                    platformAdGroupId,
                    ...omit(ads[index], ['adgroup_id']),
                    ...(isSuccessfulResponse(platform)(adsResponse)
                      ? {
                          ...(platform === Constants.AD_PLATFORM.SNAPCHAT && {
                            platformAdId: ad.id,
                            status: ad.status,
                          }),
                          ...(platform === Constants.AD_PLATFORM.TIKTOK && {
                            platformAdId: adIds[0],
                            status: creatives[0].operation_status,
                          }),
                        }
                      : {
                          status: 'CREATE FAILED',
                          ...(platform === Constants.AD_PLATFORM.SNAPCHAT && {
                            reason,
                          }),
                          ...(platform === Constants.AD_PLATFORM.TIKTOK && {
                            reason: message,
                          }),
                        }),
                    createdBy: userId,
                    updatedBy: 'orchestrator',
                  }),
                ),
              );

              if (!isSuccessfulResponse(platform)(adsResponse)) {
                throw new Error(collateErrorMessages(platform)(adsResponse, 'ads'));
              }

              publishedAdCount += ads.length;
              eventEmitter.emit('pub-ads-progress', {
                progress: Math.round((publishedAdCount / recordsCount) * 100),
                ...(publishedAdCount === recordsCount && {
                  message: `Published ${publishedAdCount} out of ${recordsCount} ads`,
                }),
              });
            } catch (err) {
              logger.error('Err in ads loop', { err: err.message });
              await createAdsInDB(
                ads.map((ad) => ({
                  adGroupId: dbAdGroupDoc._id,
                  platformAdGroupId,
                  ...ad,
                  status: 'CREATE FAILED',
                  reason: err.message,
                  createdBy: userId,
                })),
              );
              errors.campaigns ??= {};
              errors.campaigns[campaignId] ??= { adgroups: {} };
              errors.campaigns[campaignId].adgroups[adGrpId] ??= { ads: {} };
              errors.campaigns[campaignId].adgroups[adGrpId].ads = {
                error: err.message,
              };
            }
            /* ADS - END */
          } catch (err) {
            logger.error('Err in adGroup loop', { err: err.message });
            await updateAdGroupInDB(adGrpId, {
              formDataId: dbCampaignDoc.formData._id,
              status: 'CREATE FAILED',
              reason: err.message,
              updatedBy: 'orchestrator',
            });
            errors.campaigns ??= {};
            errors.campaigns[campaignId] ??= { adgroups: {} };
            errors.campaigns[campaignId].adgroups[adGrpId] = {
              error: err.message,
            };
          }
        }
      }
      /* AD GROUPS - END */
    } catch (err) {
      logger.error('Err in campaign loop', { err: err.message });
      await updateCampaignInDB(campaignId, {
        formDataId: 'dummy-form-data-id',
        status: 'CREATE FAILED',
        reason: err.message,
        updatedBy: 'orchestrator',
      });
      errors.campaigns ??= {};
      errors.campaigns[campaignId] = { error: err.message };
    }
    /* CAMPAIGNS - END */
  }
  return { errors, tally: publishedAdCount };
};

/**
 * Get Preview for creative
 * @param {string} [creativeId] - ID of the creative or ad (required for existing ad preview)
 * @param {string} platform - Platform name ('TikTok' or 'Snapchat')
 * @param {Object} previewOptions - Preview customization options
 * @param {Object} logger - Logger instance
 * @returns {Promise<Object>} Preview data
 */
export const getPreviewForCreative = async (creativeId, platform, previewOptions = {}, logger) => {
  logger.info('Orchestrator service getPreviewForCreative invoked', { platform, creativeId, previewOptions });

  try {
    const adapter = await createPlatformAdapter(platform, logger);

    if (platform === 'TikTok') {
      return await adapter.getAdPreview(creativeId, previewOptions);
    }
    if (platform === 'Snapchat') {
      if (!creativeId) {
        throw new Error('Snapchat requires a creative ID for preview');
      }
      logger.info('Orchestrator service getPreviewForCreative Snapchat invoked');
      return await adapter.getCreativePreview(creativeId);
    }

    throw new Error(`Unsupported platform: ${platform}`);
  } catch (error) {
    logger.error('Error getting creative preview', {
      error,
      platform,
      creativeId,
      previewOptions,
    });
    throw error;
  }
};

/**
 * Get targeting options for the platform
 * @param targetingOpts
 * @param platform
 * @param logger
 * @returns {Promise<*|undefined>}
 */
export const getTargetingOptions = async (targetingOpts, platform, logger) => {
  logger.info('Orchestrator service getTargetingOption invoked');
  const adapter = await createPlatformAdapter(platform, logger);

  return adapter.getTargetingOptions(targetingOpts);
};

/**
 * Create creatives from media
 * @param creativeData
 * @param platform
 * @param logger
 * @returns {Promise<Object|*|undefined>}
 */
export const createCreativeFromMedia = async (creativeData, platform, logger) => {
  logger.info('Orchestrator service createCreativeFromMedia invoked');
  const adapter = await createPlatformAdapter(platform, logger);
  const creatives = await adapter.createCreatives(
    creativeData.map((creative) => ({
      ...creative,
      ad_account_id: adapter.adAccountId,
    })),
  );

  if (creatives.request_status !== 'SUCCESS') {
    throw new Error(collateErrorMessages(platform)(creatives, 'creatives'));
  }

  return creatives;
};

export const createMediaAndUpload = async (mediaData, platform, logger) => {
  logger.info('Orchestrator service createMediaAndUpload invoked');
  const adapter = await createPlatformAdapter(platform, logger);

  return adapter.createMediaAndUpload(mediaData);
};

/**
 * Get audience size for targeting options
 * @param params
 * @param params.platform
 * @param logger
 * @returns {Promise<*|undefined>}
 */
export const getReactMetricsForTargeting = async ({ platform, ...targetingOptions }, logger) => {
  const adapter = await createPlatformAdapter(platform, logger);

  return adapter.getReachMetrics(targetingOptions);
};

/**
 * Create Saved Audience for the platform
 * @param logger
 * @param opts
 * @returns {Promise<*|undefined|Object>}
 */
export const createSavedAudience = async (logger, opts) => {
  const adapter = await createPlatformAdapter(Constants.AD_PLATFORM.TIKTOK, logger);

  return adapter.createSavedAudience(opts);
};

/**
 * Get saved audience list for the platform
 * @param logger
 * @param opts
 * @returns {Promise<*>}
 */
export const getSavedAudienceList = async (logger, opts) => {
  const adapter = await createPlatformAdapter(Constants.AD_PLATFORM.TIKTOK, logger);
  return adapter.getSavedAudienceList(opts);
};

/**
 * Delete saved audience for the platform
 * @param logger
 * @param opts
 * @returns {Promise<*>}
 */
export const deleteSavedAudience = async (logger, opts) => {
  const adapter = await createPlatformAdapter(Constants.AD_PLATFORM.TIKTOK, logger);

  return adapter.deleteSavedAudience(opts);
};
