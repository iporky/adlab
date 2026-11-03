import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import * as jsSdk from 'tiktok-business-api-sdk-official';
import { AdController } from './controllers/AdController.js';
import { AdGroupController } from './controllers/AdGroupController.js';
import { AdsPreviewController } from './controllers/AdPreviewController.js';
import { AudienceController } from './controllers/AudienceController.js';
import { CampaignController } from './controllers/CampaignController.js';
import { CreativeAssetsController } from './controllers/CreativeAssetsController.js';
import { FileController } from './controllers/FileController.js';
import { TargetingsController } from './controllers/TargetingsController.js';
import { MetricsController } from './controllers/MetricsController.js';
import { adCreateBodySchema, adGroupCreateBodySchema, campaignCreateBodySchema } from './utils/joi-schemas.js';
import { TikTokRequestMapper } from './mappers/tiktok-request-mapper.js';
import AdPlatformAdapter from '../AdPlatformAdapter.js';

const computeSHA256 = (buffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
};

export default class TiktokAdapter extends AdPlatformAdapter {
  constructor(adapterSettings) {
    super();
    this.handleError = (message, error) => {
      throw new Error(`${message}: ${error.message}`, { cause: error });
    };

    if (!adapterSettings.accessToken) {
      this.handleError('Invalid input: accessToken is required.');
    } else {
      this.accessToken = adapterSettings.accessToken;
    }

    this.advertiserId = adapterSettings.adAccountId;
    this.baseUrl = adapterSettings.apiBaseUrl;
    this.bypassJoiSchemaValidation = true;

    this.campaignController = new CampaignController(
      new jsSdk.CampaignCreationApi(),
      this.advertiserId,
      this.accessToken,
    );
    this.adGroupController = new AdGroupController(new jsSdk.AdgroupApi(), this.advertiserId, this.accessToken);
    this.adController = new AdController(new jsSdk.AdApi(), this.advertiserId, this.accessToken);
    this.fileController = new FileController(new jsSdk.FileApi(), this.advertiserId, this.accessToken);
    this.creativeAssetsController = new CreativeAssetsController(
      new jsSdk.CreativeAssetApi(),
      this.advertiserId,
      this.accessToken,
    );
    this.targetingsController = new TargetingsController(this.advertiserId, this.accessToken, this.baseUrl);
    this.audienceController = new AudienceController(new jsSdk.AudienceApi(), this.advertiserId, this.accessToken);
    this.updateAccessTokenCallback = adapterSettings.updateAccessTokenCallback;

    this.adsPreviewController = new AdsPreviewController(this.accessToken, this.baseUrl);
    this.audienceController = new AudienceController(this.baseUrl, this.advertiserId, this.accessToken);
    this.metricsController = new MetricsController(this.baseUrl, this.advertiserId, this.accessToken);

    this.wrapCallbackWithPromise = (controllerMethod, ...args) =>
      new Promise((resolve, reject) => {
        controllerMethod(...args, (err, response) => {
          if (err) reject(err);
          resolve(response);
        });
      });
  }

  validateInput(inputData, schema = null) {
    if (!inputData || (typeof inputData === 'object' && Object.keys(inputData).length === 0)) {
      throw new Error('Invalid input: inputData must be a non-empty object.');
    }
    if (!this.bypassJoiSchemaValidation && schema) {
      const { error } = schema.validate(inputData, { abortEarly: false });
      if (error) {
        throw new Error(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
      }
    }
  }

  async fetchCampaignData(params = {}) {
    return this.handleEntityOperation(this.campaignController, this.campaignController.getCampaign, params);
  }

  async getCampaign(req) {
    return this.fetchCampaignData(req);
  }

  async getAllCampaigns() {
    return this.fetchCampaignData({ query: {} });
  }

  async createCampaign(campaignCreateBody) {
    this.validateInput(campaignCreateBody, campaignCreateBodySchema);
    return this.handleEntityOperation(
      this.campaignController,
      this.campaignController.createCampaign,
      campaignCreateBody,
    );
  }

  async createCampaigns(campaignCreateBodies) {
    if (!Array.isArray(campaignCreateBodies) || campaignCreateBodies.length === 0) {
      throw new Error('Invalid input: campaignCreateBodies must be a non-empty array.');
    }

    try {
      return await Promise.all(
        campaignCreateBodies.map((campaignCreateBody) => {
          console.log('campaignCreateBody: ', campaignCreateBody);
          return this.createCampaign(campaignCreateBody);
        }),
      );
    } catch (error) {
      this.handleError('Error creating campaigns', error);
    }
  }

  async updateCampaign(updateCampaignBody) {
    return this.handleEntityOperation(
      this.campaignController,
      this.campaignController.updateCampaign,
      updateCampaignBody,
    );
  }

  async updateCampaigns(updateCampaignBodies) {
    if (!Array.isArray(updateCampaignBodies) || updateCampaignBodies.length === 0) {
      throw new Error('Invalid input: updateCampaignBodies must be a non-empty array.');
    }

    try {
      return await Promise.all(
        updateCampaignBodies.map((updateCampaignBody) => {
          console.log('updateCampaignBody: ', updateCampaignBody);
          return this.updateCampaign(updateCampaignBody);
        }),
      );
    } catch (error) {
      this.handleError('Error updating campaigns', error);
    }
  }

  async patchCampaign(campaigns) {
    return this.handleEntityOperation(this.campaignController, this.campaignController.patchCampaign, campaigns);
  }

  // AdGroup Operations
  async getAdGroup(req) {
    return this.handleEntityOperation(this.adGroupController, this.adGroupController.getAdGroup, req);
  }

  async createAdGroup(adGroupCreateBody) {
    this.validateInput(adGroupCreateBody, adGroupCreateBodySchema);
    console.log('adGroupCreateBody: ', adGroupCreateBody);
    return this.handleEntityOperation(
      this.adGroupController,
      this.adGroupController.createAdGroup,
      adGroupCreateBody,
      adGroupCreateBodySchema,
    );
  }

  async createAdGroups(req) {
    if (!Array.isArray(req.adGroupData) || req.adGroupData.length === 0) {
      throw new Error('Invalid input: adGroupCreateBodies must be a non-empty array');
    }

    try {
      return await Promise.all(
        req.adGroupData.map((adGroupCreateBody) => {
          adGroupCreateBody.campaign_id = req.campaignId;
          return this.createAdGroup(adGroupCreateBody);
        }),
      );
    } catch (error) {
      return this.handleError('Error creating ad groups', error);
    }
  }

  async updateAdGroup(adGroupUpdateBody) {
    return this.handleEntityOperation(this.adGroupController, this.adGroupController.updateAdGroup, adGroupUpdateBody);
  }

  async updateAdGroups(updateAdGroupsPayload) {
    if (!Array.isArray(updateAdGroupsPayload) || updateAdGroupsPayload.length === 0) {
      throw new Error('Invalid input: adGroupCreateBodies must be a non-empty array');
    }

    try {
      return await Promise.all(updateAdGroupsPayload.map((adGroupUpdateBody) => this.updateAdGroup(adGroupUpdateBody)));
    } catch (error) {
      return this.handleError('Error updating ad groups', error);
    }
  }

  async patchAdGroup(req) {
    return this.handleEntityOperation(this.adGroupController, this.adGroupController.patchAdGroup, req);
  }

  // Ad Operations
  async createAd(adCreateBody) {
    this.validateInput(adCreateBody, adCreateBodySchema);

    return this.handleEntityOperation(this.adController, this.adController.createAd, adCreateBody);
  }

  async createAds(req) {
    if (!Array.isArray(req.adData) || req.adData.length === 0) {
      throw new Error('Invalid input: adCreateBodies must be a non-empty array');
    }

    try {
      return await Promise.all(
        req.adData.map((adCreateBody) => {
          adCreateBody.adgroup_id = req.adGroupId;
          return this.createAd(adCreateBody);
        }),
      );
    } catch (error) {
      this.handleError('Error creating ads', error);
    }
  }

  async updateAd(adUpdateBody) {
    return this.handleEntityOperation(this.adController, this.adController.updateAd, adUpdateBody);
  }

  async updateAds(updateAdsPayload) {
    if (!Array.isArray(updateAdsPayload) || updateAdsPayload.length === 0) {
      throw new Error('Invalid input: updateAdsPayload must be a non-empty array');
    }

    try {
      return await Promise.all(updateAdsPayload.map((adUpdateBody) => this.updateAd(adUpdateBody)));
    } catch (error) {
      this.handleError('Error updating ads', error);
    }
  }

  async patchAd(req) {
    return this.handleEntityOperation(this.adController, this.adController.patchAd, req);
  }

  async handleEntityOperation(controller, method, inputData, validationSchema = null) {
    this.validateInput(inputData, validationSchema);
    try {
      return await this.wrapCallbackWithPromise(method.bind(controller), inputData);
    } catch (error) {
      this.handleError('Error performing operation', error);
    }
  }

  // Image creation
  async createImage(filePath) {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      const imageCreateBody = {
        advertiser_id: this.advertiserId,
        file_name: path.basename(filePath),
        image_file: fileBuffer,
        image_signature: computeSHA256(fileBuffer),
      };
      return await this.handleEntityOperation(this.fileController, this.fileController.createImage, imageCreateBody);
    } catch (err) {
      this.handleError('Error reading the file.', err);
    }
  }

  // Get Image Info
  async getImageInfo(imageIds) {
    return await this.handleEntityOperation(this.fileController, this.fileController.getImageInfo, imageIds);
  }

  // Video creation
  async createVideo(filePath) {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      const createVideoRequest = {
        advertiser_id: this.advertiserId,
        video_file: fileBuffer,
        video_signature: computeSHA256(fileBuffer),
      };
      return await this.handleEntityOperation(this.fileController, this.fileController.createVideo, createVideoRequest);
    } catch (err) {
      this.handleError('Error reading the video file.', err);
    }
  }

  // Get Video Info
  async getVideoInfo(videoIds) {
    return await this.handleEntityOperation(this.fileController, this.fileController.getVideoInfo, videoIds);
  }

  // Creatives - Create Asset
  async createPortfolio(portfolioCreateBody) {
    return await this.handleEntityOperation(
      this.creativeAssetsController,
      this.creativeAssetsController.createPortfolio,
      portfolioCreateBody,
    );
  }

  // Get ad preview
  async getAdPreview(creativeId, creativeInfo) {
    if (!this.advertiserId) {
      throw new Error('Advertiser ID is not configured.');
    }

    if (creativeId && Object.keys(creativeInfo).length > 0) {
      throw new Error('Cannot provide both creativeId and creativeInfo.  Choose one preview type.');
    }

    if (!creativeId && !Object.keys(creativeInfo).length) {
      throw new Error('Either creativeId or creativeInfo must be provided.');
    }

    try {
      return await this.adsPreviewController.generateAdPreview(this.advertiserId, creativeId, creativeInfo);
    } catch (error) {
      const previewType = creativeId ? `existing ad ${creativeId}` : 'pre-creation creative';
      this.handleError(`Error in previewing ${previewType}`, error); // Log the error
      throw error; // Re-throw for the caller to handle
    }
  }

  async getTargetingOptions(opts) {
    return this.handleEntityOperation(this.targetingsController, this.targetingsController.getTargetingOptions, opts);
  }

  async createSavedAudience(opts) {
    try {
      return this.audienceController.createSavedAudience(opts);
    } catch (error) {
      return this.handleError('Error creating saved audience', error);
    }
  }

  async getSavedAudienceList(opts) {
    try {
      return this.audienceController.getSavedAudienceList(opts);
    } catch (error) {
      return this.handleError('Error fetching saved audience list', error);
    }
  }

  async deleteSavedAudience(opts) {
    try {
      return this.audienceController.deleteSavedAudience(opts);
    } catch (error) {
      return this.handleError('Error deleting saved audience', error);
    }
  }

  async getReachMetrics(opts) {
    try {
      return this.metricsController.getReachMetrics(opts);
    } catch (error) {
      return this.handleError('Error fetching reach metrics', error);
    }
  }

  static map(request) {
    return TikTokRequestMapper.map(request);
  }
}
