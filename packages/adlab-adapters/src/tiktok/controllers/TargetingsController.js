'use strict';

import { makeApiRequest } from '../helpers/requestHelper.js';

const availableTargetingOptions = {
  action_category: 'GET /tool/action_category/',
  os_version: 'GET /tool/os_version/',
  isp: 'GET /tool/targeting/list/',
  purchase_intention_categories: 'GET /targeting/search/',
  zip_code_ids: 'POST /tool/targeting/search/',
  carrier: 'GET /tool/carrier/',
  device_model: 'GET /tool/device_model/',
  interest_category: 'GET /tool/interest_category/',
  interest_keyword_recommend: 'GET /tool/interest_keyword/recommend/',
  language: 'GET /tool/language/',
  region: 'GET /tool/region/',
};

export class TargetingsController {
  constructor(advertiserId, accessToken, baseUrl) {
    this.baseUrl = baseUrl;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  async getTargetingOptions(opts, callback) {
    const { type } = opts;

    if (!Object.keys(availableTargetingOptions).includes(type)) {
      throw new Error(`Invalid targeting option type: ${type}`);
    }

    const [method, path] = availableTargetingOptions[type].split(' ');
    const url = `${this.baseUrl}${path}`;

    const payload = {
      advertiser_id: this.advertiserId,
      ...(opts?.fields || {}),
      ...(opts?.filtering || {}),
    };

    const headers = {
      'Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };

    try {
      const response = await makeApiRequest(url, method, headers, payload);
      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }
}
