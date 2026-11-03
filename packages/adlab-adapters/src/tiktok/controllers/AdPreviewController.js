// FILE: AdPreviewController.js
'use strict';

import { makeApiRequest } from '../helpers/requestHelper.js';

export class AdsPreviewController {
  constructor(accessToken, baseURL) {
    this.accessToken = accessToken;
    this.baseURL = baseURL;
  }

  /**
   * Generate an ad preview for both existing ads and pre-creation scenarios
   * @param {string} advertiserId - Advertiser's TikTok ID
   * @param {string} creativeId - Creative ID for existing ad preview
   * @param {Object} options - Preview options
   * @param {string} [options.preview_type='SINGLE_VIDEO'] - Type of preview (e.g. 'SINGLE_VIDEO')
   * @param {Object} [options.creative_info] - Creative info for pre-creation preview
   * @returns {Promise<Object>} - The ad preview URL or error response
   */
  async generateAdPreview(advertiserId, creativeId, options = {}) {
    const url = `${this.baseURL}/creative/ads_preview/create/`;

    const payload = {
      advertiser_id: advertiserId,
      ...(creativeId && { ad_id: creativeId, preview_type: 'AD' }),
      ...(options || {}),
    };
    const headers = {
      'Access-Token': this.accessToken,
      'Content-Type': 'application/json',
    };

    console.log(`TikTok-Generating ad preview for ${creativeId ? 'existing ad' : 'pre-creation'}:`, url);

    return makeApiRequest(url, 'POST', headers, payload);
  }
}
