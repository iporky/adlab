/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { schemas, utils } from 'adlab-shared';
import { createError } from '../utils/errorHandler.js';
import { mapCreativeData } from '../utils/parameterMapper.js';
import RequestHelper from '../helpers/requestHelper.js';

const {
  snapchat: { creativeSchema },
} = schemas;
const { schemaUtils } = utils;

/**
 *  Retrieves all creatives.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllCreatives({ adAccountId }) {
  const endpoint = `/adaccounts/${adAccountId}/creatives`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a creative by its ID.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.creativeId - The ID of the creative.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the creative ID is invalid.
 */
async function getCreative({ creativeId }) {
  const endpoint = `/creatives/${creativeId}`;
  return RequestHelper.get(endpoint);
}

/**
 * Creates new creatives for a given ad account.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @param {Array<Object>} params.creativeData - An array of creative data objects.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the creative data is invalid.
 * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
 */
async function creativeCreatives({ adAccountId, creativesData }) {
  try {
    if (!Array.isArray(creativesData)) {
      throw createError({
        statusCode: 400,
        message: 'creativesData should be an array of creatives',
      });
    }

    const payload = { creatives: [] };

    for (const creative of creativesData) {
      const { error } = schemaUtils.validate(creative, creativeSchema);
      if (error) {
        throw createError({
          statusCode: 400,
          message: `schema-error: ${error.details[0].message}`,
        });
      }

      const mappedData = mapCreativeData(creative);
      payload.creatives.push(mappedData);
    }

    const endpoint = `/adaccounts/${adAccountId}/creatives/`;
    return RequestHelper.post(endpoint, payload);
  } catch (error) {
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

async function getCreativePreview({ creativeId }) {
  const endpoint = `/creatives/${creativeId}/snapcode`;
  try {
    return RequestHelper.get(endpoint);
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

export default {
  getAllCreatives,
  getCreative,
  creativeCreatives,
  getCreativePreview,
};
