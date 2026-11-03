'use strict';

export class FileController {
  constructor(fileApi, advertiserId, accessToken) {
    this.fileApi = fileApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => {
      return callback(error, response.body);
    };
  }

  getImageInfo(imageIds, callback) {
    this.fileApi.adImageInfo(this.advertiserId, imageIds.split(','), this.accessToken, this.handleResponse(callback));
  }

  createImage(adImageUploadRequest, callback) {
    this.fileApi.adImageUpload(this.accessToken, adImageUploadRequest, this.handleResponse(callback));
  }

  getVideoInfo(videoIds, callback) {
    this.fileApi.adVideoInfo(this.advertiserId, videoIds.split(','), this.accessToken, this.handleResponse(callback));
  }

  createVideo(adVideoUploadRequest, callback) {
    this.fileApi.adVideoUpload(this.accessToken, adVideoUploadRequest, this.handleResponse(callback));
  }
}
