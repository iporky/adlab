'use strict';

export class AdController {
  constructor(adApi, advertiserId, accessToken) {
    this.adApi = adApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => callback(error, response?.body);
  }

  getAd(opts, callback) {
    this.adApi.adGet(
      this.advertiserId,
      this.accessToken,
      this.mapRequestParamsToGetAdRequestBody(opts),
      this.handleResponse(callback),
    );
  }

  createAd(adCreateBody, callback) {
    console.log('adCreateBody: ', adCreateBody);
    this.adApi.adCreate(
      this.accessToken,
      {
        body: {
          ...adCreateBody,
          advertiser_id: this.advertiserId,
        },
      },
      this.handleResponse(callback),
    );
  }

  updateAd(adUpdateBody, callback) {
    console.log('adUpdateBody: ', adUpdateBody);
    this.adApi.adUpdate(
      this.accessToken,
      {
        body: {
          ...adUpdateBody,
          advertiser_id: this.advertiserId,
        },
      },
      this.handleResponse(callback),
    );
  }

  patchAd(adStatusUpdateBody, callback) {
    console.log('adStatusUpdateBody: ', adStatusUpdateBody);
    this.adApi.adStatusUpdate(
      this.accessToken,
      {
        body: {
          ad_ids: adStatusUpdateBody.map((ad) => ad.ad_id),
          operation_status: adStatusUpdateBody[0].operation_status,
          advertiser_id: this.advertiserId,
        },
      },
      this.handleResponse(callback),
    );
  }

  mapRequestParamsToGetAdRequestBody(req) {
    const getAdRequestBody = {
      filtering: {},
    };
    if (req.query.ad_ids) getAdRequestBody.filtering.ad_ids = req.query.ad_ids.split(',');
    if (req.query.adgroup_ids) getAdRequestBody.filtering.adgroup_ids = req.query.adgroup_ids.split(',');
    if (req.query.creation_filter_start_time)
      getAdRequestBody.filtering.creation_filter_start_time = req.query.creation_filter_start_time;
    if (req.query.creation_filter_end_time)
      getAdRequestBody.filtering.creation_filter_end_time = req.query.creation_filter_end_time;
    if (req.query.objective_type) getAdRequestBody.filtering.objective_type = req.query.objective_type;
    if (req.query.primary_status) getAdRequestBody.filtering.primary_status = req.query.primary_status;
    if (req.query.secondary_status) getAdRequestBody.filtering.secondary_status = req.query.secondary_status;
    if (req.query.targeting_broaden_required)
      getAdRequestBody.filtering.targeting_broaden_required = req.query.targeting_broaden_required;
    if (req.query.page) getAdRequestBody.page = req.query.page;
    if (req.query.page_size) getAdRequestBody.page_size = req.query.page_size;
    if (req.query.fields) getAdRequestBody.fields = req.query.fields.split(',');
    return getAdRequestBody;
  }
}
