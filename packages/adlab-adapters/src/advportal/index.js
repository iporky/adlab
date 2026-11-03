'use strict';

import AdPlatformAdapter from '../AdPlatformAdapter.js';
import MediaController from './controllers/MediaController.js';

class AdvportalAdapter extends AdPlatformAdapter {
  constructor(adapterSettings) {
    super();
    this.apiBaseUrl = adapterSettings.apiBaseUrl;
    this.accessToken = adapterSettings.accessToken;
    this.isAccessTokenRefreshed = false;

    this.mediaController = new MediaController({
      apiBaseUrl: this.apiBaseUrl,
      accessToken: this.accessToken,
    });
  }

  /**
   * Returns all folders
   */
  async getFolders() {
    return this.mediaController.getFolders();
  }

  /**
   * Returns all media (image + video) from the given folder
   * Expects: { folderId }
   */
  async getFiles({ folderId, mediaType }) {
    if (!folderId) {
      throw new Error('Missing required parameter: folderId');
    }
    return this.mediaController.getFiles(folderId, mediaType);
  }

}

export default AdvportalAdapter;
