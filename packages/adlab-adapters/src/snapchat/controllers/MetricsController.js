/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import metricsServices from '../services/metricsServices.js';

const LOG_TAG = 'controller.snapchat.metrics';

class MetricsController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.metricsServices = metricsServices;
  }

  /**
   * get reach metrics for the given target specs
   * @param {*} targetingData
   * @returns
   */
  async getReachMetrics(targetingData) {
    const logMessage = `${LOG_TAG}.getReachMetrics for targetingData ${targetingData}`;
    console.log(logMessage);

    return this.metricsServices.getReachMetrics({
      adAccountId: this.adAccountId,
      targetingData,
    });
  }
}

export default MetricsController;
