/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import {
  getNewAccessToken as _getNewAccessToken,
  refreshAccessToken as _refreshAccessToken,
} from '../services/authServices.js';

const LOG_TAG = 'controller.snapchat.auth';

class AuthController {
  constructor(adapterSettings) {
    this.clientId = adapterSettings.clientId;
    this.clientSecret = adapterSettings.clientSecret;
    this.accessToken = adapterSettings.accessToken;
    this.refreshToken = adapterSettings.refreshToken;
    this.tokenUrl = adapterSettings.tokenUrl;
    this.authorizationCode = adapterSettings.authorizationCode;
    this.redirectUri = adapterSettings.redirectUri;
    this.authCodeUrl = adapterSettings.authCodeUrl;
    this.adAccountId = adapterSettings.adAccountId;
  }

  async getNewAccessToken() {
    const logMessage = `${LOG_TAG}.getNewAccessToken`;
    console.log(logMessage);
    const params = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      refreshToken: this.refreshToken,
      tokenUrl: this.tokenUrl,
    };
    return _getNewAccessToken(params);
  }

  async refreshAccessToken() {
    const logMessage = `${LOG_TAG}.refreshAccessToken`;
    console.log(logMessage);
    const params = {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      refreshToken: this.refreshToken,
      tokenUrl: this.tokenUrl,
    };
    return _refreshAccessToken(params);
  }
}

export default AuthController;
