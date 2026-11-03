import { schemas, utils } from 'adlab-shared';
import { TiktokAdapter } from 'adlab-adapters';
import lodash from 'lodash';
import fs from 'fs';
import sharp from 'sharp';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import {
  createCreativeFromMedia,
  createMediaAndUpload,
  orchestrateCampaignCreation,
} from '../../services/v1/orchestrator.js';
import * as Constants from '../../lib/constants.js';
import { cleanObject, errorResponse, getUserContextFromReq } from '../../lib/util.js';
import { mapAdSchedule, mapPlacementV2 } from './ads.js';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const { omit, keys } = lodash;
const { schemaUtils } = utils;
const {
  snapchat: {
    adSchema, campaignSchema, adGroupSchema, creativeSchema, mediaValidationSchema
  },
} = schemas;

const getMediaTypeForCreative = (mediaType) => {
  if (['Top Snap Image', 'App Icon (Snap Ads)', 'Preview Image', 'Logo Image', 'Audience Filter'].includes(mediaType)) {
    return 'IMAGE';
  }

  if (['Top Snap', 'Long form video'].includes(mediaType)) {
    return 'VIDEO';
  }

  return 'LENS_PACKAGE';
};

const downloadAndValidateMedia = async (mediaUrl, mediaType, logger) => {
  try {
    logger.info(`Downloading media from ${mediaUrl}`);
    const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const mediaBuffer = Buffer.from(response.data);

    let metadata;
    const isVideoTypeMedia = ['Top Snap', 'Long form video'].includes(mediaType);
    if (isVideoTypeMedia) {
      const tempFilePath = 'temp_video_file';
      await writeFileAsync(tempFilePath, mediaBuffer);
      metadata = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, mtData) => {
          if (err) {
            reject(err);
          } else {
            resolve(mtData);
          }
        });
      });
      await unlinkAsync(tempFilePath);
    } else {
      metadata = await sharp(mediaBuffer).metadata();
    }

    const payload = {
      mediaType,
      ...(isVideoTypeMedia
        ? {
            duration: metadata.format.duration,
            size: metadata.format.size,
            dimensions: `${metadata.streams[0].width}x${metadata.streams[0].height}`,
            fileType: metadata.format.format_name,
          }
        : {
            size: metadata.size,
            dimensions: `${metadata.width}x${metadata.height}`,
            fileType: metadata.format,
          }),
    };

    const { error: mediaError } = schemaUtils.validate(payload, mediaValidationSchema);

    return {
      mediaBuffer,
      mediaError,
      shouldUploadChunked: isVideoTypeMedia && metadata.format.size > 32 * 1024 * 1024,
    };
  } catch (error) {
    throw new Error(`Error downloading or validating media: ${error.message}`);
  }
};

const formatDateAndTime = (dateTime) => {
  if (!dateTime) return undefined;
  const [month, day, year] = dateTime.split('-');
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

const getFormattedGeoData = (geoData) => {
  const geo = {};
  if (geoData.countries) {
    geo.country_code = geoData.countries.key;
  } else if (geoData.regions) {
    geo.country_code = geoData.country_code;
    geo.region_id = [geoData.regions.key];
  } else if (geoData.cities) {
    geo.country_code = geoData.country_code;
    geo.metro_id = [geoData.cities.key];
  }
  return geo;
};

const getFormatAdvancedDemographicsData = (targetingData) => {
  const DLXD = [];
  if (targetingData.household_income) {
    DLXD.push(targetingData.household_income.key);
  }
  if (targetingData.education) {
    DLXD.push(targetingData.education.key);
  }
  if (targetingData.occupation) {
    DLXD.push(targetingData.occupation.key);
  }
  if (targetingData.parental_status) {
    DLXD.push(targetingData.parental_status.key);
  }
  if (targetingData.life_event) {
    DLXD.push(targetingData.life_event.key);
  }
  return DLXD;
};

const getFormattedDemographicsData = (targetingData) => {
  const demographics = {};
  if (targetingData.age_groups) {
    const [minAge, maxAge] = targetingData.age_groups.name.split('-');
    demographics.min_age = parseInt(minAge, 10);
    demographics.max_age = parseInt(maxAge, 10);
  }
  if (targetingData.genders) {
    demographics.gender = targetingData.genders.name.toUpperCase();
  }
  if (targetingData.locales) {
    demographics.languages = [targetingData.locales.key];
  }
  const advancedDemographics = getFormatAdvancedDemographicsData(targetingData);
  if (advancedDemographics.length) {
    demographics.advanced_demographics = advancedDemographics;
  }
  return demographics;
};

const getFormattedDevicesData = (targetingData) => {
  const devices = {};
  if (targetingData.os_type) {
    devices.os_type = targetingData.os_type.name;
  }
  if (targetingData.os_version) {
    devices.os_version_max = targetingData.os_version.name;
    devices.os_version_min = targetingData.os_version.name;
  }
  if (targetingData.connection_type) {
    devices.connection_type = targetingData.connection_type.name;
  }
  if (targetingData.carrier) {
    devices.carrier_id = [targetingData.carrier.key];
  }
  if (targetingData.marketing_name) {
    devices.marketing_name = [targetingData.marketing_name.key];
  }
  return devices;
};

const getFormattedInterestsData = (targetingData) => {
  const interests = [];
  const interestKeys = [
    'interests_scls',
    'interests_shp',
    'interests_vac',
    'interests_dlxs',
    'interests_dlxc',
    'interests_dlxp',
    'interests_nln',
  ];

  interestKeys.forEach((key) => {
    if (targetingData[key]) {
      interests.push(targetingData[key].key);
    }
  });

  return interests;
};

const getFormattedTargetingData = (config) => {
  const targeting = {};

  const geos = getFormattedGeoData(config);
  if (geos) targeting.geos = [geos];

  const demographics = getFormattedDemographicsData(config);
  if (demographics) targeting.demographics = [demographics];

  const devices = getFormattedDevicesData(config);
  if (devices) targeting.devices = [devices];

  const interests = getFormattedInterestsData(config);
  if (interests.length) {
    targeting.interests = [
      {
        category_id: interests,
      },
    ];
  }

  if (config.categories_loi) {
    targeting.locations = [{ location_type: [config.categories_loi.key] }];
  }
  return targeting;
};

const creativeTypeToPropertiesMap = {
  APP_INSTALL: 'app_install_properties',
  WEB_VIEW: 'web_view_properties',
  DEEP_LINK: 'deep_link_properties',
  AD_TO_LENS: 'ad_to_lens_properties',
  AD_TO_CALL: 'ad_to_call_properties',
  AD_TO_MESSAGE: 'ad_to_message_properties',
  LEAD_GENERATION: 'lead_generation_properties',
  PREVIEW: 'preview_properties',
  COMPOSITE: 'composite_properties',
};

/**
 * Takes a single campaign payload and maps it to Snapchat ad creation format.
 * @param adsPayload
 * @param logger
 * @returns {Promise<{campaign: {campaign1: (*|Dictionary<{}>)}, errors: {}, recordsCount: number}>}
 */
const mapCampaignDataForSnapchat = async (adsPayload, logger) => {
  const errors = {};
  let recordsCount = 0;
  const incrementRecordsCount = () => {
    recordsCount += 1;
  };

  const constructError = (error, keySet) => {
    const { campaignName, adGroupName, adName } = keySet;

    if (campaignName) {
      errors.campaigns ??= {};
      errors.campaigns[campaignName] ??= {};
      if (adGroupName) {
        errors.campaigns[campaignName].adgroups ??= {};
        errors.campaigns[campaignName].adgroups[adGroupName] ??= {};
        if (adName) {
          errors.campaigns[campaignName].adgroups[adGroupName].ads ??= {};
          errors.campaigns[campaignName].adgroups[adGroupName].ads[adName] ??= {};
          errors.campaigns[campaignName].adgroups[adGroupName].ads[adName].error = error;
        } else {
          errors.campaigns[campaignName].adgroups[adGroupName].error = error;
        }
      } else {
        errors.campaigns[campaignName].error = error;
      }
    }
  };

  const dsMap = adsPayload.dsData.reduce((acc, ds) => ({ ...acc, [ds.rowid]: ds }), {});

  /* Campaign payload creation */
  const campaign = cleanObject({
    end_time: formatDateAndTime(adsPayload.end_time),
    name: adsPayload.name,
    start_time: formatDateAndTime(adsPayload.start_time),
    status: adsPayload.status,
    measurement_spec: adsPayload.measurement_spec,
    objective: adsPayload.objective,
    buy_model: adsPayload.buy_model,
    regulations: adsPayload.regulations,
    daily_budget_micro: adsPayload.daily_budget_micro,
    lifetime_spend_cap_micro: adsPayload.lifetime_spend_cap_micro,
    formData: adsPayload.formData,
    adGroups: {},
  });
  const { error: campaignError } = schemaUtils.validate(
    {
      ...omit(campaign, 'adGroups', 'formData'),
      ad_account_id: 'ad_account_id_placeholder',
    },
    campaignSchema,
  );
  if (campaignError) {
    constructError(campaignError, { campaignName: campaign.name });
  }

  /* Ad Groups (personalizedCreatives) payload creation. Contains ads payload per ad group  */
  const creativePromises = [];
  const adValidationPromises = [];
  for (const adGrp of adsPayload.personalizedCreatives) {
    // eslint-disable-next-line no-await-in-loop
    // eslint-disable-next-line
    await (async (recIncrementCallback) => {
      const dsData = dsMap[adGrp.dsRowId];
      const adGroupName = adGrp.creatives.adSetName || dsData['Ad Set Name'];
      if (!campaign.adGroups[adGroupName]) {
        campaign.adGroups[adGroupName] = cleanObject({
          name: adGroupName,
          dsRowId: adGrp.dsRowId,
          bid_micro: adsPayload.bid_micro,
          targeting: getFormattedTargetingData(adGrp.config),
          optimization_goal: adsPayload.optimization_goal,
          bid_strategy: adsPayload.bid_strategy,
          ...(dsData.daily_budget_micro && {
            daily_budget_micro: dsData.daily_budget_micro,
            delivery_constraint: 'DAILY_BUDGET',
          }),
          ...(dsData.lifetime_budget_micro && {
            lifetime_budget_micro: dsData.lifetime_budget_micro,
            delivery_constraint: 'LIFETIME_BUDGET',
          }),
          start_time: formatDateAndTime(adsPayload.start_time),
          end_time: formatDateAndTime(adsPayload.end_time),
          conversion_window: dsData.conversion_window,
          placement_v2: mapPlacementV2(adsPayload),
          status: dsData['Ad Set Status'],
          child_ad_type: dsData.child_ad_type,
          forced_view_setting: dsData.forced_view_setting,
          story_ad_creative_type: dsData.story_ad_creative_type,
          type: dsData['Ad Set Type'] || 'SNAP_ADS',
          ...(dsData['MOAT Auto-Tagging'] && {
            measurement_provider_names: 'MOAT_SS',
          }),
          ...(dsData['DoubleVerify Auto-Tagging'] && {
            measurement_provider_names: 'DOUBLEVERIFY',
          }),
          ad_scheduling_config: mapAdSchedule(dsData['Dayparting (Ad Set Scheduling)']),
          delivery_constraint: adsPayload.delivery_constraint,
          reach_goal: dsData.reach_goal,
          impression_goal: dsData.impression_goal,
          pacing_type: dsData.pacing_type,
          billing_event: 'IMPRESSION',
          ads: [],
        });
        const { error: adGrpErrors } = schemaUtils.validate(
          {
            ...omit(campaign.adGroups[adGroupName], 'ads', 'dsRowId'),
            campaign_id: 'campaign_id_placeholder',
          },
          adGroupSchema,
        );
        if (adGrpErrors) {
          constructError(adGrpErrors, {
            campaignName: campaign.name,
            adGroupName,
          });
        }
      }

      /* Ad payload creation */
      const ad = cleanObject({
        name: dsData['Ad Name'],
        type: adGrp?.creatives?.type || dsData.type,
        status: dsData['Ad Status'],
        creative_id: adGrp?.creatives?.creative_id || dsData.creative_id,
      });

      /* If creative_id is not provided, create a creative from media */
      if (!ad.creative_id) {
        let mediaId = adGrp?.creatives?.media_id || dsData.media_id;

        /* If media_id is not provided, download media and create media */
        if (!mediaId) {
          const mediaUrl = adGrp?.creatives?.media_url || dsData.media_url;
          const mediaName = adGrp?.creatives?.media_name || dsData.media_name;
          const creativeTypeForMedia = adGrp?.creatives?.media_type || dsData.media_type;
          try {
            if (!mediaUrl || !mediaName || !creativeTypeForMedia) {
              throw new Error(
                'Media details missing. Either provide creative_id or media_id or [media_url, media_name and media_type]',
              );
            }
            const { mediaBuffer, shouldUploadChunked, mediaErrors } = await downloadAndValidateMedia(
              mediaUrl,
              creativeTypeForMedia,
              logger,
            );

            if (mediaErrors) {
              throw new Error(mediaErrors);
            }
            const media = await createMediaAndUpload(
              [
                {
                  name: mediaName,
                  type: getMediaTypeForCreative(creativeTypeForMedia),
                  file: { buffer: mediaBuffer, name: mediaName },
                  shouldUploadChunked,
                },
              ],
              Constants.AD_PLATFORM.SNAPCHAT,
              logger,
            );
            mediaId = media.id;
          } catch (err) {
            constructError(err.message, {
              campaignName: campaign.name,
              adGroupName,
              adName: ad.name,
            });
            return recIncrementCallback();
          }
        }

        /* Creative Payload */
        const creativeType = adGrp?.creatives?.type || dsData.creative_type;
        const additionalProperties = creativeTypeToPropertiesMap[creativeType];
        const creativePayload = cleanObject({
          top_snap_media_id: mediaId,
          top_snap_crop_position: adGrp?.creatives?.top_snap_crop_position || 'OPTIMIZED',
          name: adGrp?.creatives?.name || dsData.creative_name,
          call_to_action: adGrp?.creatives?.call_to_action || dsData.call_to_action,
          type: creativeType,
          brand_name: adGrp?.creatives?.brand_name || dsData.brand_name,
          headline: adGrp?.creatives?.headline || dsData.headline,
          shareable: adGrp?.creatives?.shareable || dsData.shareable,
          profile_properties: adGrp?.creatives?.profile_properties || {
            profile_id: dsData.profile_id,
          },
          /* Creative type specific properties */
          ...(additionalProperties && {
            [additionalProperties]: adGrp?.creatives?.type_specific_properties,
          }),
        });

        const { error: creativeError } = schemaUtils.validate(
          {
            ...creativePayload,
            ad_account_id: 'ad_account_id_placeholder',
          },
          creativeSchema,
        );

        if (creativeError) {
          constructError(creativeError, {
            campaignName: campaign.name,
            adGroupName,
            adName: ad.name,
          });
          return recIncrementCallback();
        }

        /* Create creation promises are added to array to execute simultaneously to
         * prevent loop blocking. Creative creation needs to be executed before ad payload validation */
        // eslint-disable-next-line
        creativePromises.push(async () => {
          try {
            const {
              creatives: [response],
            } = await createCreativeFromMedia([creativePayload], Constants.AD_PLATFORM.SNAPCHAT, logger);
            if (response.sub_request_status !== 'SUCCESS') {
              throw new Error(response.creative.sub_request_error_reason);
            }
            ad.creative_id = response.creative.id;
          } catch (err) {
            constructError(err.message, {
              campaignName: campaign.name,
              adGroupName,
              adName: ad.name,
            });
            return recIncrementCallback();
          }
        });
      }

      campaign.adGroups[adGroupName].ads.push(ad);
      recIncrementCallback();
    })(incrementRecordsCount);
  }
  /* Execute all creative creation promises in parallel */
  await Promise.allSettled(creativePromises.map(async (fn) => fn()));

  /* Validate all ad payloads for all ad groups */
  keys(campaign.adGroups).forEach((adGroupName) => {
    campaign.adGroups[adGroupName].ads.forEach((ad) => {
      /* Skip ad validation if ad has an at media or creative level */
      if (errors.campaigns?.[campaign.name]?.adgroups?.[adGroupName]?.ads?.[ad.name]?.error) return;
      adValidationPromises.push(
        () =>
          new Promise((resolve) => {
            const { error: adError } = schemaUtils.validate(
              { ...ad, ad_squad_id: 'ad_squad_id_placeholder' },
              adSchema,
            );
            if (adError) {
              constructError(adError, {
                campaignName: campaign.name,
                adGroupName,
                adName: ad.name,
              });
            }
            resolve();
          }),
      );
    });
  });
  await Promise.allSettled(adValidationPromises.map((fn) => fn()));

  /* Return campaign payload, errors and records count */
  return { campaign: { campaign1: campaign }, errors, recordsCount };
};

const getMapper = (platform) => {
  const mapperMap = {
    Snapchat: mapCampaignDataForSnapchat,
    TikTok: TiktokAdapter.map,
  };
  return mapperMap[platform];
};

/**
 * Post advertisements to the social platform
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const postAdsFromAdvPortal = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to post advertisements');

  const userContext = getUserContextFromReq(req);
  const { body } = req;
  const {
    platform, cid, formDataId, ...adsPayload
  } = body;
  const payloadMapper = getMapper(platform);
  const { draftMode } = req.query;
  if (!payloadMapper) {
    return res.status(400).json({
      message: 'Invalid platform selected',
    });
  }

  try {
    const { campaign, errors: validationErrors, recordsCount } = await payloadMapper(adsPayload, logger);

    if (validationErrors && keys(validationErrors).length) {
      return res.status(400).json({ message: 'Invalid request payload', errors: validationErrors });
    }

    const { tally, errors: PlatformErrors } = await orchestrateCampaignCreation(
      userContext,
      platform,
      campaign,
      recordsCount,
      logger,
      draftMode,
      cid,
      formDataId,
    );

    if (keys(PlatformErrors).length) {
      return draftMode
        ? errorResponse(res, `Could not save Campaign to the ${platform}`, PlatformErrors)
        : errorResponse(res, `Could not publish ads to the ${platform}`, PlatformErrors);
    }

    const successMessage = draftMode
      ? `${platform} Campaign saved in draft mode.`
      : `${tally} advertisements posted successfully to ${platform}.`;

    return res.status(200).json({ message: successMessage });
  } catch (error) {
    logger.error('Error occurred while posting advertisements', { error });
    return res.status(500).json({
      error: error.message,
    });
  }
};
