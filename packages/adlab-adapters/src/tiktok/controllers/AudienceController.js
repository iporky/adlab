'use strict';

import { makeApiRequest } from '../helpers/requestHelper.js';

export class AudienceController {
  constructor(baseURL, advertiserId, accessToken) {
    this.baseURL = baseURL;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  createSavedAudience(opts) {
    const url = `${this.baseURL}/dmp/saved_audience/create/`;

    const headers = {
      'Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };

    const payload = {
      advertiser_id: this.advertiserId,
      saved_audience_name: opts.saved_audience_name,
      location_ids: opts.location_ids,
      gender: opts.gender,
      age_groups: opts.age_groups,
      languages: opts.languages,
      audience_ids: opts.audience_ids,
      excluded_audience_ids: opts.excluded_audience_ids,
      interest_category_ids: opts.interest_category_ids,
      interest_keyword_ids: opts.interest_keyword_ids,
      ...(opts.action && {
        actions: {
          action_category_ids: opts.action.action_category_ids,
          action_scene_ids: opts.action.action_scene_ids,
          action_period: opts.action.action_period,
          video_user_actions: opts.action.video_user_actions,
        },
      }),
      operating_systems: opts.operating_systems,
      min_android_version: opts.min_android_version,
      min_ios_version: opts.min_ios_version,
      device_model_ids: opts.device_model_ids,
      network_types: opts.network_types,
      carrier_ids: opts.carrier_ids,
      device_price_ranges: opts.device_price_ranges,
    };

    console.log('TikTok-Generating create saved audience:', url);

    return makeApiRequest(url, 'POST', headers, payload);
  }

  async getSavedAudienceList(opts) {
    const url = `${this.baseURL}/dmp/saved_audience/list/`;

    const headers = { 'Access-Token': this.accessToken };

    const payload = {
      advertiser_id: this.advertiserId,
      ...(opts.savedAudienceIds && { saved_audience_ids: opts.savedAudienceIds }),
    };

    console.log('TikTok-Generating get saved audience:', url);

    return await makeApiRequest(url, 'GET', headers, payload);
  }

  deleteSavedAudience(opts) {
    const url = `${this.baseURL}/dmp/saved_audience/delete/`;

    const headers = {
      'Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };

    const payload = {
      advertiser_id: this.advertiserId,
      saved_audience_ids: opts.savedAudienceId,
    };

    console.log('TikTok-Generating delete saved audience:', url);

    return makeApiRequest(url, 'POST', headers, payload);
  }
}
