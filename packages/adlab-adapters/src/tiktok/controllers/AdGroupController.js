'use strict';

export class AdGroupController {
  constructor(adgroupApi, advertiserId, accessToken) {
    this.adgroupApi = adgroupApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => callback(error, response?.body);
  }

  getAdGroup(req, callback) {
    this.adgroupApi.adgroupGet(
      this.advertiserId,
      this.accessToken,
      this.mapRequestParamsToGetAdGroupBody(req),
      this.handleResponse(callback),
    );
  }

  createAdGroup(adgroupCreateBody, callback) {
    this.adgroupApi.adgroupCreate(
      this.accessToken,
      {
        body: {
          advertiser_id: this.advertiserId,
          ...adgroupCreateBody,
        },
      },
      this.handleResponse(callback),
    );
  }

  updateAdGroup(adgroupUpdateBody, callback) {
    console.log('adgroupUpdateBody: ', adgroupUpdateBody);
    this.adgroupApi.adgroupUpdate(
      this.accessToken,
      {
        body: {
          ...adgroupUpdateBody,
          advertiser_id: this.advertiserId,
        },
      },
      this.handleResponse(callback),
    );
  }

  patchAdGroup(updateAdGroupStatusBody, callback) {
    this.adgroupApi.adgroupStatusUpdate(
      this.accessToken,
      {
        body: {
          adgroup_ids: updateAdGroupStatusBody.map((adgroup) => adgroup.adgroup_id),
          operation_status: updateAdGroupStatusBody[0].operation_status,
          advertiser_id: this.advertiserId,
        },
      },
      this.handleResponse(callback),
    );
  }

  mapRequestParamsToGetAdGroupBody(req) {
    const getAdGroupRequestBody = {
      filtering: {},
    };
    if (req.query.adgroup_ids) getAdGroupRequestBody.filtering.adgroup_ids = req.query.adgroup_ids.split(',');
    if (req.query.adgroup_name) getAdGroupRequestBody.filtering.adgroup_name = req.query.adgroup_name.split(',');
    if (req.query.start_time)
      getAdGroupRequestBody.filtering.creation_filter_start_time = req.query.creation_filter_start_time;
    if (req.query.end_time)
      getAdGroupRequestBody.filtering.creation_filter_end_time = req.query.creation_filter_end_time;
    if (req.query.objective_type) getAdGroupRequestBody.filtering.objective_type = req.query.objective_type;
    if (req.query.primary_status) getAdGroupRequestBody.filtering.primary_status = req.query.primary_status;
    if (req.query.secondary_status) getAdGroupRequestBody.filtering.secondary_status = req.query.secondary_status;
    if (req.query.targeting_broaden_required)
      getAdGroupRequestBody.filtering.targeting_broaden_required = req.query.targeting_broaden_required;
    if (req.query.page) getAdGroupRequestBody.page = req.query.page;
    if (req.query.page_size) getAdGroupRequestBody.page_size = req.query.page_size;
    if (req.query.fields) getAdGroupRequestBody.fields = req.query.fields.split(',');
    return getAdGroupRequestBody;
  }
}
