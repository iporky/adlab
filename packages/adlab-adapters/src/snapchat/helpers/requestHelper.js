/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import axios from 'axios';
import { createError } from '../utils/errorHandler.js';

let instance = null;

const initialize = ({ accessToken, baseUrl, tokenUrl }) => {
  instance = {
    accessToken,
    baseUrl,
    tokenUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const getInstance = () => {
  if (!instance) {
    throw new Error('RequestHelper instance not initialized. Call initialize first.');
  }
  return instance;
};

const makeRequest = async ({ method, endpoint, data = null, options = {} }) => {
  const { baseUrl, headers } = getInstance();
  try {
    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      data,
      headers: { ...headers, ...(options.headers && { ...options.headers }) },
    });

    return response.data;
  } catch (error) {
    console.log('Error occurred while making request', error);
    const statusCode = error.response ? error.response.status : error.statusCode || 600;
    const errorMessage = error.response ? error.response.data : error.message;
    const additionalInfo = {
      method: method.toUpperCase(),
      url: `${baseUrl}${endpoint}`,
    };
    throw createError({ statusCode, message: errorMessage, additionalInfo });
  }
};

const get = async (endpoint) => makeRequest({ method: 'get', endpoint });

const post = async (endpoint, data) => makeRequest({ method: 'post', endpoint, data });

const postFormData = async (endpoint, form) =>
  makeRequest({
    method: 'post',
    endpoint,
    data: form,
    options: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });

const put = async (endpoint, data) => makeRequest({ method: 'put', endpoint, data });

const remove = async (endpoint) => makeRequest({ method: 'delete', endpoint });

const patch = async (endpoint, data) => makeRequest({ method: 'patch', endpoint, data });

const RequestHelper = {
  initialize,
  getInstance,
  makeRequest,
  get,
  post,
  postFormData,
  put,
  remove,
  patch,
};

export default RequestHelper;
