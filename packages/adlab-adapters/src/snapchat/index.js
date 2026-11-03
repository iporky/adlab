/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import AdPlatformAdapter from '../AdPlatformAdapter.js';
import RequestHelper from './helpers/requestHelper.js';
import AuthController from './controllers/AuthController.js';
import AdController from './controllers/AdController.js';
import AdGroupController from './controllers/AdGroupController.js';
import CampaignController from './controllers/CampaignController.js';
import CreativeController from './controllers/CreativeController.js';
import MediaController from './controllers/MediaController.js';
import MetricsController from './controllers/MetricsController.js';
import TargetingsController from './controllers/TargetingsController.js';

class SnapchatAdapter extends AdPlatformAdapter {
  constructor(adapterSettings) {
    super();
    this.adAccountId = adapterSettings.adAccountId;
    this.apiBaseUrl = adapterSettings.apiBaseUrl;
    this.tokenUrl = adapterSettings.tokenUrl;
    this.authController = new AuthController(adapterSettings);
    this.campaignController = new CampaignController({
      adAccountId: this.adAccountId,
    });
    this.adGroupController = new AdGroupController({
      adAccountId: this.adAccountId,
    });
    this.mediaController = new MediaController({
      adAccountId: this.adAccountId,
    });
    this.creativeController = new CreativeController({
      adAccountId: this.adAccountId,
    });
    this.adController = new AdController({ adAccountId: this.adAccountId });
    this.metricsController = new MetricsController({
      adAccountId: this.adAccountId,
    });
    this.isAccessTokenRefreshed = false;
    this.targetingsController = new TargetingsController({
      adAccountId: this.adAccountId,
    });
    this.accessToken = adapterSettings.accessToken;
    this.updateAccessTokenCallback = adapterSettings.updateAccessTokenCallback;
    this.initializeRequestHelper(this.apiBaseUrl);
  }

  initializeRequestHelper(baseUrl) {
    RequestHelper.initialize({
      accessToken: this.accessToken,
      baseUrl,
      adAccountId: this.adAccountId,
    });
  }

  async getNewAccessToken() {
    return this.authController.getNewAccessToken();
  }

  async refreshAccessToken() {
    this.initializeRequestHelper(this.tokenUrl);
    const accessToken = await this.authController.refreshAccessToken();
    if (!accessToken) {
      throw new Error('Failed to refresh access token');
    }
    this.accessToken = accessToken.access_token;
    if (this.updateAccessTokenCallback) {
      await this.updateAccessTokenCallback({ accessToken: this.accessToken });
    }
    this.isAccessTokenRefreshed = true;
    this.initializeRequestHelper(this.apiBaseUrl);
    return accessToken;
  }

  /* Campaigns */
  async getAllCampaigns() {
    try {
      return await this.campaignController.getAllCampaigns();
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.campaignController.getAllCampaigns();
      }
      throw error;
    }
  }

  async getCampaign(campaignId) {
    try {
      return await this.campaignController.getCampaign(campaignId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.campaignController.getCampaign(campaignId);
      }
      throw error;
    }
  }

  async createCampaigns(campaignData) {
    try {
      console.log('SnapchatAdapter.createCampaigns: ', campaignData);
      return await this.campaignController.createCampaigns(campaignData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.campaignController.createCampaigns(campaignData);
      }
      throw error;
    }
  }

  async updateCampaigns(campaignData) {
    try {
      console.log('SnapchatAdapter.updateCampaigns: ', campaignData);
      return await this.campaignController.updateCampaigns(campaignData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.campaignController.updateCampaigns(campaignData);
      }
      throw error;
    }
  }

  async deleteCampaign(campaignId) {
    try {
      console.log('SnapchatAdapter.deleteCampaign: ', campaignId);
      return await this.campaignController.deleteCampaign(campaignId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.campaignController.deleteCampaign(campaignId);
      }
      throw error;
    }
  }

  /* AdGroups */
  async getAllAdGroups(campaignId) {
    try {
      return await this.adGroupController.getAllAdGroups(campaignId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.getAllAdGroups(campaignId);
      }
      throw error;
    }
  }

  async getAllAdGroupsUnderAdAccount() {
    try {
      return await this.adGroupController.getAllAdGroupsUnderAdAccount();
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.getAllAdGroupsUnderAdAccount();
      }
      throw error;
    }
  }

  async getAdGroup(adGroupId) {
    try {
      return await this.adGroupController.getAdGroup(adGroupId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.getAdGroup(adGroupId);
      }
      throw error;
    }
  }

  async createAdGroups(adGroupData) {
    try {
      console.log('SnapchatAdapter.createAdGroups: ', adGroupData);
      return await this.adGroupController.createAdGroups(adGroupData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.createAdGroups(adGroupData);
      }
      throw error;
    }
  }

  async updateAdGroups(adGroupData) {
    try {
      console.log('SnapchatAdapter.updateAdGroups: ', adGroupData);
      return await this.adGroupController.updateAdGroups(adGroupData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.updateAdGroups(adGroupData);
      }
      throw error;
    }
  }

  async deleteAdGroup(adGroupId) {
    try {
      console.log('SnapchatAdapter.deleteAdGroup: ', adGroupId);
      return await this.adGroupController.deleteAdGroup(adGroupId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adGroupController.deleteAdGroup(adGroupId);
      }
      throw error;
    }
  }

  /* Ads */
  async getAllAds(adGroupId) {
    try {
      return await this.adController.getAllAds(adGroupId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.getAllAds(adGroupId);
      }
      throw error;
    }
  }

  async getAllAdsUnderCampaign(campaignId) {
    try {
      return await this.adController.getAllAdsUnderCampaign(campaignId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.getAllAdsUnderCampaign(campaignId);
      }
      throw error;
    }
  }

  async getAllAdsUnderAdAccount() {
    try {
      return await this.adController.getAllAdsUnderAdAccount();
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.getAllAdsUnderAdAccount();
      }
      throw error;
    }
  }

  async getAd(adId) {
    try {
      return await this.adController.getAd(adId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.getAd(adId);
      }
      throw error;
    }
  }

  async createAds(adData) {
    try {
      console.log('SnapchatAdapter.createAds: ', adData);
      return await this.adController.createAds(adData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.createAds(adData);
      }
      throw error;
    }
  }

  async updateAds(adData) {
    try {
      console.log('SnapchatAdapter.updateAds: ', adData);
      return await this.adController.updateAds(adData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.updateAds(adData);
      }
      throw error;
    }
  }

  async deleteAd(adId) {
    try {
      console.log('SnapchatAdapter.deleteAd: ', adId);
      return await this.adController.deleteAd(adId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.adController.deleteAd(adId);
      }
      throw error;
    }
  }

  /* Media */
  async getAllMedia() {
    return this.mediaController.getAllMedia();
  }

  async getMediaPreview(mediaId) {
    return this.mediaController.getMediaPreview(mediaId);
  }

  async getMediaThumbnail(mediaId) {
    return this.mediaController.getMediaThumbnail(mediaId);
  }

  async getMedia(mediaId) {
    return this.mediaController.getMedia(mediaId);
  }

  async createMedia(mediaData) {
    try {
      return await this.mediaController.createMedia(mediaData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.mediaController.createMedia(mediaData);
      }
      throw error;
    }
  }

  async uploadMedia(mediaData) {
    return this.mediaController.uploadMedia(mediaData);
  }

  async createMediaAndUpload(mediaData) {
    try {
      return await this.mediaController.createMediaAndUpload(mediaData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.mediaController.createMediaAndUpload(mediaData);
      }
      throw error;
    }
  }

  // Creatives
  async getAllCreatives() {
    try {
      return await this.creativeController.getAllCreatives();
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.creativeController.getAllCreatives();
      }
      throw error;
    }
  }

  async getCreative(creativeId) {
    try {
      return await this.creativeController.getCreative(creativeId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.creativeController.getCreative(creativeId);
      }
      throw error;
    }
  }

  async createCreatives(creativeData) {
    try {
      return await this.creativeController.createCreatives(creativeData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.creativeController.createCreatives(creativeData);
      }
      throw error;
    }
  }

  async getCreativePreview(creativeId) {
    try {
      return await this.creativeController.getCreativePreview(creativeId);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.creativeController.getCreativePreview(creativeId);
      }
      throw error;
    }
  }

  // Targeting Options
  async getTargetingOptions(targetingOpts) {
    try {
      return await this.targetingsController.getTargetingOptions(targetingOpts);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.targetingsController.getTargetingOptions(targetingOpts);
      }
      throw error;
    }
  }

  // Metrics
  async getReachMetrics(targetingData) {
    try {
      return await this.metricsController.getReachMetrics(targetingData);
    } catch (error) {
      if (error && error.statusCode === 401 && !this.isAccessTokenRefreshed) {
        await this.refreshAccessToken();
        return this.metricsController.getReachMetrics(targetingData);
      }
      throw error;
    }
  }
}

export default SnapchatAdapter;
