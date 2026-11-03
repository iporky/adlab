/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

/* eslint-disable class-methods-use-this */
class AdPlatformAdapter {
  constructor(apiClient) {
    this.apiClient = apiClient;
    if (new.target === AdPlatformAdapter) {
      throw new TypeError('Cannot construct AdPlatformAdapter instances directly');
    }
  }

  async getAllCampaigns() {
    throw new Error("Method 'getAllCampaigns()' must be implemented.");
  }

  async getCampaign(campaignId) {
    throw new Error("Method 'getCampaign()' must be implemented.");
  }

  async createCampaigns(campaignData) {
    throw new Error("Method 'createCampaigns()' must be implemented.");
  }

  async updateCampaigns(campaignData) {
    throw new Error("Method 'updateCampaigns()' must be implemented.");
  }

  async deleteCampaign(campaignId) {
    throw new Error("Method 'deleteCampaign()' must be implemented.");
  }

  async getAllAdGroups(campaignId) {
    throw new Error("Method 'getAllAdGroups()' must be implemented.");
  }

  async getAdGroup(adGroupId) {
    throw new Error("Method 'getAdGroup()' must be implemented.");
  }

  async createAdGroups(adGroupData) {
    throw new Error("Method 'createAdGroups()' must be implemented.");
  }

  async updateAdGroups(adGroupData) {
    throw new Error("Method 'updateAdGroups()' must be implemented.");
  }

  async deleteAdGroup(adGroupId) {
    throw new Error("Method 'deleteAdGroup()' must be implemented.");
  }

  async getAllAds(adGroupId) {
    throw new Error("Method 'getAllAds()' must be implemented.");
  }

  async getAd(adId) {
    throw new Error("Method 'getAd()' must be implemented.");
  }

  async createAds(adData) {
    throw new Error("Method 'createAds()' must be implemented.");
  }

  async updateAds(adData) {
    throw new Error("Method 'updateAds()' must be implemented.");
  }

  async deleteAd(adId) {
    throw new Error("Method 'deleteAd()' must be implemented.");
  }

  async getAllCreatives() {
    throw new Error("Method 'getAllCreatives()' must be implemented.");
  }

  async createSavedAudience(opts) {
    throw new Error("Method 'createSavedAudience()' must be implemented.");
  }

  async getSavedAudienceList(opts) {
    throw new Error("Method 'getAudienceList()' must be implemented.");
  }

  async deleteSavedAudience(opts) {
    throw new Error("Method 'deleteSavedAudience()' must be implemented.");
  }

  async getTargetingOptions(opts) {
    throw new Error("Method 'getTargetingOptions()' must be implemented.");
  }
}

export default AdPlatformAdapter;
