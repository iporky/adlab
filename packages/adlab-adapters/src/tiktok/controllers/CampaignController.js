'use strict';

export class CampaignController {
  constructor(campaignCreationApi, advertiserId, accessToken) {
    this.campaignCreationApi = campaignCreationApi;
    this.advertiserId = advertiserId;
    this.accessToken = accessToken;
  }

  handleResponse(callback) {
    return (error, data, response) => {
      console.log('handleResponse', { error, data, response });
      callback(error, response?.body);
    };
  }

  getCampaign(req, callback) {
    this.campaignCreationApi.campaignGet(
      this.advertiserId,
      this.accessToken,
      this.mapRequestParamsToGetCampaignBody(req),
      this.handleResponse(callback),
    );
  }

  createCampaign(campaignCreateBody, callback) {
    this.campaignCreationApi.campaignCreate(
      this.accessToken,
      {
        body: {
          advertiser_id: this.advertiserId,
          ...campaignCreateBody,
        },
      },
      this.handleResponse(callback),
    );
  }

  updateCampaign(campaignUpdateBody, callback) {
    this.campaignCreationApi.campaignUpdate(
      this.accessToken,
      {
        body: {
          advertiser_id: this.advertiserId,
          ...campaignUpdateBody,
        },
      },
      this.handleResponse(callback),
    );
  }

  patchCampaign(campaigns, callback) {
    this.campaignCreationApi.campaignStatusUpdate(
      this.accessToken,
      {
        body: {
          advertiser_id: this.advertiserId,
          campaign_ids: campaigns.map((camp) => camp.campaign_id),
          operation_status: campaigns[0].operation_status,
        },
      },
      this.handleResponse(callback),
    );
  }

  mapRequestParamsToGetCampaignBody(req) {
    const getCampaignRequestBody = {
      filtering: {},
    };
    if (req.query.campaign_ids) getCampaignRequestBody.filtering.campaign_ids = req.query.campaign_ids.split(',');
    if (req.query.creation_filter_start_time)
      getCampaignRequestBody.filtering.creation_filter_start_time = req.query.creation_filter_start_time;
    if (req.query.creation_filter_end_time)
      getCampaignRequestBody.filtering.creation_filter_end_time = req.query.creation_filter_end_time;
    if (req.query.objective_type) getCampaignRequestBody.filtering.objective_type = req.query.objective_type;
    if (req.query.primary_status) getCampaignRequestBody.filtering.primary_status = req.query.primary_status;
    if (req.query.secondary_status) getCampaignRequestBody.filtering.secondary_status = req.query.secondary_status;
    if (req.query.targeting_broaden_required)
      getCampaignRequestBody.filtering.targeting_broaden_required = req.query.targeting_broaden_required;
    if (req.query.page) getCampaignRequestBody.page = req.query.page;
    if (req.query.page_size) getCampaignRequestBody.page_size = req.query.page_size;
    if (req.query.fields) getCampaignRequestBody.fields = req.query.fields.split(',');
    return getCampaignRequestBody;
  }
}
