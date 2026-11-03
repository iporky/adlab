'use strict';

import axios from 'axios';

/**
 * Serialize parameters to a query string
 * @param {Object} params - The parameters to serialize
 * @returns {string} - The serialized query string
 */
function paramsSerializer(params) {
  return Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        const serializedValue = value.map((v) => (typeof v === 'string' ? `"${v}"` : v)).join(',');
        return `${key}=[${serializedValue}]`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

/**
 * Make an API request
 * @param {string} url - The URL to make the request to
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST')
 * @param {Object} headers - The headers to include in the request
 * @param {Object} data - The data to send with the request (for POST, PUT, etc.)
 * @returns {Promise<Object>} - The response data or error response
 */
export async function makeApiRequest(url, method, headers, data = null) {
  try {
    const response = await axios({
      url,
      method,
      headers,
      [method === 'GET' ? 'params' : 'data']: data,
      paramsSerializer,
    });

    if (response.data.code === 0) {
      return response.data.data;
    }

    throw new Error(`Error: ${response.data.message}`);
  } catch (error) {
    console.error('API request failed:', error.message);
    return { error: error.message };
  }
}
