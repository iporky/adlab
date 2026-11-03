/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import FormData from 'form-data';
import { schemas, utils } from 'adlab-shared';
import { createError } from '../utils/errorHandler.js';
import { mapMediaData } from '../utils/parameterMapper.js';
import RequestHelper from '../helpers/requestHelper.js';

const {
  snapchat: { mediaSchema },
} = schemas;
const { schemaUtils } = utils;
/**
 * Retrieves all media.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getAllMedia({ adAccountId }) {
  const endpoint = `/adaccounts/${adAccountId}/media`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a media preview.
 * @param {string} mediaId - The ID of the media.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getMediaPreview({ mediaId }) {
  const endpoint = `/media/${mediaId}/preview`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a media thumbnail.
 * @param {string} mediaId - The ID of the media.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getMediaThumbnail({ mediaId }) {
  const endpoint = `/media/${mediaId}/thumbnail`;
  return RequestHelper.get(endpoint);
}

/**
 * Retrieves a media by its ID.
 * @param {string} mediaId - The ID of the media.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 */
async function getMedia({ mediaId }) {
  const endpoint = `/media/${mediaId}`;
  return RequestHelper.get(endpoint);
}

/**
 * Creates new media.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.adAccountId - The ID of the ad account.
 * @param {Array<Object>} params.mediaData - An array of media data objects.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the media data is invalid.
 */

async function createMedia({ adAccountId, mediaData }) {
  if (!Array.isArray(mediaData)) {
    throw createError({
      statusCode: 400,
      message: 'mediaData should be an array of media',
    });
  }

  const payload = { media: [] };

  for (const media of mediaData) {
    const reqObj = {
      ...mapMediaData(media),
      ad_account_id: adAccountId,
    };
    const { error } = schemaUtils.validate(reqObj, mediaSchema);
    if (error) {
      throw createError({
        statusCode: 400,
        message: error,
      });
    }

    payload.media.push(reqObj);
  }

  const endpoint = `/adaccounts/${adAccountId}/media`;
  return RequestHelper.post(endpoint, payload);
}

/**
 * Uploads media files.
 * @param {Object} params - The parameters for the request.
 * @param {string} params.mediaId - The ID of the media to upload assets.
 * @param {Array<Object>} params.mediaData - An array of media data objects.
 * @returns {Promise<Object>} - A promise that resolves to the response from the API.
 * @throws {ErrorHandler} - Throws an error if the media data is invalid.
 */

async function uploadMedia({ mediaId, file }) {
  if (!Buffer.isBuffer(file.buffer)) {
    throw createError({ statusCode: 400, message: 'file should be a buffer' });
  }
  const form = new FormData();
  form.append('file', file.buffer, { filename: `${file.name}` });
  const endpoint = `/media/${mediaId}/upload`;
  return RequestHelper.postFormData(endpoint, form);
}

async function createMediaAndUpload({ adAccountId, mediaData }) {
  const createResponse = await createMedia({
    adAccountId,
    mediaData,
  });

  if (createResponse.request_status !== 'SUCCESS') {
    return createResponse;
  }

  const mediaId = createResponse.media[0]?.media.id;

  return uploadMedia({
    mediaId,
    file: mediaData[0].file,
    shouldUploadChunked: mediaData[0].shouldUploadChunked,
  });
}

export { getAllMedia, getMediaPreview, getMediaThumbnail, getMedia, createMedia, uploadMedia, createMediaAndUpload };
