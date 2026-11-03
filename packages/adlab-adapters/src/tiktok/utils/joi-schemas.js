import Joi from 'joi';

const campaignCreateBodySchema = Joi.object({
  advertiser_id: Joi.string().required(),
  app_id: Joi.string().when('campaign_type', {
    is: 'IOS14_CAMPAIGN',
    then: Joi.when('objective_type', {
      is: 'PRODUCT_SALES',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    otherwise: Joi.optional(),
  }),
  app_promotion_type: Joi.when('objective_type', {
    is: 'APP_PROMOTION',
    then: Joi.string().valid('APP_INSTALL', 'APP_RETARGETING').required(),
    otherwise: Joi.forbidden(),
  }),
  budget: Joi.number()
    .integer()
    .min(500)
    .required()
    .when('budget_mode', {
      is: Joi.valid('BUDGET_MODE_TOTAL', 'BUDGET_MODE_DAY'),
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  budget_mode: Joi.when('objective_type', {
    is: 'RF_REACH',
    then: Joi.valid('BUDGET_MODE_INFINITE').required(),
    otherwise: Joi.when('budget_optimize_on', {
      is: true,
      then: Joi.valid('BUDGET_MODE_DAY').required(),
      otherwise: Joi.valid('BUDGET_MODE_TOTAL', 'BUDGET_MODE_DAY', 'BUDGET_MODE_INFINITE').required(),
    }),
  }),
  campaign_type: Joi.when('objective_type', {
    is: 'PRODUCT_SALES',
    then: Joi.valid('IOS14_CAMPAIGN', 'REGULAR_CAMPAIGN').required(),
    otherwise: Joi.valid('REGULAR_CAMPAIGN').required(),
  }),
  budget_optimize_on: Joi.boolean().optional(),
  campaign_name: Joi.string().max(512).required(),
  objective_type: Joi.string()
    .valid(
      'AWARENESS',
      'TRAFFIC',
      'APP_PROMOTION',
      'VIDEO_VIEWS',
      'CONVERSIONS',
      'CATALOG_SALES',
      'RF_REACH',
      'PRODUCT_SALES',
    )
    .required(),
  operation_status: Joi.when('objective_type', {
    is: 'RF_REACH',
    then: Joi.valid('ENABLE').optional(),
    otherwise: Joi.valid('ENABLE', 'DISABLE').default('ENABLE').optional(),
  }),
  optimization_goal: Joi.when('budget_optimize_on', {
    is: true,
    then: Joi.valid('CONVERT', 'INSTALL', 'VALUE', 'IN_APP_EVENT', 'LEAD_GENERATION').required(),
    otherwise: Joi.forbidden(),
  }),
  rf_campaign_type: Joi.string().valid('STANDARD', 'PULSE').when('objective_type', {
    is: 'RF_REACH',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  special_industries: Joi.string().valid('REAL_ESTATE', 'CREDIT', 'GAMBLING', 'INSURANCE', 'SUPPLEMENT').optional(),
});

const adGroupCreateBodySchema = Joi.object({
  adgroup_app_profile_page_state: Joi.string().valid('ON', 'OFF').optional(),
  adgroup_name: Joi.string().max(512).required(),
  advertiser_id: Joi.string().required(),
  age_groups: Joi.string()
    .valid('AGE_13_17', 'AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_100')
    .optional(),
  campaign_id: Joi.string().required(),
  app_id: Joi.object({
    app_id: Joi.string().when('objective_type', {
      is: Joi.valid('APP_INSTALL', 'APP_PROMOTION', 'CONVERSIONS'),
      then: Joi.when('objective_type', {
        switch: [
          {
            is: 'APP_INSTALL',
            then: Joi.required(),
          },
          {
            is: 'APP_PROMOTION',
            then: Joi.when('app_promotion_type', {
              is: 'APP_RETARGETING',
              then: Joi.required(),
              otherwise: Joi.when('app_promotion_type', {
                is: 'APP_INSTALL',
                then: Joi.required(),
                otherwise: Joi.forbidden(),
              }),
            }),
          },
          {
            is: 'CONVERSIONS',
            then: Joi.when('promotion_type', {
              is: Joi.valid('APP_ANDROID', 'APP_IOS'),
              then: Joi.required(),
              otherwise: Joi.forbidden(),
            }),
          },
        ],
      }),
      otherwise: Joi.forbidden(),
    }),
  }),
  audience_ids: Joi.array().items(Joi.string()).optional(),
  audience_type: Joi.when('objective_type', {
    is: 'CONVERSIONS',
    then: Joi.when('external_type', {
      is: Joi.valid('APP_ANDROID', 'APP_IOS'),
      then: Joi.string().valid('NEW_CUSTOM_AUDIENCE').required(),
      otherwise: Joi.forbidden(),
    }),
    otherwise: Joi.forbidden(),
  }).optional(),
  bid_display_mode: Joi.when('objective_type', {
    is: 'VIDEO_VIEW',
    then: Joi.when('bid_type', {
      is: 'BID_TYPE_CUSTOM',
      then: Joi.string().valid('CPV').required(),
      otherwise: Joi.forbidden(),
    }),
    otherwise: Joi.forbidden(),
  }).optional(),
  bid_price: Joi.when('bid_type', {
    is: 'BID_TYPE_CUSTOM',
    then: Joi.number()
      .required()
      .custom((value, helpers) => {
        if (value >= helpers.state.ancestors[0].campaign_budget || value >= helpers.state.ancestors[0].adgroup_budget) {
          return helpers.error('number.max', { value });
        }
        return value;
      })
      .messages({
        'number.max': 'bid_price must be lower than both campaign-level and ad group-level budgets',
      }),
    otherwise: Joi.forbidden(),
  }).optional(),
  // BID_TYPE_CUSTOM, BID_TYPE_NO_BID
  bid_type: Joi.when('budget_optimize_on', {
    is: true,
    then: Joi.string().valid('LOWEST_COST', 'COST_CAP', 'BID_CAP', 'TARGET_ROAS').required(),
    otherwise: Joi.forbidden(),
  }).optional(),
  placement_type: Joi.string().valid('PLACEMENT_TYPE_AUTOMATIC', 'PLACEMENT_TYPE_NORMAL').required(),
  placement: Joi.string()
    .valid('PLACEMENT_TIKTOK', 'PLACEMENT_PANGLE', 'PLACEMENT_GLOBAL_APP_BUNDLE', 'PLACEMENT_TOPBUZZ')
    .optional(),
  product_set_id: Joi.string().optional(),
  product_source: Joi.string().valid('UNSET', 'CATALOG', 'STORE', 'SHOWCAST'),
  promotion_type: Joi.string().optional(),
  promotion_website_type: Joi.string().valid('TIKTOK_NATIVE_PAGE').optional(),
  purchase_intention_keyword_ids: Joi.string().optional(),
  request_id: Joi.string().optional(),
  inventory_filter: Joi.when('placement_type', {
    is: 'PLACEMENT_TYPE_MANUAL',
    then: Joi.array()
      .items(Joi.string().valid('VIDEO_FEED', 'PANGLE', 'SPARK_ADS'))
      .required(),
    otherwise: Joi.forbidden(),
  }),
  optimization_goal: Joi.string().valid('CONVERSIONS', 'CLICK', 'REACH', 'VIDEO_VIEWS').required(),
  billing_event: Joi.when('optimization_goal', {
    is: 'CONVERSIONS',
    then: Joi.valid('OCPM').required(),
    otherwise: Joi.valid('OCPM', 'CPC', 'CPM', 'CPV').required(),
  }),
  app_id: Joi.when('optimization_goal', {
    is: 'APP_INSTALLS',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  creative_material_mode: Joi.string().valid('CREATIVE_AUTOMATIC', 'CREATIVE_MANUAL').required(),
  delivery_mode: Joi.string().valid('STANDARD', 'ACCELERATE').optional(),
  start_time: Joi.date().iso().greater('now').required(),
  end_time: Joi.date().iso().min(Joi.ref('start_time')).optional(),
  budget_mode: Joi.string().valid('BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL').required(),
  budget: Joi.when('budget_mode', {
    is: 'BUDGET_MODE_DAY',
    then: Joi.number().integer().min(500).required(),
    otherwise: Joi.number().integer().min(5000).required(),
  }),
  bid: Joi.when('optimization_goal', {
    is: 'VIDEO_VIEWS',
    then: Joi.number().integer().min(100).required(),
    otherwise: Joi.number().integer().min(50).required(),
  }),
  target_audience: Joi.object({
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNKNOWN').optional(),
    age: Joi.array()
      .items(Joi.string().valid('AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_64', 'AGE_65_PLUS'))
      .optional(),
    location: Joi.array().items(Joi.string()).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  deep_link: Joi.when('optimization_goal', {
    is: 'APP_INSTALLS',
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
  smart_targeting: Joi.boolean().optional(),
  schedule_time: Joi.object({
    start_time: Joi.date().iso().optional(),
    end_time: Joi.date().iso().optional(),
    time_series: Joi.array()
      .items(Joi.string().pattern(/^[01]{48}$/))
      .optional(),
  }).optional(),
  optimization_bid_strategy: Joi.string().valid('LOWEST_COST', 'COST_CAP', 'BID_CAP').optional(),
  app_download_url: Joi.when('optimization_goal', {
    is: 'APP_INSTALLS',
    then: Joi.string().uri().required(),
    otherwise: Joi.forbidden(),
  }),
  call_to_action: Joi.string().valid('SHOP_NOW', 'DOWNLOAD_NOW', 'LEARN_MORE', 'SIGN_UP', 'SUBSCRIBE').optional(),
  creatives: Joi.array()
    .items(
      Joi.object({
        creative_id: Joi.string().required(),
        creative_type: Joi.string().valid('IMAGE', 'VIDEO', 'CAROUSEL').required(),
        image_url: Joi.when('creative_type', {
          is: 'IMAGE',
          then: Joi.string().uri().required(),
          otherwise: Joi.forbidden(),
        }),
        video_url: Joi.when('creative_type', {
          is: 'VIDEO',
          then: Joi.string().uri().required(),
          otherwise: Joi.forbidden(),
        }),
        carousel_items: Joi.when('creative_type', {
          is: 'CAROUSEL',
          then: Joi.array()
            .items(
              Joi.object({
                item_id: Joi.string().required(),
                image_url: Joi.string().uri().required(),
              }),
            )
            .required(),
          otherwise: Joi.forbidden(),
        }),
      }),
    )
    .min(1)
    .required(),
  third_party_tracking_urls: Joi.object({
    impression_url: Joi.string().uri().optional(),
    click_url: Joi.string().uri().optional(),
  }).optional(),
  bid_amount: Joi.when('optimization_goal', {
    is: 'CONVERSIONS',
    then: Joi.number().min(1).required(),
    otherwise: Joi.number().optional(),
  }),
  external_url: Joi.string().uri().optional(),
  remarketing: Joi.boolean().optional(),
  tracking_url: Joi.string().uri().optional(),
});

const adCreateBodySchema = Joi.object({
  advertiser_id: Joi.string().required(),
  campaign_id: Joi.string().required(),
  adgroup_id: Joi.string().required(),
  ad_name: Joi.string().max(512).required(),
  ad_format: Joi.string().valid('VIDEO', 'IMAGE', 'CAROUSEL').required(),
  creative_material_mode: Joi.string().valid('STATIC_ASSETS', 'DYNAMIC_ASSETS').required(),
  ad_text: Joi.string().max(500),
  tracking_url: Joi.string().uri().optional(),
  call_to_action: Joi.string().valid('SHOP_NOW', 'LEARN_MORE', 'SIGN_UP').optional(),
  landing_page_url: Joi.string().uri().optional(),
  creative_material_ids: Joi.array().items(Joi.string()),
  third_party_id: Joi.string().optional(),
  promotion_type: Joi.string().valid('AUCTION', 'RESERVATION').optional(),
  advertiser_policy_id: Joi.number().integer().optional(),
  user_id: Joi.string().optional(),
  budget_mode: Joi.string().valid('BUDGET_MODE_DAY', 'BUDGET_MODE_TOTAL').optional(),
  budget: Joi.number().precision(2).optional(),
  bid: Joi.number().precision(2).optional(),
  bid_type: Joi.string().valid('CPC', 'CPM', 'CPA').optional(),
  start_time: Joi.number().integer().optional(),
  end_time: Joi.number().integer().optional(),
});

const adSchemaV2 = Joi.object({
  advertiser_id: Joi.string().required(),
  adgroup_id: Joi.string().required(),
  creative_id: Joi.string().required(),
  name: Joi.string().min(1).max(255).required(),
  creative_material_mode: Joi.string().valid('CREATIVE_MATERIAL_SINGLE', 'CREATIVE_MATERIAL_MULTI').required(),
  creative_materials: Joi.array()
    .items(
      Joi.object({
        image_url: Joi.string().uri().required(),
        video_url: Joi.string().uri().optional(),
      }),
    )
    .min(1)
    .when('creative_material_mode', {
      is: 'CREATIVE_MATERIAL_MULTI',
      then: Joi.array().min(2).required(),
      otherwise: Joi.array().length(1).required(),
    }),
  call_to_action: Joi.string().valid('SHOP_NOW', 'DOWNLOAD', 'LEARN_MORE', 'SIGN_UP').required(),
  destination_url: Joi.string().uri().required(),
  tracking_url: Joi.string().uri().optional(),
  delivery_mode: Joi.string().valid('DELIVERY_MODE_STANDARD', 'DELIVERY_MODE_ACCELERATED').required(),
  budget_per_day: Joi.when('delivery_mode', {
    is: 'DELIVERY_MODE_STANDARD',
    then: Joi.number().positive().min(1).required(),
    otherwise: Joi.forbidden(),
  }),
  status: Joi.string().valid('STATUS_ACTIVE', 'STATUS_PAUSED').optional().default('STATUS_ACTIVE'),
});

const adGroupSchemaV2 = Joi.object({
  advertiser_id: Joi.string().required(),
  campaign_id: Joi.string().required(),
  name: Joi.string().min(1).max(255).required(),

  budget: Joi.number().positive().required(),
  budget_mode: Joi.string().valid('BUDGET_MODE_INFINITE', 'BUDGET_MODE_DAY').required(),
  bid: Joi.when('optimization_goal', {
    is: 'GOAL_CONVERSIONS',
    then: Joi.number().positive().min(10).required(),
    otherwise: Joi.number().positive().min(1).required(),
  }),

  optimization_goal: Joi.string().valid('GOAL_APP_INSTALLS', 'GOAL_CONVERSIONS', 'GOAL_CLICKS').required(),

  app_install_target: Joi.string()
    .optional()
    .when('optimization_goal', {
      is: 'GOAL_APP_INSTALLS',
      then: Joi.string().required().valid('IOS', 'ANDROID'),
      otherwise: Joi.forbidden(),
    }),

  bid_strategy: Joi.string().valid('BID_STRATEGY_LOWEST_COST', 'BID_STRATEGY_MANUAL').required(),

  placement: Joi.array()
    .items(Joi.string().valid('PLACEMENT_TIKTOK', 'PLACEMENT_PANGLE', 'PLACEMENT_NEWSFEED'))
    .required(),

  schedule_type: Joi.string().valid('SCHEDULE_TYPE_IMMEDIATE', 'SCHEDULE_TYPE_SCHEDULED').required(),
  start_time: Joi.date().iso().when('schedule_type', {
    is: 'SCHEDULE_TYPE_SCHEDULED',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  end_time: Joi.date().iso().optional().allow(null),

  status: Joi.string().valid('STATUS_ACTIVE', 'STATUS_PAUSED').optional().default('STATUS_ACTIVE'),

  targeting: Joi.object({
    age_range: Joi.array().items(Joi.number().min(13).max(65)).length(2).optional(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'UNKNOWN').optional(),
    location: Joi.string().optional(),
    interest: Joi.string().optional(),
  }).optional(),

  dayparting: Joi.object({
    enabled: Joi.boolean().optional().default(false),
    hours: Joi.when('enabled', {
      is: true,
      then: Joi.array().items(Joi.number().min(0).max(23)).required(),
      otherwise: Joi.forbidden(),
    }),
  }).optional(),
});

export { campaignCreateBodySchema, adGroupCreateBodySchema, adCreateBodySchema, adSchemaV2, adGroupSchemaV2 };
