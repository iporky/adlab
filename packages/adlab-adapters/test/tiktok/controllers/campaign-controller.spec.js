import { jest } from '@jest/globals';
import { CampaignController } from '../../../src/controllers/CampaignController.js';

describe('CampaignController', () => {
  let campaignCreationApiMock;
  let campaignController;
  const advertiserId = 'test-advertiser-id';
  const accessToken = 'test-access-token';

  const campaign = {
    campaign_name: 'test_v1.3',
    create_time: '2024-09-17 06:21:13',
    budget: 5000.0,
    deep_bid_type: null,
    objective: 'LANDING_PAGE',
    objective_type: 'TRAFFIC',
    is_advanced_dedicated_campaign: false,
    roas_bid: 0.0,
    rta_id: null,
    rta_product_selection_enabled: false,
    budget_mode: 'BUDGET_MODE_TOTAL',
    campaign_id: '1810423148616721',
    campaign_type: 'REGULAR_CAMPAIGN',
    operation_status: 'ENABLE',
    modify_time: '2024-09-17 06:21:13',
    is_smart_performance_campaign: false,
    is_new_structure: true,
    is_search_campaign: false,
    advertiser_id: advertiserId,
  };

  beforeEach(() => {
    campaignCreationApiMock = {
      campaignGet: jest.fn(),
      campaignCreate: jest.fn(),
      campaignUpdate: jest.fn(),
      campaignDelete: jest.fn(),
      campaignStatusUpdate: jest.fn(),
    };
    campaignController = new CampaignController(campaignCreationApiMock, advertiserId, accessToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCampaign', () => {
    it('should call the campaignGet method and return data on success', (done) => {
      const getCampaignRequest = {
        query: {
          campaign_ids: '1810423148616721,1810423148616722,1810423148616723',
          creation_filter_start_time: '2024-09-13 03:20:15',
          creation_filter_end_time: '2024-09-15 03:20:15',
          objective_type: 'APP_PROMOTION',
          primary_status: 'STATUS_DELIVERY_OK',
          secondary_status: 'ADGROUP_STATUS_ALL',
          targeting_broaden_required: true,
          page: 10,
          page_size: 56,
        },
      };
      const expectedGetCampaignRequest = {
        filtering: {
          campaign_ids: ['1810423148616721', '1810423148616722', '1810423148616723'],
          creation_filter_start_time: '2024-09-13 03:20:15',
          creation_filter_end_time: '2024-09-15 03:20:15',
          objective_type: 'APP_PROMOTION',
          primary_status: 'STATUS_DELIVERY_OK',
          secondary_status: 'ADGROUP_STATUS_ALL',
          targeting_broaden_required: true,
        },
        page: 10,
        page_size: 56,
      };
      const getCampaignResponse = {
        code: 0,
        message: 'OK',
        request_id: '202409170622007087ED6F1B27D6759FDA',
        data: {
          list: [campaign],
          page_info: {
            page: 1,
            page_size: 10,
            total_page: 1,
            total_number: 1,
          },
        },
      };
      campaignCreationApiMock.campaignGet.mockImplementation(
        (advertiserId, accessToken, expectedGetCampaignRequest, callback) => {
          callback(null, getCampaignResponse, {});
        },
      );

      campaignController.getCampaign(getCampaignRequest, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(getCampaignResponse);
        expect(result.data.list[0]).toEqual(campaign);
        expect(campaignCreationApiMock.campaignGet).toHaveBeenCalledWith(
          advertiserId,
          accessToken,
          expectedGetCampaignRequest,
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if campaignGet fails', (done) => {
      const getCampaignRequest = {
        query: {
          campaign_ids: 'unknown-campaign-id',
          creation_filter_end_time: '2024-09-15 03:20:15',
          creation_filter_start_time: '2024-09-13 03:20:15',
          objective_type: 'APP_PROMOTION',
          primary_status: 'STATUS_DELIVERY_OK',
          secondary_status: 'ADGROUP_STATUS_ALL',
          targeting_broaden_required: true,
          page: 10,
          page_size: 56,
        },
      };
      const expectedGetCampaignRequest = {
        filtering: {
          campaign_ids: ['unknown-campaign-id'],
          creation_filter_end_time: '2024-09-15 03:20:15',
          creation_filter_start_time: '2024-09-13 03:20:15',
          objective_type: 'APP_PROMOTION',
          primary_status: 'STATUS_DELIVERY_OK',
          secondary_status: 'ADGROUP_STATUS_ALL',
          targeting_broaden_required: true,
        },
        page: 10,
        page_size: 56,
      };
      const error = new Error(
        'Error: request_id:20240918053615A0C43D15881386D60ABB message: filtering.campaign_ids.0: unknown-campaign-id is not a valid integer string. code: 40002',
      );

      campaignCreationApiMock.campaignGet.mockImplementation(
        (advertiserId, accessToken, expectedGetCampaignRequest, callback) => {
          callback(error, null, {});
        },
      );

      campaignController.getCampaign(getCampaignRequest, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(campaignCreationApiMock.campaignGet).toHaveBeenCalledWith(
          advertiserId,
          accessToken,
          expectedGetCampaignRequest,
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('createCampaign', () => {
    const campaignCreateBody = {
      advertiser_id: advertiserId,
      budget_mode: 'BUDGET_MODE_TOTAL',
      objective_type: 'TRAFFIC',
      campaign_name: 'test_v1.3',
      budget: 5000,
      optimization_goal: 'CLICK',
    };
    it('should call the campaignCreate method and return data on success', (done) => {
      const createdCampaign = {
        campaign_name: 'test_v1.3',
        create_time: '2024-09-17 06:21:13',
        budget: 5000.0,
        deep_bid_type: null,
        objective: 'LANDING_PAGE',
        objective_type: 'TRAFFIC',
        is_advanced_dedicated_campaign: false,
        roas_bid: 0.0,
        rta_id: null,
        rta_product_selection_enabled: false,
        budget_mode: 'BUDGET_MODE_TOTAL',
        campaign_id: '1810423148616721',
        campaign_type: 'REGULAR_CAMPAIGN',
        operation_status: 'ENABLE',
        modify_time: '2024-09-17 06:21:13',
        is_smart_performance_campaign: false,
        is_new_structure: true,
        is_search_campaign: false,
        advertiser_id: advertiserId,
      };
      const campaignCreateResponse = {
        code: 0,
        message: 'OK',
        request_id: '202409170621112655721B2B35BD73BE8A',
        data: createdCampaign,
      };

      campaignCreationApiMock.campaignCreate.mockImplementation((accessToken, campaignCreateBody, callback) => {
        callback(null, campaignCreateResponse, {});
      });

      campaignController.createCampaign(campaignCreateBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(campaignCreateResponse);
        expect(campaignCreationApiMock.campaignCreate).toHaveBeenCalledWith(
          accessToken,
          { body: campaignCreateBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if campaignCreate fails', (done) => {
      const error = new Error(
        'Error: request_id:202409180514043FD12A75400F25CDE6A8 message: Campaign name already exists. Please try another one. code: 40002',
      );

      campaignCreationApiMock.campaignCreate.mockImplementation((accessToken, campaignCreateBody, callback) => {
        callback(error, null, {});
      });

      campaignController.createCampaign(campaignCreateBody, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(campaignCreationApiMock.campaignCreate).toHaveBeenCalledWith(
          accessToken,
          { body: campaignCreateBody },
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('patchCampaign', () => {
    const campaignStatusUpdateBody = {
      advertiser_id: advertiserId,
      campaign_ids: ['1810423148616721', '1810423148616722', '1810423148616723'],
      operation_status: 'ENABLE',
    };
    const campaignStatusUpdateResponse = {
      data: {
        campaign_ids: ['1810423148616721', '1810508809534481', '1810508892391457'],
        campaign_list: [],
        status: 'DISABLE',
      },
      request_id: '20240918065322FC1DB3BB01565C000F41',
    };
    it('should call the campaignStatusUpdate method and return data on success', (done) => {
      campaignCreationApiMock.campaignStatusUpdate.mockImplementation(
        (accessToken, campaignStatusUpdateBody, callback) => {
          callback(null, campaignStatusUpdateResponse, {});
        },
      );

      campaignController.patchCampaign(campaignStatusUpdateBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(campaignStatusUpdateResponse);
        expect(campaignCreationApiMock.campaignStatusUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: campaignStatusUpdateBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if campaignStatusUpdate fails', (done) => {
      const campaignStatusUpdateBodyNeg = {
        advertiser_id: advertiserId,
        campaign_ids: ['123456789'],
        operation_status: 'DISABLE',
      };
      const updateCampaignStatusResponse = {
        data: { campaign_ids: [], campaign_list: [], status: 'DISABLE' },
        request_id: '202409180628309DF7909DCAB6F9016085',
      };

      campaignCreationApiMock.campaignStatusUpdate.mockImplementation(
        (accessToken, campaignStatusUpdateBodyNeg, callback) => {
          callback(null, updateCampaignStatusResponse, {});
        },
      );

      campaignController.patchCampaign(campaignStatusUpdateBodyNeg, (err, result) => {
        expect(err).toEqual(null);
        expect(result).toEqual(updateCampaignStatusResponse);
        expect(campaignCreationApiMock.campaignStatusUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: campaignStatusUpdateBodyNeg },
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('updateCampaigns', () => {
    it('should call the campaignUpdate method and return data on success', (done) => {
      const updateCampaignBody = {
        advertiser_id: advertiserId,
        budget: 100000,
        budget_mode: 'BUDGET_MODE_TOTAL',
        campaign_id: '1810514858031122',
        roas_bid: 500,
      };

      const updateCampaignResponse = {
        data: {
          rta_product_selection_enabled: false,
          modify_time: '2024-09-18 06:44:19',
          deep_bid_type: null,
          budget_mode: 'BUDGET_MODE_TOTAL',
          budget: 100000,
          campaign_name: 'target-test-campaign3',
          objective: 'LANDING_PAGE',
          advertiser_id: '7412972596997832705',
          is_search_campaign: false,
          special_industries: [],
          is_advanced_dedicated_campaign: false,
          create_time: '2024-09-18 06:38:41',
          objective_type: 'TRAFFIC',
          roas_bid: 0,
          campaign_id: '1810514858031122',
          is_smart_performance_campaign: false,
          campaign_type: 'REGULAR_CAMPAIGN',
          is_new_structure: true,
          operation_status: 'ENABLE',
          rta_id: null,
        },
        request_id: '202409180644178FEACDF008F943D8315D',
      };
      campaignCreationApiMock.campaignUpdate.mockImplementation((accessToken, updateCampaignBody, callback) => {
        callback(null, updateCampaignResponse, {});
      });

      campaignController.updateCampaign(updateCampaignBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(updateCampaignResponse);
        expect(campaignCreationApiMock.campaignUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: updateCampaignBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if campaignUpdate fails', (done) => {
      const updateCampaignBodyNegative = {
        advertiser_id: advertiserId,
        budget: 100000,
        budget_mode: 'BUDGET_MODE_TOTAL',
        campaign_id: '1810514858031122345',
        roas_bid: 500,
      };

      const error = new Error(
        'Error: request_id:20240918064812E92E97E9A28E8E02C734 message: The campaign 1810514858031122345 does not exist. code: 40007',
      );

      campaignCreationApiMock.campaignUpdate.mockImplementation((accessToken, updateCampaignBodyNegative, callback) => {
        callback(error, null, {});
      });

      campaignController.updateCampaign(updateCampaignBodyNegative, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(campaignCreationApiMock.campaignUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: updateCampaignBodyNegative },
          expect.any(Function),
        );
        done();
      });
    });
  });
});
