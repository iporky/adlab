'use strict';

export class IdentityController {
  constructor(identityApi, advertiserId, accessToken) {
    this.identityApi = identityApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => {
      return callback(error, response.body);
    };
  }

  getImageInfo(opts, callback) {
    this.identityApi.identityGet(this.advertiserId, this.accessToken, opts, this.handleResponse(callback));
  }

  createIdentity(opts, callback) {
    this.identityApi.identityCreate(this.accessToken, opts, this.handleResponse(callback));
  }

  getVideoInfo(opts, callback) {
    this.identityApi.identityVideoInfo(
      this.accessToken,
      this.advertiserId,
      opts.identity_type,
      opts.identity_id,
      opts.item_id,
      opts,
      this.handleResponse(callback),
    );
  }
}
