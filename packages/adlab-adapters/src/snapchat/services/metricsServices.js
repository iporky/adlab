/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import RequestHelper from '../helpers/requestHelper.js';

async function getReachMetrics({ adAccountId, targetingData }) {
  const endpoint = `/adaccounts/${adAccountId}/audience_size_v2`;

  return RequestHelper.post(endpoint, targetingData);
}

export default {
  getReachMetrics,
};
