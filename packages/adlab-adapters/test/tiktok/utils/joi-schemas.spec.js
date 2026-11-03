import { campaignCreateBodySchema, adGroupCreateBodySchema } from '../../../src/tiktok/utils/joi-schemas';

describe('tiktok-domain-entities-schema-validation', () => {
  describe('campaign-schema', () => {
    const baseValidData = {
      advertiser_id: '12345',
      campaign_name: 'Test Campaign',
      budget: 1000,
      budget_mode: 'BUDGET_MODE_TOTAL',
      objective_type: 'AWARENESS',
      campaign_type: 'REGULAR_CAMPAIGN',
    };

    test('should pass with valid basic campaign data', () => {
      const { error } = campaignCreateBodySchema.validate(baseValidData);
      expect(error).toBeUndefined();
    });

    test('should require app_id when campaign_type is IOS14_CAMPAIGN and objective_type is PRODUCT_SALES', () => {
      const data = {
        ...baseValidData,
        campaign_type: 'IOS14_CAMPAIGN',
        objective_type: 'PRODUCT_SALES',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toEqual('"app_id" is required');
    });

    test('should not require app_id when campaign_type is REGULAR_CAMPAIGN', () => {
      const data = {
        ...baseValidData,
        campaign_type: 'REGULAR_CAMPAIGN',
        objective_type: 'PRODUCT_SALES',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeUndefined();
    });

    test('should require app_promotion_type when objective_type is APP_PROMOTION', () => {
      const data = {
        ...baseValidData,
        objective_type: 'APP_PROMOTION',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"app_promotion_type" is required');
    });

    test('should require rf_campaign_type when objective_type is RF_REACH', () => {
      const data = {
        advertiser_id: '12345',
        campaign_name: 'Test Campaign',
        // budget_mode: 'BUDGET_MODE_TOTAL',
        campaign_type: 'REGULAR_CAMPAIGN',
        budget_mode: 'BUDGET_MODE_INFINITE',
        objective_type: 'RF_REACH',
        rf_campaign_type: 'PULSE',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeUndefined();
    });

    test('should require budget_mode to be BUDGET_MODE_INFINITE when objective_type is RF_REACH', () => {
      const data = {
        ...baseValidData,
        objective_type: 'RF_REACH',
        rf_campaign_type: 'STANDARD',
        budget_mode: 'BUDGET_MODE_DAY',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toEqual('"budget_mode" must be [BUDGET_MODE_INFINITE]');
    });

    test('should pass with valid budget and budget_optimize_on as true', () => {
      const data = {
        ...baseValidData,
        budget_optimize_on: true,
        budget_mode: 'BUDGET_MODE_DAY',
        optimization_goal: 'INSTALL',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeUndefined();
    });

    test('should require optimization_goal when budget_optimize_on is true', () => {
      const data = {
        ...baseValidData,
        budget_optimize_on: true,
        budget_mode: 'BUDGET_MODE_DAY',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toEqual('"optimization_goal" is required');
    });

    test('should invalidate incorrect campaign_type for PRODUCT_SALES', () => {
      const data = {
        ...baseValidData,
        objective_type: 'PRODUCT_SALES',
        campaign_type: 'WRONG_CAMPAIGN_TYPE',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"campaign_type" must be one of [IOS14_CAMPAIGN, REGULAR_CAMPAIGN]');
    });

    test('should allow special_industries if provided', () => {
      const data = {
        ...baseValidData,
        special_industries: 'REAL_ESTATE',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeUndefined();
    });

    test('should invalidate special_industries if wrong value is provided', () => {
      const data = {
        ...baseValidData,
        special_industries: 'WRONG_INDUSTRY',
      };
      const { error } = campaignCreateBodySchema.validate(data);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain(
        '"special_industries" must be one of [REAL_ESTATE, CREDIT, GAMBLING, INSURANCE, SUPPLEMENT]',
      );
    });

    // Missing required fields
    test('should fail validation when advertiser_id is missing', () => {
      const invalidData = {
        app_id: '67890',
        app_promotion_type: 'APP_INSTALL',
        budget: 1000,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_type: 'PRODUCT_SALES',
        campaign_name: 'New Campaign',
        objective_type: 'PRODUCT_SALES',
        operation_status: 'ENABLE',
        optimization_goal: 'CONVERT',
        rf_campaign_type: 'STANDARD',
      };
      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"advertiser_id" is required');
    });

    test('fails validation when budget is less than minimum', () => {
      const invalidData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget: 100,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_type: 'PRODUCT_SALES',
        campaign_name: 'New Campaign',
        objective_type: 'PRODUCT_SALES',
        operation_status: 'ENABLE',
        optimization_goal: 'CONVERT',
        rf_campaign_type: 'STANDARD',
      };
      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"budget" must be greater than or equal to 500');
    });

    test('fails validation when objective_type is not valid', () => {
      const invalidData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget: 1000,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_type: 'REGULAR_CAMPAIGN',
        campaign_name: 'New Campaign',
        objective_type: 'INVALID_TYPE',
      };
      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"objective_type" must be one of');
    });

    test('fails validation when app_promotion_type is not valid', () => {
      const invalidData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget: 1000,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_type: 'REGULAR_CAMPAIGN',
        campaign_name: 'New Campaign',
        objective_type: 'APP_PROMOTION',
        app_promotion_type: 'INVALID_TYPE',
      };

      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"app_promotion_type" must be one of');
    });

    test('fails validation when optimization_goal is required but not provided', () => {
      const invalidData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget_mode: 'BUDGET_MODE_INFINITE',
        campaign_name: 'New Campaign',
        objective_type: 'RF_REACH',
        budget_optimize_on: true,
        optimization_goal: undefined,
        campaign_type: 'REGULAR_CAMPAIGN',
      };

      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"optimization_goal" is required');
    });

    test('defaults operation_status to ENABLE when not provided', () => {
      const validData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget: 1000,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_name: 'New Campaign',
        objective_type: 'PRODUCT_SALES',
        campaign_type: 'REGULAR_CAMPAIGN',
      };

      const { error, value } = campaignCreateBodySchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value.operation_status).toBe('ENABLE');
    });

    test('validates operation_status as ENABLE or DISABLE', () => {
      const invalidData = {
        advertiser_id: '12345',
        app_id: '67890',
        budget: 1000,
        budget_mode: 'BUDGET_MODE_DAY',
        campaign_name: 'New Campaign',
        objective_type: 'PRODUCT_SALES',
        operation_status: 'INVALID_STATUS',
        campaign_type: 'REGULAR_CAMPAIGN',
      };

      const { error } = campaignCreateBodySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch('"operation_status" must be one of');
    });
  });

  describe('AdGroupCreateBodySchema', () => {
    let validData;

    beforeEach(() => {
      validData = {
        adgroup_name: 'Test Ad Group',
        advertiser_id: 'advertiser123',
        campaign_id: 'campaign123',
        placement_type: 'PLACEMENT_TYPE_AUTOMATIC',
        optimization_goal: 'CONVERSIONS',
        billing_event: 'OCPM',
        budget_mode: 'BUDGET_MODE_DAY',
        budget: 1000,
        bid_amount: 100,
        bid: 100,
        start_time: new Date(Date.now() + 86400000).toISOString(),
        creative_material_mode: 'CREATIVE_MANUAL',
        creatives: [
          {
            creative_id: 'creative123',
            creative_type: 'IMAGE',
            image_url: 'https://example.com/image.jpg',
          },
        ],
      };
    });

    // 1. Test valid data
    it('should pass validation with valid data', () => {
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeUndefined();
    });

    // 2. Test missing required fields
    it('should fail validation if adgroup_name is missing', () => {
      delete validData.adgroup_name;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"adgroup_name" is required/);
    });

    it('should fail validation if advertiser_id is missing', () => {
      delete validData.advertiser_id;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"advertiser_id" is required/);
    });

    it('should fail validation if campaign_id is missing', () => {
      delete validData.campaign_id;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"campaign_id" is required/);
    });

    // 3. Test invalid values for select fields
    it('should fail validation for invalid placement_type', () => {
      validData.placement_type = 'INVALID_PLACEMENT';
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"placement_type" must be one of/);
    });

    it('should fail validation for invalid optimization_goal', () => {
      validData.optimization_goal = 'INVALID_GOAL';
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"optimization_goal" must be one of/);
    });

    // 4. Test budget validation
    it('should fail if budget is below the minimum for BUDGET_MODE_DAY', () => {
      validData.budget = 200;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"budget" must be greater than or equal to 500/);
    });

    it('should fail if budget is below the minimum for BUDGET_MODE_TOTAL', () => {
      validData.budget_mode = 'BUDGET_MODE_TOTAL';
      validData.budget = 4000;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"budget" must be greater than or equal to 5000/);
    });

    // 5. Test bid validation
    it('should fail if bid is below the minimum for VIDEO_VIEWS optimization', () => {
      validData.optimization_goal = 'VIDEO_VIEWS';
      validData.bid = 50;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"bid" must be greater than or equal to 100/);
    });

    it('should fail if bid is below the minimum for non-VIDEO_VIEWS optimization', () => {
      validData.bid = 30;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"bid" must be greater than or equal to 50/);
    });
    // 6. Test conditional fields
    // it('should pass when app_id is required and provided', () => {
    //   validData.optimization_goal = 'CONVERSIONS';
    //   validData.app_id = 'app123';
    //   const { error } = adGroupCreateBodySchema.validate(validData);
    //   expect(error).toBeUndefined();
    // });

    it('should fail when app_id is required but missing', () => {
      validData.optimization_goal = 'APP_INSTALLS';
      delete validData.app_id;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(
        '"optimization_goal" must be one of [CONVERSIONS, CLICK, REACH, VIDEO_VIEWS]',
      );
    });

    // 7. Test forbidden fields
    it('should fail if app_id is present but forbidden', () => {
      validData.optimization_goal = 'CONVERSIONS';
      validData.app_id = 'app123';
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"app_id" is not allowed/);
    });

    // 8. Test array validations
    it('should pass if creatives array has at least one valid entry', () => {
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeUndefined();
    });
    it('should fail if creatives array is empty', () => {
      validData.creatives = [];
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"creatives" must contain at least 1 items/);
    });

    // 9. Test nested object validation (creative items)
    it('should fail if creative_type is IMAGE but image_url is missing', () => {
      delete validData.creatives[0].image_url;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"image_url" is required/);
    });

    it('should fail if creative_type is VIDEO but video_url is missing', () => {
      validData.creatives[0].creative_type = 'VIDEO';
      delete validData.creatives[0].image_url;
      validData.creatives[0].video_url = undefined;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"video_url" is required/);
    });

    // 10. Test date validations
    it('should fail if start_time is in the past', () => {
      validData.start_time = new Date(Date.now() - 86400000).toISOString(); // 24 hours in the past
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"start_time" must be greater than/);
    });

    it('should fail if end_time is before start_time', () => {
      validData.end_time = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      validData.start_time = new Date(Date.now() + 86400000).toISOString(); // 24 hours from now
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"end_time" must be greater than "start_time"/);
    });

    // 11. Test additional invalid scenarios
    it('should fail if deep_link is required but missing', () => {
      validData.optimization_goal = 'APP_INSTALLS';
      delete validData.deep_link;
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"deep_link" is required/);
    });

    it('should fail if deep_link is present but not a valid URI', () => {
      validData.optimization_goal = 'APP_INSTALLS';
      validData.deep_link = 'invalid_uri';
      const { error } = adGroupCreateBodySchema.validate(validData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/"deep_link" must be a valid uri/);
    });
  });
});
