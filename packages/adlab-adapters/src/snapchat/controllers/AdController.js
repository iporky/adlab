'use strict';

import AdServices from '../services/adServices.js';

const LOG_TAG = 'controller.snapchat.ad';

class AdController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.adServices = AdServices;
  }

  /**
   * Retrieves all ads for a given ad group.
   * @param {string} adGroupId - The ID of the ad group.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad group ID is invalid.
   */

  async getAllAds(adGroupId) {
    const logMessage = `${LOG_TAG}.getAllAds for ad group ${adGroupId}`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      adGroupId,
    };
    return this.adServices.getAllAds(params);
  }

  /**
   * Retrieves all ads for a given campaign.
   * @param {string} campaignId - The ID of the campaign.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   */

  async getAllAdsUnderCampaign(campaignId) {
    const logMessage = `${LOG_TAG}.getAllAdsUnderCampaign for campaign ${campaignId}`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      campaignId,
    };
    return this.adServices.getAllAdsUnderCampaign(params);
  }

  /**
   * Retrieves all ads under an ad account.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async getAllAdsUnderAdAccount() {
    const adAccountId = this.adAccountId;
    const logMessage = `${LOG_TAG}.getAllAdsUnderAdAccount for adAccount ID ${adAccountId}`;
    console.log(logMessage);
    const params = {
      adAccountId,
    };
    return this.adServices.getAllAdsUnderAdAccount(params);
  }

  /**
   *
   * Retrieves a specific ad by its ID.
   * @param {string} adId - The ID of the ad.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad ID is invalid.
   */

  async getAd(adId) {
    const logMessage = `${LOG_TAG}.getAd for ad ${adId}`;
    console.log(logMessage);
    return this.adServices.getAd(adId);
  }

  /**
   * Retrieves a specific ad by its ID.
   * @param {string} adId - The ID of the ad.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad ID is invalid.
   *  @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async createAds({ adGroupId, adData }) {
    const logMessage = `${LOG_TAG}.createAds`;
    console.log(logMessage);
    const params = {
      adGroupId,
      adData,
    };
    return this.adServices.createAds(params);
  }

  /**
   * Updates existing ads for a given ad group.
   * @param {string} adGroupId - The ID of the ad group.
   * @param {Array<Object>} adData - An array of ad data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad data is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad group ID is invalid.
   */

  async updateAds({ adGroupId, adData }) {
    const logMessage = `${LOG_TAG}.updateAds for ad group ${adGroupId}`;
    console.log(logMessage);
    const params = {
      adGroupId,
      adData,
    };
    return this.adServices.updateAds(params);
  }

  /**
   * Deletes an ad.
   * @param {string} adId - The ID of the ad.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad ID is invalid.
   */

  async deleteAd(adId) {
    const logMessage = `${LOG_TAG}.deleteAd for ad ${adId}`;
    console.log(logMessage);
    return this.adServices.deleteAd(adId);
  }
}

export default AdController;
