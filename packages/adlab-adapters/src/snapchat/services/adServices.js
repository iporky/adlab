/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { schemas, utils } from 'adlab-shared';
import { createError } from '../utils/errorHandler.js';
import { mapAdData } from '../utils/parameterMapper.js';
import RequestHelper from '../helpers/requestHelper.js';

const {
  snapchat: { adSchema, updateAdSchema },
} = schemas;
const { schemaUtils } = utils;

/**
 * Retrieves all ad groups for a given campaign.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adGroupId - The ID of the Ad Group.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllAds({ adGroupId }) {
  const endpoint = `/adsquads/${adGroupId}/ads`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves all ads under a campaign.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */

async function getAllAdsUnderCampaign({ campaignId }) {
  const endpoint = `/campaigns/${campaignId}/ads`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves all ads under an ad account.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllAdsUnderAdAccount({ adAccountId }) {
  const endpoint = `/adaccounts/${adAccountId}/ads`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a specific ad by its ID.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adId - The ID of the ad.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAd({ adId }) {
  const endpoint = `/ads/${adId}`;
  return RequestHelper.get(endpoint);
}

async function createAds({ adGroupId, adData }) {
  try {
    if (!Array.isArray(adData)) {
      throw createError({
        statusCode: 400,
        message: 'adData should be an array of ads',
      });
    }

    const payload = { ads: [] };

    for (const ad of adData) {
      const adPayload = { ...ad, ad_squad_id: adGroupId };
      const { error } = schemaUtils.validate(adPayload, adSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: error,
        });
      }
      payload.ads.push(adPayload);
    }

    const endpoint = `/adsquads/${adGroupId}/ads`;
    return await RequestHelper.post(endpoint, payload);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

async function updateAds({ adGroupId, adData }) {
  try {
    if (!Array.isArray(adData)) {
      throw createError({
        statusCode: 400,
        message: 'adData should be an array of ads',
      });
    }

    const payload = { ads: [] };

    for (const ad of adData) {
      const { error } = schemaUtils.validate(ad, updateAdSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: `schema Error: ${error}`,
        });
      }

      const mappedData = mapAdData(ad);
      payload.ads.push(mappedData);
    }
    const endpoint = `/adsquads/${adGroupId}/ads`;
    return await RequestHelper.put(endpoint, payload);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

async function deleteAd(adId) {
  const endpoint = `/ads/${adId}`;
  return RequestHelper.remove(endpoint);
}

export default {
  getAllAds,
  getAllAdsUnderCampaign,
  getAllAdsUnderAdAccount,
  getAd,
  createAds,
  updateAds,
  deleteAd,
};
