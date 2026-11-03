/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { createError } from '../utils/errorHandler.js';
import RequestHelper from '../helpers/requestHelper.js';

const LOG_TAG = 'service.auth';

/**
 * Retrieves tokens from the Snapchat API.
 *
 * @param {Object} params - The parameters for the request.
 * @param {Object} params.postData - The data to be sent with the POST request.
 * @param {string} params.tokenUrl - The Token URL for the API request.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {ErrorHandler} - Throws an error if the request fails.
 */
async function getTokens({ postData, tokenUrl }) {
  console.log(`${LOG_TAG}.getTokens`);
  try {
    // Make the POST request using the RequestHelper instance
    const endpoint = '/login/oauth2/access_token';
    const response = await RequestHelper.post(endpoint, postData);
    return response;
  } catch (error) {
    throw createError(500, `Request error: ${error.message}`);
  }
}

/**
 * Retrieves a new access token using the client credentials and authorization code.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.clientId - The client ID.
 * @param {string} params.clientSecret - The client secret.
 * @param {string} params.redirectUri - The redirect URI.
 * @param {string} params.authorizationCode - The authorization code.
 * @param {string} params.tokenUrl - The base URL for the API request.
 * @returns {Promise<Object>} - A promise that resolves to the new access tokens.
 * @throws {ErrorHandler} - Throws an error if the request fails.
 */
async function getNewAccessToken({ clientId, clientSecret, redirectUri, authorizationCode, tokenUrl }) {
  const postData = new URLSearchParams({
    code: authorizationCode,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  }).toString();

  try {
    return await getTokens({ postData, tokenUrl });
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

/**
 * Refreshes the access token using the client credentials and refresh token.
 *
 * @param {Object} params - The parameters for the request.
 * @param {string} params.clientId - The client ID.
 * @param {string} params.clientSecret - The client secret.
 * @param {string} params.refreshToken - The refresh token.
 * @param {string} params.tokenUrl - The token URL for the TOKEN request.
 * @returns {Promise<Object>} - A promise that resolves to the new access token.
 * @throws {ErrorHandler} - Throws an error if the request fails.
 */
async function refreshAccessToken({ clientId, clientSecret, refreshToken, tokenUrl }) {
  const postData = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  }).toString();
  try {
    return await getTokens({ postData, tokenUrl });
  } catch (error) {
    throw createError({ statusCode: error.statusCode, message: error.message });
  }
}

export { getNewAccessToken, refreshAccessToken };
