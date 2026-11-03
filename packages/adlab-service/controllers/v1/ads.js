import { schemas, utils } from 'adlab-shared';
import lodash from 'lodash';
import { TiktokAdapter } from 'adlab-adapters';
import { orchestrateCampaignCreation } from '../../services/v1/orchestrator.js';
import { cleanAndSplit, cleanObject, getUserContextFromReq } from '../../lib/util.js';
import { eventEmitter } from '../../lib/eventsEmitter.js';
import * as adService from '../../services/v1/ads.js';

const { omit, keys } = lodash;

const { schemaUtils } = utils;
const {
  snapchat: { adSchema, campaignSchema, adGroupSchema },
} = schemas;

export const mapAdSchedule = (adSchedule) => {
  if (!adSchedule) return undefined;
  const adScheduleLines = adSchedule.split('\n');
  const adScheduleConfig = {};

  adScheduleLines.forEach((line) => {
    const [day, hours] = line.split(':');
    const hourArray = hours.split(',').map((hour) => parseInt(hour.trim(), 10));
    adScheduleConfig[day.trim()] = { hour_of_day: hourArray };
  });

  return adScheduleConfig;
};

export const mapPlacementV2 = (record) => {
  // Check if the Placement Config Value is 'CUSTOM'
  if (record.placement_config === 'CUSTOM' || record.placement_config === 'CUSTOM') {
    const snapchatPositions = record.snapchat_positions || record.SNAPCHAT_POSITIONS || undefined;
    const exclusion = {
      content_types: record.EXCLUDED_CONTENT_TYPES,
      publisher_ids: record.EXCLUDED_PUBLISHERS,
    };
    const inclusion = {
      content_types: record.INCLUDED_CONTENT_TYPES,
      publisher_ids: record.INCLUDED_PUBLISHERS,
    };
    const returnObj = {
      config: 'CUSTOM',
      snapchat_positions: snapchatPositions,
      exclusion,
      inclusion,
      platforms: ['SNAPCHAT'],
    };
    // Returning custom configuration with positions, inclusion, and exclusion settings
    return returnObj;
  }
  // Default configuration if not 'CUSTOM'
  return {
    config: 'AUTOMATIC',
  };
};

// Function to map geos based on the provided record object
const parseGeoTargeting = (record) => {
  const geos = [];

  // Extract necessary fields from the record
  const country = record.Country;
  const regions = record.Regions;
  const excludeRegions = record['Exclude Regions'];
  const postalCodes = record['Postal Codes'];
  const excludePostalCodes = record['Exclude Postal Codes'];

  // Helper function to parse row values separated by '\r\n' and return an array of objects
  const parseRowValues = (row, operation, type = '') => {
    const parsedValues = [];

    if (row) {
      // Split the row by line breaks and iterate through each value
      const entries = row.split('\r\n');

      entries.forEach((entry) => {
        // Each entry should be split into its individual components (e.g., region_id, country_code, region_name)
        const components = entry.trim().split(' ');

        // Extract region_id and country_code from components, add to parsedValues with the operation
        if (components.length >= 2) {
          switch (type) {
          case 'country':
            parsedValues.push({
              country_code: components[0],
            });
            return;
          case 'region':
            parsedValues.push({
              country_code: components[1],
              region_id: [components[0]],
              operation,
            });
            return;
          case 'postal':
            parsedValues.push({
              country_code: components[1],
              postal_code: [components[0]],
              operation,
            });
          default: // eslint-disable-line no-fallthrough
          }
        }
      });
    }

    return parsedValues;
  };

  // Parse the country row into an array of objects
  const includeCountries = parseRowValues(country, 'include', 'country');

  // Parse the regions row into an array of objects
  const includeRegions = parseRowValues(regions, 'include', 'region');

  // Parse the exclude regions row into an array of objects
  const excludeRegionsParsed = parseRowValues(excludeRegions, 'exclude', 'region');

  // Parse the postal codes row into an array of objects
  const includePostalCodesParsed = parseRowValues(postalCodes, 'include', 'postal');

  const excludePostalCodesParsed = parseRowValues(excludePostalCodes, 'exclude', 'postal');

  // Merge all the parsed values into the geos array
  geos.push(
    ...includeCountries,
    ...includeRegions,
    ...excludeRegionsParsed,
    ...includePostalCodesParsed,
    ...excludePostalCodesParsed,
  );
  return geos;
};

const mapTargetingOptions = (record) => {
  const targeting = {
    demographics: [{}],
    geos: parseGeoTargeting(record),
    devices: [{}],
    regulated_content: record['Regulated Content'] === true,
  };

  const demographics = targeting.demographics[0];
  const devices = targeting.devices[0];

  if (record['Age Groups']) demographics.age_groups = cleanAndSplit(record['Age Groups']);
  if (record['Min Age']) demographics.min_age = record['Min Age'];
  if (record['Max Age']) demographics.max_age = record['Max Age'];
  if (record.Gender) demographics.gender = record.Gender;
  if (record.Languages) demographics.languages = cleanAndSplit(record.Languages);

  if (record['Device Connection Type']) devices.connection_type = record['Device Connection Type'];
  if (record['Device OS Types']) devices.os_type = record['Device OS Types'];
  if (record['Device OS Version Minimum']) devices.os_version_min = String(record['Device OS Version Minimum']);
  if (record['Device OS Version Maximum']) devices.os_version_max = String(record['Device OS Version Maximum']);
  if (record['Device Make']) devices.marketing_name = cleanAndSplit(record['Device Make']);
  if (record['Device Carrier']) devices.carrier_id = cleanAndSplit(record['Device Carrier']);
  return targeting;
};

const snapchatMapper = (adsList) => {
  const campaigns = {};
  const errors = {};
  const recordsCount = adsList.length;

  adsList.forEach((record, index) => {
    const progress = (index + 1) / adsList.length;
    const message = 'Validating records...';
    eventEmitter.emit('pub-ads-progress', { progress, message });

    const tempCampaignId = record['Campaign ID'];
    const rowNumber = record.row;

    if (!campaigns[tempCampaignId]) {
      campaigns[tempCampaignId] = cleanObject({
        end_time: record['Campaign End Time'],
        name: record['Campaign Name'],
        start_time: record['Campaign Start Time'],
        status: record['Campaign Status'],
        measurement_spec: {
          ios_app_id: record['iOS App ID']?.toString(),
          android_app_url: record['Android App URL'],
        },
        objective: record['Campaign Objective'],
        buy_model: record['Buy Model'],
        regulations: {
          restricted_delivery_signals: record['Restricted Delivery Signals'] === 'true',
        },
        adGroups: {},
      });
      const { error } = schemaUtils.validate(
        {
          ...omit(campaigns[tempCampaignId], 'adGroups'),
          ad_account_id: 'ad_account_id_placeholder',
        },
        campaignSchema,
      );
      if (error) {
        errors[rowNumber] = [error];
      }
    }

    const adSetName = record['Ad Set Name'];

    let measurementProviderNames = '';
    if (record['MOAT Auto-Tagging'] === true) {
      measurementProviderNames = 'MOAT_SS';
    }
    if (record['DoubleVerify Auto-Tagging'] === true) {
      measurementProviderNames = 'DOUBLEVERIFY';
    }

    if (!campaigns[tempCampaignId].adGroups[adSetName]) {
      campaigns[tempCampaignId].adGroups[adSetName] = cleanObject({
        name: record['Ad Set Name'],
        bid_micro: record.Bid,
        child_ad_type: record['Child Ad Type'],
        forced_view_setting: record['Forced View Setting'],
        lifetime_budget_micro: record['Ad Set Lifetime Spend Cap'],
        daily_budget_micro: record['Ad Set Daily Spend Cap'],
        end_time: record['Ad Set End Time'],
        optimization_goal: record['Optimization Goal'],
        conversion_window: record['Conversion Window'],
        placement_v2: mapPlacementV2(record),
        start_time: record['Ad Set Start Time'],
        status: record['Ad Set Status'],
        story_ad_creative_type: record['Story Ad Creative Type'],
        type: record['Ad Set Type'] || 'SNAP_ADS',
        measurement_provider_names: measurementProviderNames,
        targeting: mapTargetingOptions(record),
        ad_scheduling_config: mapAdSchedule(record['Dayparting (Ad Set Scheduling)']),
        bid_strategy: record['Bid Strategy'],
        reach_and_frequency_status: record['Reach and Frequency Status'],
        delivery_constraint: record['Ad Set Delivery Constraint'],
        reach_goal: record['Reach Goal'],
        impression_goal: record['Impression Goal'],
        pacing_type: record['Pacing Type'],
        billing_event: 'IMPRESSION',
        ads: [],
      });

      const { error } = schemaUtils.validate(
        {
          ...omit(campaigns[tempCampaignId].adGroups[adSetName], 'ads'),
          campaign_id: 'campaign_id_placeholder',
        },
        adGroupSchema,
      );
      if (error) {
        errors[rowNumber] = errors[rowNumber] ? [...errors[rowNumber], error] : [error];
      }
    }

    const ad = cleanObject({
      name: record['Ad Name'],
      type: record['Ad Type'],
      status: record['Ad Status'],
      creative_id: record['Creative ID'],
    });
    campaigns[tempCampaignId].adGroups[adSetName].ads.push(ad);
    const { error } = schemaUtils.validate({ ...ad, ad_squad_id: 'ad_squad_id_placeholder' }, adSchema);
    if (error) {
      errors[rowNumber] = errors[rowNumber] ? [...errors[rowNumber], error] : [error];
    }
  });

  return { campaigns, errors, recordsCount };
};

const getMapper = (platform) => {
  const mapperMap = {
    Snapchat: snapchatMapper,
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
export const postAds = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to post advertisements');

  const { clientId, userId, accountId } = getUserContextFromReq(req);

  if (!clientId || !userId || !accountId) {
    return res.status(403).json({
      error: 'Invalid user context',
    });
  }

  const { body } = req;
  const { platform, adsList } = body;

  const payloadMapper = getMapper(platform);

  if (!payloadMapper) {
    return res.status(400).json({
      error: 'Invalid platform selected',
    });
  }

  try {
    const { campaign, errors: validationErrors, recordsCount } = payloadMapper(adsList);

    if (validationErrors && keys(validationErrors).length) {
      return res.status(400).json({
        message: 'Invalid request payload',
        errors: validationErrors,
      });
    }

    const { tally, errors: PlatformErrors } = await orchestrateCampaignCreation(
      { clientId, userId, accountId },
      platform,
      campaign,
      recordsCount,
      logger,
    );

    if (keys(PlatformErrors).length) {
      return res.status(400).json({
        message: `Could not publish ads to the ${platform}`,
        errors: PlatformErrors,
      });
    }

    return res.status(200).json({
      message: `${tally} advertisements posted successfully to ${platform}.`,
    });
  } catch (error) {
    logger.error('Error occurred while posting advertisements', { error });
    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * Fetch all ads for a specific ad group ID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
export const getAdsForAdGroup = async function (req, res, next) {
  const { logger } = req.app.locals;
  logger.info('Received request to fetch ads for ad group');
  const { adGroupId } = req.query;
  try {
    const ads = await adService.getAdsForAdGroup(adGroupId);
    return res.status(200).json(ads);
  } catch (error) {
    logger.error(`Error fetching ads for ad group ${adGroupId}: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
