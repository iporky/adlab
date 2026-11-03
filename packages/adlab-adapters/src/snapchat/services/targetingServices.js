/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */

import RequestHelper from '../helpers/requestHelper.js';

/**
 * Retrieves all targeting options.
 * @param pathSegments
 * @returns {Promise<*|undefined>}
 */
async function getTargetingOptions(pathSegments) {
  const endpoint = `/targeting/${pathSegments}`;
  return RequestHelper.get(endpoint);
}

export default {
  getTargetingOptions,
};
