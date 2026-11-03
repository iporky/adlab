'use strict';

import { makeApiRequest } from '../helpers/requestHelper.js';

export class MetricsController {
  constructor(baseURL, advertiserId, accessToken) {
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
    this.baseURL = baseURL;
  }

  async getReachMetrics(opts) {
    const url = `${this.baseURL}/ad/audience_size/estimate/`;

    const payload = {
      ...opts,
      advertiser_id: this.advertiserId,
    };
    const headers = {
      'Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };

    console.log('TikTok-Generating reach metrics for targetings', url);

    return makeApiRequest(url, 'POST', headers, payload);
  }
}
