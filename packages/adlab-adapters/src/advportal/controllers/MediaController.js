'use strict';

import * as mediaService from '../services/mediaServices.js';

class MediaController {
  constructor({ apiBaseUrl, accessToken }) {
    this.apiBaseUrl = apiBaseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Returns all folders
   */
  async getFolders() {
    return mediaService.getFolders(this.apiBaseUrl, this.accessToken);
  }

  /**
   * Returns media inside a given folder
   */
  async getFiles(folderId, mediaType) {
    return mediaService.getFiles(folderId, mediaType, this.apiBaseUrl, this.accessToken);
  }

}

export default MediaController;
