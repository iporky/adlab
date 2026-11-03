/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import AdGroupService from '../services/adGroupServices.js';

const LOG_TAG = 'controller.snapchat.adgroup';

class AdGroupController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.adGroupService = AdGroupService;
  }

  /**
   * Retrieves all ad groups for a given campaign.
   * @param {string} campaignId - The ID of the campaign.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async getAllAdGroups(campaignId) {
    const logMessage = `${LOG_TAG}.getAllAdGroups for campaign ${campaignId}`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      campaignId,
    };
    return this.adGroupService.getAllAdGroups(params);
  }

  /**
   * Retrieves all ad groups under an ad account.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */
  async getAllAdGroupsUnderAdAccount() {
    const adAccountId = this.adAccountId;
    const logMessage = `${LOG_TAG}.getAllAdGroupsUnderAdAccount for adAccount ID ${adAccountId}`;
    console.log(logMessage);
    const params = {
      adAccountId,
    };
    return this.adGroupService.getAllAdGroupsUnderAdAccount(params);
  }

  /**
   * Retrieves a specific ad group by its ID.
   * @param {string} adGroupId - The ID of the ad group.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad group ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async getAdGroup(adGroupId) {
    const logMessage = `${LOG_TAG}.getAdGroup for ad group ${adGroupId}`;
    console.log(logMessage);
    return this.adGroupService.getAdGroup(adGroupId);
  }

  /**
   * Creates new ad groups for a given campaign.
   * @param {string} campaignId - The ID of the campaign.
   * @param {Array<Object>} adGroupData - An array of ad group data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad group data is invalid.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async createAdGroups({ campaignId, adGroupData }) {
    const logMessage = `${LOG_TAG}.createAdGroups for campaign ${campaignId}`;
    console.log(logMessage);
    const params = {
      campaignId,
      adGroupData,
    };
    return this.adGroupService.createAdGroups(params);
  }

  /**
   * Updates existing ad groups for a given campaign.
   * @param {string} campaignId - The ID of the campaign.
   * @param {Array<Object>} adGroupData - An array of ad group data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad group data is invalid.
   * @throws {ErrorHandler} - Throws an error if the campaign ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async updateAdGroups({ campaignId, adGroupData }) {
    const logMessage = `${LOG_TAG}.updateAdGroups for campaign ${campaignId}`;
    console.log(logMessage);
    const params = {
      campaignId,
      adGroupData,
    };
    return this.adGroupService.updateAdGroups(params);
  }

  /**
   * Deletes a specific ad group by its ID.
   * @param {string} adGroupId - The ID of the ad group.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad group ID is invalid.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */

  async deleteAdGroup(adGroupId) {
    const logMessage = `${LOG_TAG}.deleteAdGroup ${adGroupId}`;
    console.log(logMessage);
    return this.adGroupService.deleteAdGroup({ adGroupId });
  }
}

export default AdGroupController;
