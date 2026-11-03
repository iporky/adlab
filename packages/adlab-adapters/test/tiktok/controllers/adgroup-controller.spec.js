import { jest } from '@jest/globals';
import { AdGroupController } from '../../../src/controllers/AdGroupController.js';

describe('AdGroupController', () => {
  let adgroupApiMock;
  let adGroupController;
  const advertiserId = 'test-advertiser-id';
  const accessToken = 'test-access-token';

  beforeEach(() => {
    adgroupApiMock = {
      adgroupGet: jest.fn(),
      adgroupCreate: jest.fn(),
      adgroupUpdate: jest.fn(),
      adgroupStatusUpdate: jest.fn(),
    };
    adGroupController = new AdGroupController(adgroupApiMock, advertiserId, accessToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const opts = { adgroup_id: 'test-adgroup-id' };
  const response = { adgroup_id: 'test-adgroup-id', name: 'Test AdGroup' };
  const error = new Error('Error occurred');

  describe('handleResponse', () => {
    it('should return the error and null data if an error occurs', (done) => {
      const callback = jest.fn();
      const handleResponse = adGroupController.handleResponse(callback);
      handleResponse(error, null);

      expect(callback).toHaveBeenCalledWith(error, null);
      done();
    });

    it('should return null data without an error when no error occurs', (done) => {
      const callback = jest.fn();
      const handleResponse = adGroupController.handleResponse(callback);
      handleResponse(null, response);

      expect(callback).toHaveBeenCalledWith(null, response);
      done();
    });
  });

  describe('getAdGroup', () => {
    const getAdGroupRequest = {
      query: {
        fields: 'adgroup_id,adgroup_name',
      },
    };
    const expectedGetAdGroupRequest = {
      filtering: {},
      fields: ['adgroup_id', 'adgroup_name'],
    };
    const getAdGroupResponse = {
      data: {
        list: [
          {
            adgroup_id: '1810600008443938',
            adgroup_name: 'name5',
          },
          {
            adgroup_id: '1810599985310738',
            adgroup_name: 'name4',
          },
          {
            adgroup_id: '1810599968411682',
            adgroup_name: 'name3',
          },
          {
            adgroup_id: '1810599924737025',
            adgroup_name: 'name2',
          },
          {
            adgroup_id: '1810528895940722',
            adgroup_name: 'name',
          },
        ],
        page_info: {
          page: 1,
          page_size: 10,
          total_page: 1,
          total_number: 5,
        },
      },
      request_id: '20240919051832285E4687367DD55F8014',
    };

    it('should call adgroupGet with the correct parameters', (done) => {
      adgroupApiMock.adgroupGet.mockImplementation((advertiserId, accessToken, expectedGetAdGroupRequest, callback) =>
        callback(null, getAdGroupResponse),
      );

      adGroupController.getAdGroup(getAdGroupRequest, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(getAdGroupResponse);
        expect(adgroupApiMock.adgroupGet).toHaveBeenCalledWith(
          advertiserId,
          accessToken,
          expectedGetAdGroupRequest,
          expect.any(Function),
        );
        done();
      });
    });

    it('should return empty response if adgroup ids dont match any ', (done) => {
      const getAdGroupRequest = {
        query: {
          adgroup_ids: '123456789,987654321',
          fields: 'adgroup_id,adgroup_name',
        },
      };
      const expectedGetAdGroupRequest = {
        filtering: {
          adgroup_ids: ['123456789', '987654321'],
        },
        fields: ['adgroup_id', 'adgroup_name'],
      };
      const getAdGroupResponse = {
        data: {
          list: [],
          page_info: {
            page: 1,
            page_size: 10,
            total_page: 0,
            total_number: 0,
          },
        },
        request_id: '2024091907015364A35CCC37AE8E682528',
      };
      adgroupApiMock.adgroupGet.mockImplementation((advertiserId, accessToken, expectedGetAdGroupRequest, callback) =>
        callback(null, getAdGroupResponse),
      );

      adGroupController.getAdGroup(getAdGroupRequest, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(getAdGroupResponse);
        expect(adgroupApiMock.adgroupGet).toHaveBeenCalledWith(
          advertiserId,
          accessToken,
          expectedGetAdGroupRequest,
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('createAdGroup', () => {
    const adGroupCreateBody = {
      advertiser_id: advertiserId,
      campaign_id: '1810423148616721',
      adgroup_name: 'name',
      placement_type: 'PLACEMENT_TYPE_NORMAL',
      placements: ['PLACEMENT_TIKTOK'],
      promotion_type: 'WEBSITE',
      identity_type: 'BC_AUTH_TT',
      identity_id: '11',
      identity_authorized_bc_id: '22',
      location_ids: ['6252001'],
      budget: 8000,
      budget_mode: 'BUDGET_MODE_TOTAL',
      schedule_type: 'SCHEDULE_START_END',
      schedule_start_time: '2024-12-12 23:23:23',
      schedule_end_time: '2026-01-01 00:00:00',
      optimization_goal: 'CLICK',
      pacing: 'PACING_MODE_SMOOTH',
      billing_event: 'CPC',
      bid_price: 1,
      comment_disabled: true,
      secondary_optimization_event: 'ACTIVE',
      deep_cpa_bid: 2,
      next_day_retention: 0.2,
      skip_learning_phase: false,
      conversion_bid_price: 1.3,
      video_download_disabled: true,
      search_result_enabled: true,
    };
    const adGroupCreateResponse = {
      data: {
        create_time: '2024-09-18 10:21:53',
        video_download_disabled: true,
        rf_estimated_frequency: null,
        schedule_infos: null,
        budget_mode: 'BUDGET_MODE_TOTAL',
        next_day_retention: null,
        languages: [],
        is_smart_performance_campaign: false,
        keywords: null,
        network_types: [],
        bid_price: 1,
        device_price_ranges: null,
        gender: 'GENDER_UNLIMITED',
        statistic_type: null,
        delivery_mode: null,
        vbo_window: null,
        pacing: 'PACING_MODE_SMOOTH',
        age_groups: null,
        excluded_audience_ids: [],
        frequency_schedule: null,
        actions: [],
        share_disabled: false,
        placements: ['PLACEMENT_TIKTOK'],
        bid_display_mode: 'CPMV',
        deep_bid_type: null,
        scheduled_budget: 0,
        budget: 8000,
        category_id: '0',
        category_exclusion_ids: [],
        campaign_name: 'test_v1.3',
        conversion_bid_price: 0,
        schedule_end_time: '2026-01-01 00:00:00',
        conversion_window: null,
        app_type: null,
        location_ids: ['6252001'],
        search_result_enabled: true,
        ios14_quota_type: 'UNOCCUPIED',
        app_download_url: null,
        inventory_filter_enabled: false,
        comment_disabled: true,
        placement_type: 'PLACEMENT_TYPE_NORMAL',
        feed_type: null,
        optimization_goal: 'CLICK',
        rf_purchased_type: null,
        smart_interest_behavior_enabled: null,
        pixel_id: null,
        smart_audience_enabled: null,
        audience_ids: [],
        deep_cpa_bid: 0,
        frequency: null,
        bid_type: 'BID_TYPE_CUSTOM',
        dayparting:
          '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
        purchased_impression: null,
        app_id: null,
        brand_safety_type: 'NO_BRAND_SAFETY',
        creative_material_mode: 'CUSTOM',
        purchased_reach: null,
        adgroup_name: 'name',
        advertiser_id: '7412972596997832705',
        schedule_type: 'SCHEDULE_START_END',
        skip_learning_phase: false,
        interest_category_ids: [],
        auto_targeting_enabled: false,
        brand_safety_partner: null,
        adgroup_app_profile_page_state: null,
        promotion_type: 'WEBSITE',
        is_hfss: false,
        schedule_start_time: '2024-12-12 23:23:23',
        billing_event: 'CPC',
        modify_time: '2024-09-18 10:21:53',
        operation_status: 'ENABLE',
        adgroup_id: '1810528895940722',
        campaign_id: '1810423148616721',
        is_new_structure: true,
        rf_estimated_cpr: null,
        optimization_event: null,
        isp_ids: [],
        operating_systems: [],
        interest_keyword_ids: [],
        secondary_optimization_event: null,
      },
      request_id: '202409181021501150DF7F9F7A5B0F6E73',
    };
    it('should call adgroupCreate with the correct parameters', (done) => {
      adgroupApiMock.adgroupCreate.mockImplementation((accessToken, adGroupCreateBody, callback) =>
        callback(null, adGroupCreateResponse, {}),
      );

      adGroupController.createAdGroup(adGroupCreateBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(adGroupCreateResponse);
        expect(adgroupApiMock.adgroupCreate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupCreateBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if adgroupCreate fails', (done) => {
      const error = new Error(
        'Error: request_id:2024091810460186C17EDA3F056A108926 message: Ad group name already exists. Please try another one. code: 40002',
      );
      adgroupApiMock.adgroupCreate.mockImplementation((accessToken, adGroupCreateBody, callback) =>
        callback(error, null, {}),
      );

      adGroupController.createAdGroup(adGroupCreateBody, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(adgroupApiMock.adgroupCreate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupCreateBody },
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('updateAdGroup', () => {
    const updateAdGroupBody = {
      advertiser_id: advertiserId,
      adgroup_id: '1810528895940722',
      bid_price: 10,
      budget: 10000,
    };
    const updateAdGroupResponse = {
      data: {
        create_time: '2024-09-18 10:21:53',
        video_download_disabled: true,
        rf_estimated_frequency: null,
        schedule_infos: null,
        budget_mode: 'BUDGET_MODE_TOTAL',
        next_day_retention: null,
        languages: [],
        is_smart_performance_campaign: false,
        keywords: null,
        network_types: [],
        bid_price: 10,
        device_price_ranges: null,
        gender: 'GENDER_UNLIMITED',
        statistic_type: null,
        delivery_mode: null,
        vbo_window: null,
        pacing: 'PACING_MODE_SMOOTH',
        age_groups: null,
        excluded_audience_ids: [],
        frequency_schedule: null,
        actions: [],
        share_disabled: false,
        placements: ['PLACEMENT_TIKTOK'],
        bid_display_mode: 'CPMV',
        deep_bid_type: null,
        scheduled_budget: 0,
        budget: 10000,
        category_id: '0',
        category_exclusion_ids: [],
        campaign_name: 'test_v1.3',
        conversion_bid_price: 0,
        schedule_end_time: '2026-01-01 00:00:00',
        conversion_window: null,
        app_type: null,
        location_ids: ['6252001'],
        search_result_enabled: true,
        ios14_quota_type: 'UNOCCUPIED',
        app_download_url: null,
        inventory_filter_enabled: false,
        comment_disabled: true,
        placement_type: 'PLACEMENT_TYPE_NORMAL',
        feed_type: null,
        optimization_goal: 'CLICK',
        rf_purchased_type: null,
        smart_interest_behavior_enabled: null,
        pixel_id: null,
        smart_audience_enabled: null,
        audience_ids: [],
        deep_cpa_bid: 0,
        frequency: null,
        bid_type: 'BID_TYPE_CUSTOM',
        dayparting:
          '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
        purchased_impression: null,
        app_id: null,
        brand_safety_type: 'NO_BRAND_SAFETY',
        creative_material_mode: 'CUSTOM',
        purchased_reach: null,
        adgroup_name: 'name',
        advertiser_id: '7412972596997832705',
        schedule_type: 'SCHEDULE_START_END',
        skip_learning_phase: false,
        interest_category_ids: [],
        auto_targeting_enabled: false,
        brand_safety_partner: null,
        adgroup_app_profile_page_state: null,
        promotion_type: 'WEBSITE',
        is_hfss: false,
        schedule_start_time: '2024-12-12 23:23:23',
        billing_event: 'CPC',
        modify_time: '2024-09-19 04:10:03',
        operation_status: 'ENABLE',
        adgroup_id: '1810528895940722',
        campaign_id: '1810423148616721',
        is_new_structure: true,
        rf_estimated_cpr: null,
        optimization_event: null,
        isp_ids: [],
        operating_systems: [],
        interest_keyword_ids: [],
        secondary_optimization_event: null,
        need_audit: false,
      },
      request_id: '202409190410007DE708468FD8225A333A',
    };
    it('should call adgroupUpdate with the correct parameters', (done) => {
      adgroupApiMock.adgroupUpdate.mockImplementation((accessToken, updateAdGroupBody, callback) =>
        callback(null, updateAdGroupResponse),
      );

      adGroupController.updateAdGroup(updateAdGroupBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(updateAdGroupResponse);
        expect(adgroupApiMock.adgroupUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: updateAdGroupBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if adgroupUpdate fails', (done) => {
      updateAdGroupBody.budget = 768;
      const error = new Error(
        'Error: request_id:202409190420115159886689B37259DE8D message: Minimum budget for this time period must not be less than $7680.00 code: 40002',
      );
      adgroupApiMock.adgroupUpdate.mockImplementation((accessToken, updateAdGroupBody, callback) =>
        callback(error, null),
      );

      adGroupController.updateAdGroup(updateAdGroupBody, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(adgroupApiMock.adgroupUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: updateAdGroupBody },
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('deleteAdGroup', () => {
    const adGroupDeleteBody = {
      advertiser_id: advertiserId,
      adgroup_ids: ['1810602241463298', '1810602188593265', '1810602169321473', '1810602148849713'],
      operation_status: 'DELETE',
    };
    const adGroupDeleteResponse = {
      data: {
        adgroup_ids: ['1810602241463298', '1810602188593265', '1810602169321473', '1810602148849713'],
        status: 'DELETE',
      },
      request_id: '2024091905520281C6832A7118345FFA1E',
    };
    it('should call deleteAdGroup for deletion', (done) => {
      adgroupApiMock.adgroupUpdate.mockImplementation((accessToken, { body: adGroupDeleteBody }, callback) =>
        callback(null, adGroupDeleteResponse),
      );

      adGroupController.deleteAdGroup(adGroupDeleteBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(adGroupDeleteResponse);
        expect(adgroupApiMock.adgroupUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupDeleteBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if adgroupDelete fails during deletion', (done) => {
      const adGroupDeleteBody = {
        adgroup_ids: ['123456789'],
        advertiser_id: advertiserId,
        operation_status: 'DELETE',
      };
      const error = new Error(
        'Error: request_id:2024091905393272033B54FB0C0E617C07 message: The campaign or ad group has been deleted or the ad group does not exist. adgroup_ids: [123456789] code: 40002',
      );
      adgroupApiMock.adgroupUpdate.mockImplementation((accessToken, { body: adGroupDeleteBody }, callback) =>
        callback(error, null),
      );

      adGroupController.deleteAdGroup(adGroupDeleteBody, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(adgroupApiMock.adgroupUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupDeleteBody },
          expect.any(Function),
        );
        done();
      });
    });
  });

  describe('patchAdGroup', () => {
    const adGroupStatusUpdateBody = {
      adgroup_ids: ['1810528895940722'],
      advertiser_id: advertiserId,
      operation_status: 'DISABLE',
    };
    const adGroupStatusUpdateResponse = {
      data: {
        adgroup_ids: ['1810602241463298', '1810602188593265', '1810602169321473', '1810602148849713'],
        status: 'DISABLE',
      },
      request_id: '2024091905520281C6832A7118345FFA1E',
    };
    it('should call adgroupStatusUpdate with the correct parameters', (done) => {
      adgroupApiMock.adgroupStatusUpdate.mockImplementation((accessToken, adGroupStatusUpdateBody, callback) =>
        callback(null, adGroupStatusUpdateResponse),
      );

      adGroupController.patchAdGroup(adGroupStatusUpdateBody, (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual(adGroupStatusUpdateResponse);
        expect(adgroupApiMock.adgroupStatusUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupStatusUpdateBody },
          expect.any(Function),
        );
        done();
      });
    });

    it('should return an error if adgroupStatusUpdate fails', (done) => {
      adGroupStatusUpdateBody.adgroup_ids = ['123456789', '987654321'];
      const error = new Error(
        'Error: request_id:20240919055909BAD19DE9A8A1A0616D62 message: The campaign or ad group has been deleted or the ad group does not exist. adgroup_ids: [123456789, 987654321] code: 40002',
      );
      adgroupApiMock.adgroupStatusUpdate.mockImplementation((accessToken, adGroupStatusUpdateBody, callback) =>
        callback(error, null),
      );

      adGroupController.patchAdGroup(adGroupStatusUpdateBody, (err, result) => {
        expect(err).toEqual(error);
        expect(result).toBeNull();
        expect(adgroupApiMock.adgroupStatusUpdate).toHaveBeenCalledWith(
          accessToken,
          { body: adGroupStatusUpdateBody },
          expect.any(Function),
        );
        done();
      });
    });
  });
});
