'use strict';

export class CreativeAssetsController {
  constructor(creativeAssetApi, advertiserId, accessToken) {
    this.creativeAssetApi = creativeAssetApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => {
      return callback(error, response.body);
    };
  }

  createPortfolio(opts, callback) {
    this.creativeAssetApi.creativePortfolioCreate(this.accessToken, opts, this.handleResponse(callback));
  }
}
