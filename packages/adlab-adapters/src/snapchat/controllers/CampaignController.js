/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import CampaignService from '../services/campaignServices.js';
import { createError } from '../utils/errorHandler.js';

const LOG_TAG = 'controller.snapchat.campaign';

class CampaignController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.campaignService = CampaignService;
  }

  /**
   * Retrieves all campaigns for a given ad account.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async getAllCampaigns() {
    const logMessage = `${LOG_TAG}.getAllCampaigns`;
    console.log(logMessage);
    if (!this.adAccountId) {
      throw createError({
        statusCode: 400,
        message: 'Ad account ID is required',
      });
    }
    const params = {
      adAccountId: this.adAccountId,
    };
    return await this.campaignService.getAllCampaigns(params);
  }

  /**
   * Retrieves a specific campaign by its ID.
   * @param {string} campaignId - The ID of the campaign.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async getCampaign(campaignId) {
    const logMessage = `${LOG_TAG}.getCampaign`;
    console.log(logMessage);
    const params = {
      campaignId,
    };
    return await this.campaignService.getCampaign(params);
  }

  /**
   * Creates new campaigns for a given ad account.
   * @param {Array<Object>} campaignData - An array of campaign data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign data is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async createCampaigns(campaignData) {
    const logMessage = `${LOG_TAG}.createCampaigns`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      campaignData,
    };
    return await this.campaignService.createCampaigns(params);
  }

  /**
   * Updates existing campaigns for a given ad account.
   * @param {Array<Object>} campaignData - An array of campaign data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign data is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async updateCampaigns(campaignData) {
    const logMessage = `${LOG_TAG}.updateCampaigns`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      campaignData,
    };
    return await this.campaignService.updateCampaigns(params);
  }

  /**
   * Deletes a specific campaign by its ID.
   * @param {string} campaignId - The ID of the campaign.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async deleteCampaign(campaignId) {
    const logMessage = `${LOG_TAG}.deleteCampaign`;
    console.log(logMessage);
    const params = {
      campaignId,
    };
    return await this.campaignService.deleteCampaign(params);
  }
}

export default CampaignController;
