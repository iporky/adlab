/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { schemas, utils } from 'adlab-shared';
import { createError } from '../utils/errorHandler.js';
import { mapAdGroupData } from '../utils/parameterMapper.js';
import RequestHelper from '../helpers/requestHelper.js';

const {
  snapchat: { adGroupSchema, updateAdGroupSchema },
} = schemas;
const { schemaUtils } = utils;
/**
 * Retrieves all ad groups for a given campaign.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllAdGroups({ campaignId }) {
  const endpoint = `/campaigns/${campaignId}/adsquads?return_placement_v2=true`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves all ad groups under an ad account.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */

async function getAllAdGroupsUnderAdAccount({ adAccountId }) {
  const endpoint = `/adaccounts/${adAccountId}/adsquads`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a specific ad group by its ID.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adGroupId - The ID of the ad group.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */

async function getAdGroup(adGroupId) {
  const endpoint = `/adsquads/${adGroupId}`;
  return RequestHelper.get(endpoint);
}

/**
 * Creates ad groups for a given campaign.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @param {Array<Object>} params.adGroupData - The data for the ad groups.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the ad group data is invalid.
 * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
 */

async function createAdGroups({ campaignId, adGroupData }) {
  try {
    if (!Array.isArray(adGroupData)) {
      throw createError({
        statusCode: 400,
        message: 'adGroupData should be an array of ad groups',
      });
    }

    const payload = { adsquads: [] };

    for (const adGroup of adGroupData) {
      const adGroupPayload = { ...adGroup, campaign_id: campaignId };
      const { error } = schemaUtils.validate(adGroupPayload, adGroupSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: error,
        });
      }
      payload.adsquads.push(adGroupPayload);
    }

    const endpoint = `/campaigns/${campaignId}/adsquads`;
    return await RequestHelper.post(endpoint, payload);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

/**
 * Updates an ad group.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.campaignId - The ID of the campaign.
 * @param {Object} params.adGroupData - The data for the ad group.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the ad group data is invalid.
 * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
 */

async function updateAdGroups({ campaignId, adGroupData }) {
  try {
    if (!Array.isArray(adGroupData)) {
      throw createError({
        statusCode: 400,
        message: 'adGroupData should be an array of ad groups',
      });
    }

    const payload = { adsquads: [] };

    for (const adGroup of adGroupData) {
      const { error } = schemaUtils.validate(adGroup, updateAdGroupSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: `schema-error ${error}`,
        });
      }

      const mappedData = mapAdGroupData(adGroup);
      payload.adsquads.push(mappedData);
    }

    const endpoint = `/campaigns/${campaignId}/adsquads`;
    return await RequestHelper.put(endpoint, payload);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

/**
 * Deletes an ad group by its ID.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adGroupId - The ID of the ad group.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the ad group ID is invalid.
 */

async function deleteAdGroup({ adGroupId }) {
  const endpoint = `/adsquads/${adGroupId}`;
  return RequestHelper.remove(endpoint);
}

export default {
  getAllAdGroups,
  getAllAdGroupsUnderAdAccount,
  getAdGroup,
  createAdGroups,
  updateAdGroups,
  deleteAdGroup,
};
