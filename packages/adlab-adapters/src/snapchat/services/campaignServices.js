/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { schemas, utils } from 'adlab-shared';
import { createError } from '../utils/errorHandler.js';
import RequestHelper from '../helpers/requestHelper.js';

const {
  snapchat: { campaignSchema, updateCampaignSchema },
} = schemas;
const { schemaUtils } = utils;
/**
 * Retrieves all campaigns for a given ad account.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllCampaigns({ adAccountId }) {
  const endpoint = `/adaccounts/${adAccountId}/campaigns/`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a specific campaign by its ID.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getCampaign({ campaignId }) {
  const endpoint = `/campaigns/${campaignId}`;
  return RequestHelper.get(endpoint);
}

/**
 * Creates new campaigns for a given ad account.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @param {Array<Object>} params.campaignData - An array of campaign data objects.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the campaign data is invalid.
 */
async function createCampaigns({ adAccountId, campaignData }) {
  const payload = { campaigns: [] };
  try {
    if (!Array.isArray(campaignData)) {
      return createError({
        statusCode: 400,
        message: 'campaignData should be an array of campaigns',
      });
    }

    for (const campaign of campaignData) {
      campaign.ad_account_id = adAccountId;
      const { error } = schemaUtils.validate(campaign, campaignSchema);
      if (error) {
        return createError({
          statusCode: 400,
          message: error,
        });
      }
      payload.campaigns.push(campaign);
    }
    const endpoint = `/adaccounts/${adAccountId}/campaigns/`;
    return await RequestHelper.post(endpoint, payload);
  } catch (error) {
    if (error.statusCode === 401) {
      throw createError({
        statusCode: error.statusCode,
        message: 'Unauthorized',
      });
    }
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

/**
 * Updates existing campaigns for a given ad account.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @param {Array<Object>} params.campaignData - An array of campaign data objects.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the campaign data is invalid or exceeds the limit.
 */
async function updateCampaigns({ adAccountId, campaignData }) {
  try {
    if (!Array.isArray(campaignData)) {
      throw createError({
        statusCode: 400,
        message: 'campaignData should be an array of campaigns',
      });
    }

    if (campaignData.length > 100) {
      throw createError({
        statusCode: 400,
        message: 'adAccount can have only 100 campaigns',
      });
    }

    const payload = { campaigns: [] };

    for (const campaign of campaignData) {
      const campaignWithAdAccId = { ...campaign, ad_account_id: adAccountId };
      const { error } = schemaUtils.validate(campaignWithAdAccId, updateCampaignSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: error,
        });
      }

      payload.campaigns.push(campaignWithAdAccId);
    }

    const endpoint = `/adaccounts/${adAccountId}/campaigns/`;
    return await RequestHelper.put(endpoint, payload);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

/**
 * Deletes a specific campaign by its ID.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function deleteCampaign({ campaignId }) {
  const endpoint = `/campaigns/${campaignId}`;
  return RequestHelper.remove(endpoint);
}

export default {
  getAllCampaigns,
  getCampaign,
  createCampaigns,
  updateCampaigns,
  deleteCampaign,
};
