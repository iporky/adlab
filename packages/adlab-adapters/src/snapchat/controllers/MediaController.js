/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import * as MediaServices from '../services/mediaServices.js';
import { createError } from '../utils/errorHandler.js';

const LOG_TAG = 'controller.snapchat.media';

class MediaController {
  constructor({ adAccountId }) {
    this.adAccountId = adAccountId;
    this.mediaServices = MediaServices;
  }

  /**
   * Retrieves all media.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the ad account ID is invalid.
   */
  async getAllMedia() {
    const adAccountId = this.adAccountId;
    if (!this.adAccountId) {
      throw createError({
        statusCode: 400,
        message: 'Ad account ID is required',
      });
    }
    const logMessage = `${LOG_TAG}.getAllMedia for adAccount ${adAccountId}`;
    console.log(logMessage);
    return this.mediaServices.getAllMedia({ adAccountId });
  }

  /**
   * Retrieves a media preview.
   * @param {string} mediaId - The ID of the media.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   */
  async getMediaPreview(mediaId) {
    const logMessage = `${LOG_TAG}.getMediaPreview for media ${mediaId}`;
    console.log(logMessage);
    return this.mediaServices.getMediaPreview({ mediaId });
  }

  /**
   * Retrieves a media thumbnail.
   * @param {string} mediaId - The ID of the media.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   */
  async getMediaThumbnail(mediaId) {
    const logMessage = `${LOG_TAG}.getMediaThumbnail for media ${mediaId}`;
    console.log(logMessage);
    return this.mediaServices.getMediaThumbnail({ mediaId });
  }

  /**
   * Retrieves a media by its ID.
   * @param {string} mediaId - The ID of the media.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   */
  async getMedia(mediaId) {
    const logMessage = `${LOG_TAG}.getMedia for media ${mediaId}`;
    console.log(logMessage);
    return this.mediaServices.getMedia({ mediaId });
  }

  /**
   * Creates new media.
   * @param {Array<Object>} mediaData - An array of media data objects.
   * @returns {Promise<Object>} - A promise that resolves to the response from the API.
   * @throws {ErrorHandler} - Throws an error if the media data is invalid.
   */
  async createMedia(mediaData) {
    const logMessage = `${LOG_TAG}.createMedia`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      mediaData,
    };
    return this.mediaServices.createMedia(params);
  }

  async uploadMedia(mediaData) {
    const logMessage = `${LOG_TAG}.uploadMedia for adAccount ${this.adAccountId} and mediaId ${mediaData.mediaId}`;
    console.log(logMessage);
    return this.mediaServices.uploadMedia(mediaData);
  }

  async createMediaAndUpload(mediaData) {
    const logMessage = `${LOG_TAG}.createMediaAndUpload for adAccount ${this.adAccountId}`;
    console.log(logMessage);
    const params = {
      adAccountId: this.adAccountId,
      mediaData,
    };
    return this.mediaServices.createMediaAndUpload(params);
  }
}

export default MediaController;
