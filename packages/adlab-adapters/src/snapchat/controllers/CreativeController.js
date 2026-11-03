/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import CreativeServices from '../services/creativeServices.js';
import { createError } from '../utils/errorHandler.js';

const LOG_TAG = 'controller.snapchat.creative';

class CreativeController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.CreativeServices = CreativeServices;
  }

  /**
   * Retrieves all creatives.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */
  async getAllCreatives() {
    const adAccountId = this.adAccountId;
    if (!this.adAccountId) {
      throw createError({
        statusCode: 400,
        message: 'Ad account ID is required',
      });
    }
    const logMessage = `${LOG_TAG}.getAllCreatives for adAccount ${adAccountId}`;
    console.log(logMessage);
    return this.CreativeServices.getAllCreatives({ adAccountId });
  }

  /**
   * Retrieves a creative by its ID.
   * @param {string} creativeId - The ID of the creative.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   */
  async getCreative(creativeId) {
    const logMessage = `${LOG_TAG}.getCreative for creative ${creativeId}`;
    console.log(logMessage);
    return this.CreativeServices.getCreative({ creativeId });
  }

  /**
   * Creates a creative
   * @param creativesData
   * @returns {Promise<Object>}
   */
  async createCreatives(creativesData) {
    const adAccountId = this.adAccountId;
    const logMessage = `${LOG_TAG}.createCreatives for adAccount ${adAccountId}`;
    console.log(logMessage);
    const params = {
      adAccountId,
      creativesData,
    };
    return this.CreativeServices.creativeCreatives(params);
  }

  async getCreativePreview(creativeId) {
    const logMessage = `${LOG_TAG}.creativePreview for creative ${creativeId}`;
    console.log(logMessage);

    return this.CreativeServices.getCreativePreview({ creativeId });
  }
}

export default CreativeController;
