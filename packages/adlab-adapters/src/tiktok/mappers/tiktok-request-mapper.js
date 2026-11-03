export class TikTokRequestMapper {
  static attributeMappings = {
    campaign: {
      advertiser_id: 'adAccountId',
      app_id: 'app_id',
      app_promotion_type: 'app_promotion_type',
      bid_type: 'bid_type',
      budget: 'budget',
      budget_mode: 'budget_mode',
      budget_optimize_on: 'budget_optimize_on',
      campaign_app_profile_page_state: 'campaign_app_profile_page_state',
      campaign_name: 'name',
      campaign_product_source: 'campaign_product_source',
      campaign_type: 'campaign_type',
      formData: 'formData',
      is_advanced_dedicated_campaign: 'is_advanced_dedicated_campaign',
      objective_type: 'objective_type',
      operation_status: 'campaign_status',
      optimization_goal: 'optimization_goal',
      postback_window_mode: 'postback_window_mode',
      request_id: 'request_id',
      rf_campaign_type: 'rf_campaign_type',
      rta_id: 'rta_id',
      rta_product_selection_enabled: 'rta_product_selection_enabled',
      special_industries: 'special_industries',
    },
    adgroup: {
      actions: '[actions]',
      action_category_ids: '[action_category_ids]',
      action_scene: 'action_scene',
      action_period: 'action_period',
      adgroup_app_profile_page_state: 'adgroup_app_profile_page_state',
      adgroup_name: 'adgroup_name',
      advertiser_id: 'adAccountId',
      age_groups: '[age_groups]',
      app_id: 'app_id',
      attribution_event_count: 'attribution_event_count',
      audience_ids: '[audience_ids]',
      audience_rule: '{audience_rule}',
      audience_type: 'audience_type',
      auto_targeting_enabled: 'auto_targeting_enabled',
      bid_display_mode: 'bid_display_mode',
      bid_price: 'bid_price',
      bid_type: 'bid_type',
      billing_event: 'billing_event',
      blocked_pangle_app_ids: '[blocked_pangle_app_ids]',
      brand_safety_partner: 'brand_safety_partner',
      brand_safety_type: 'brand_safety_type',
      budget: 'adgroup_budget',
      budget_mode: 'adgroup_budget_mode',
      budget_optimize_on: 'budget_optimize_on',
      campaign_id: 'campaign_id',
      carrier_ids: '[carrier_ids]',
      catalog_authorized_bc_id: 'catalog_authorized_bc_id',
      catalog_id: 'catalog_id',
      cities: '[cities]',
      countries: '[countries]',
      category_exclusion_ids: '[category_exclusion_ids]',
      click_attribution_window: 'click_attribution_window',
      comment_disabled: 'comment_disabled',
      contextual_tag_ids: '[contextual_tag_ids]',
      conversion_bid_price: 'conversion_bid_price',
      conversion_id: 'conversion_id',
      creative_material_mode: 'creative_material_mode',
      dayparting: 'dayparting',
      deep_bid_type: 'deep_bid_type',
      deep_cpa_bid: 'deep_cpa_bid',
      deep_funnel_event_source: 'deep_funnel_event_source',
      deep_funnel_event_source_id: 'deep_funnel_event_source_id',
      deep_funnel_optimization_event: 'deep_funnel_optimization_event',
      deep_funnel_optimization_status: 'deep_funnel_optimization_status',
      device_model_ids: '[device_model_ids]',
      device_price_ranges: '[device_price_ranges]',
      districts: '[districts]',
      dsRowId: 'rowid',
      engaged_view_attribution_window: 'engaged_view_attribution_window',
      excluded_audience_ids: '[excluded_audience_ids]',
      excluded_custom_actions: '[excluded_custom_actions]',
      excluded_pangle_audience_package_ids: '[excluded_pangle_audience_package_ids]',
      frequency: 'frequency',
      frequency_schedule: 'frequency_schedule',
      gender: 'gender',
      household_income: '[household_income]',
      identity_authorized_bc_id: 'identity_authorized_bc_id',
      identity_id: 'identity_id',
      identity_type: 'identity_type',
      included_custom_actions: '[included_custom_actions]',
      included_pangle_audience_package_ids: '[included_pangle_audience_package_ids]',
      interest_category_ids: '[interest_category_ids]',
      interest_keyword_ids: '[interest_keyword_ids]',
      interest_keywords: '[interest_keywords]',
      ios14_targeting: 'ios14_targeting',
      is_hfss: 'is_hfss',
      isp_ids: '[isp_ids]',
      languages: '[languages]',
      location_ids: '[location_ids]',
      message_event_set_id: 'message_event_set_id',
      messaging_app_account_id: 'messagin_app_account_id',
      messaging_app_type: 'messaging_app_type',
      min_android_version: 'min_android_version',
      min_ios_version: 'min_ios_version',
      network_types: '[network_types]',
      next_day_retention: 'next_day_retention',
      operating_systems: '[operating_systems]',
      operation_status: 'adgroup_status',
      optimization_event: 'optimization_event',
      optimization_goal: 'optimization_goal',
      pacing: 'pacing',
      phone_number: 'phone_number',
      phone_region_calling_code: 'phone_region_calling_code',
      phone_region_code: 'phone_region_code',
      pixel_id: 'pixel_id',
      placement_type: 'placement_type',
      placements: '[placements]',
      product_set_id: 'product_set_id',
      product_source: 'product_source',
      promotion_target_type: 'promotion_target_type',
      promotion_type: 'promotion_type',
      promotion_website_type: 'promotion_website_type',
      regions: '[regions]',
      purchase_intention_keyword_ids: '[purchase_intention_keyword_ids]',
      request_id: 'request_id',
      roas_bid: 'roas_bid',
      saved_audience_id: 'savedAudience',
      schedule_end_time: 'schedule_end_time',
      schedule_start_time: 'schedule_start_time',
      schedule_type: 'schedule_type',
      search_result_enabled: 'search_result_enabled',
      secondary_optimization_event: 'secondary_optimization_event',
      share_disabled: 'share_disabled',
      shopping_ads_retargeting_actions_days: 'shopping_ads_retargeting_actions_days',
      shopping_ads_retargeting_custom_audience_relation: 'shopping_ads_retargeting_custom_audience_relation',
      shopping_ads_retargeting_type: 'shopping_ads_retargeting_type',
      shopping_ads_type: 'shopping_ads_type',
      skip_learning_phase: 'skip_learning_phase',
      smart_audience_enabled: 'smart_audience_enabled',
      smart_interest_behavior_enabled: 'smart_interest_behavior_enabled',
      spending_power: 'spending_power',
      statistic_type: 'statistic_type',
      store_authorized_bc_id: 'store_authorized_bc_id',
      store_id: 'store_id',
      tiktok_subplacements: '[tiktok_subplacements]',
      vertical_sensitivity_id: 'vertical_sensitivity_id',
      video_download_disabled: 'video_download_disabled',
      video_user_actions: '[video_user_actions]',
      view_attribution_window: 'view_attribution_window',
      vbo_window: 'vbo_window',
      zipcode_ids: '[zipcode_ids]',
    },
    ad: {
      adgroup_id: 'adgroup_id',
      advertiser_id: 'adAccountId',
    },
    creative: {
      aigc_disclosure_type: 'aigc_disclosure_type',
      ad_format: 'ad_format',
      ad_name: 'ad_name',
      ad_text: 'ad_text',
      app_name: 'app_name',
      auto_message_id: 'auto_message_id',
      avatar_icon_web_uri: 'avatar_icon_web_uri',
      brand_safety_postbid_partner: 'brand_safety_postbid_partner',
      brand_safety_vast_url: 'brand_safety_vast_url',
      call_to_action: 'call_to_action',
      call_to_action_id: 'call_to_action_id',
      card_id: 'card_id',
      card_image_id: 'card_image_id',
      card_image_index: 'card_image_index',
      card_show_price: 'card_show_price',
      card_tags: 'card_tags',
      card_type: 'card_type',
      catalog_id: 'catalog_id',
      carousal_image_index: 'carousal_image_index',
      click_tracking_url: 'click_tracking_url',
      cpp_url: 'cpp_url',
      creative_authorized: 'creative_authorized',
      creative_type: 'creative_type',
      dark_post_status: 'dark_post_status',
      deeplink: 'deeplink',
      deeplink_format_type: 'deeplink_format_type',
      deeplink_type: 'deeplink_type',
      deeplink_utm_params: '[deeplink_utm_params]',
      disclaimer_clickable_texts: '[disclaimer_clickable_texts]',
      disclaimer_text: '{disclaimer_text}',
      disclaimer_type: 'disclaimer_type',
      display_name: 'display_name',
      dynamic_destination: 'dynamic_destination',
      dynamic_format: 'dynamic_format',
      fallback_type: 'fallback_type',
      identity_authorized_bc_id: 'identity_authorized_bc_id',
      identity_id: 'identity_id',
      identity_type: 'identity_type',
      image_ids: '[image_ids]',
      impression_tracking_url: 'impression_tracking_url',
      instant_product_page_used: 'instant_product_page_used',
      item_duet_status: 'item_duet_status',
      item_group_ids: 'item_group_ids',
      item_stitch_status: 'item_stitch_status',
      landing_page_url: 'landing_page_url',
      music_id: 'music_id',
      operation_status: 'ad_status',
      page_id: 'page_id',
      page_image_index: 'page_image_index',
      phone_number: 'phone_number',
      phone_region_calling_code: 'phone_region_calling_code',
      phone_region_code: 'phone_region_code',
      playable_url: 'playable_url',
      product_set_id: 'product_set_id',
      product_specific_type: 'product_specific_type',
      promotional_music_disabled: 'promotional_music_disabled',
      schedule_id: 'schedule_id',
      shopping_ads_deeplink_type: 'shopping_ads_deeplink_type',
      shopping_ads_fallback_type: 'shopping_ads_fallback_type',
      shopping_ads_video_package_id: 'shopping_ads_video_package_id',
      shopping_ads_word_set: 'shopping_ads_word_set',
      showcase_products: '[showcase_products]',
      sku_ids: 'sku_ids',
      tiktok_item_id: 'tiktok_item_id',
      tiktok_page_category: 'tiktok_page_category',
      tracking_app_id: 'tracking_app_id',
      tracking_message_event_set_id: 'tracking_message_event_set_id',
      tracking_offline_event_set_ids: '[tracking_offline_event_set_ids]',
      tracking_pixel_id: 'tracking_pixel_id',
      utm_params: '[utm_params]',
      vast_moat_enabled: 'vast_moat_enabled',
      vertical_video_strategy: 'vertical_video_strategy',
      video_id: 'video_id',
      video_view_tracking_url: 'video_view_tracking_url',
      viewability_postbid_partner: 'viewability_postbid_partner',
      viewability_vast_url: 'viewability_vast_url',
    },
  };

  static targetingAttrs = [
    'action_category_ids',
    'action_scene',
    'action_period',
    'age_groups',
    'carrier_ids',
    'cities',
    'countries',
    'device_model_ids',
    'districts',
    'excluded_pangle_audience_package_ids',
    'gender',
    'household_income',
    'included_pangle_audience_package_ids',
    'interest_category_ids',
    'interest_keyword_ids',
    'ios14_targeting',
    'isp_ids',
    'languages',
    'location_ids',
    'min_android_version',
    'min_ios_version',
    'network_types',
    'operating_systems',
    'purchase_intention_keyword_ids',
    'regions',
    'savedAudience',
    'smart_interest_behavior_enabled',
    'video_user_actions',
  ];

  static mapAttributes(type, dsData = {}, config = {}, common = {}) {
    const attributeMapping = this.attributeMappings[type];
    if (!attributeMapping) {
      throw new Error(`Invalid type for attribute mapping: ${type}`);
    }

    const attributes = Object.entries(attributeMapping).reduce((mappedObject, [targetKey, sourceKey]) => {
      let value;
      const isArrayMapping = sourceKey.startsWith('[') && sourceKey.endsWith(']');
      const isObjectMapping = sourceKey.startsWith('{') && sourceKey.endsWith('}');
      const actualSourceKey = isArrayMapping || isObjectMapping ? sourceKey.slice(1, -1) : sourceKey;

      if (type === 'creative') {
        value =
          config[actualSourceKey] !== undefined && config[actualSourceKey] !== null && config[actualSourceKey] !== ''
            ? config[actualSourceKey]
            : dsData[actualSourceKey] !== undefined &&
                dsData[actualSourceKey] !== null &&
                dsData[actualSourceKey] !== ''
              ? dsData[actualSourceKey]
              : common[actualSourceKey];
      } else {
        value =
          config[actualSourceKey] !== undefined && config[actualSourceKey] !== null
            ? config[actualSourceKey]
            : dsData[actualSourceKey] !== undefined && dsData[actualSourceKey] !== null
              ? dsData[actualSourceKey]
              : common[actualSourceKey] !== undefined && common[actualSourceKey] !== null
                ? common[actualSourceKey]
                : undefined;

        if (TikTokRequestMapper.targetingAttrs.includes(actualSourceKey)) {
          if (!value && common.targeting?.[actualSourceKey]) {
            value = common.targeting?.[actualSourceKey];
          }
          if (Array.isArray(value) && value.length) {
            if (typeof value[0] === 'object') {
              value = value?.map((item) => item.id || item.key);
            }
          } else if (typeof value === 'object') {
            value = value.id || value.key;
          }
        }
      }

      if (actualSourceKey === 'location_ids') {
        if (!value) value = [];
        ['districts', 'cities', 'regions', 'countries'].forEach((key) => {
          if (Array.isArray(config[key])) {
            value.push(...config[key].map((item) => item.id || item.key));
          } else if (Array.isArray(common.targeting?.[key])) {
            value.push(...common.targeting?.[key].map((item) => item.id || item.key));
          } else if (typeof config[key] === 'object') {
            value.push(config[key].id || config[key].key);
          }
        });
        if (!value.length) return mappedObject;
      }

      if (value !== undefined && value !== null) {
        if (isArrayMapping) {
          if (typeof value === 'string') {
            mappedObject[targetKey] = value.split(',').map((item) => item.trim());
          } else if (Array.isArray(value)) {
            mappedObject[targetKey] = value;
          } else {
            mappedObject[targetKey] = [value];
          }
        } else if (isObjectMapping) {
          if (typeof value === 'string') {
            mappedObject[targetKey] = JSON.parse(value);
          } else if (typeof value === 'object') {
            mappedObject[targetKey] = value;
          }
        } else {
          mappedObject[targetKey] = value;
        }
      }

      return mappedObject;
    }, {});

    if (attributes.location_ids) {
      delete attributes.cities;
      delete attributes.districts;
      delete attributes.regions;
      delete attributes.countries;
    }

    if (type === 'adgroup' && !attributes.actions) {
      attributes.actions = [
        {
          action_category_ids: attributes.action_category_ids,
          action_scene: attributes.action_scene,
          action_period: attributes.action_period,
          video_user_actions: attributes.video_user_actions,
        },
      ];

      delete attributes.video_user_actions;
      delete attributes.action_category_ids;
      delete attributes.action_scene;
      delete attributes.action_period;
    }

    if (attributes.actions) {
      attributes.actions = attributes.actions.filter(action => 
      action && ['action_category_ids', 'action_scene', 'action_period', 'video_user_actions']
        .every(target => action[target])
      );
      if(attributes.actions.length === 0) {
        delete attributes.actions;
      }     
    }

    if (type === 'adgroup' && attributes.saved_audience_id) {
      this.targetingAttrs.forEach((target) => {
        delete attributes[target];
      });
    }

    if (type == 'adgroup' && attributes.gender && Array.isArray(attributes.gender)) {
      const genderValue = attributes.gender;
      attributes['gender'] = genderValue.length > 1 ? 'GENDER_UNLIMITED' : genderValue[0];
    }

    return attributes;
  }

  static groupAndEnrichData(dsData, personalizedCreatives) {
    const groupedData = {};
    dsData?.forEach((item) => {
      const rowId = item.rowid;
      if (!groupedData[rowId]) groupedData[rowId] = {};
      groupedData[rowId].dsData = item;
    });

    personalizedCreatives?.forEach((item) => {
      const { dsRowIds } = item.creatives;
      dsRowIds.forEach((rowId) => {
        if (groupedData[rowId]) {
          groupedData[rowId].config = item.config;
          groupedData[rowId].creative = item.creatives;
        }
      });
    });
    return groupedData;
  }

  static map(data) {
    const groupedData = TikTokRequestMapper.groupAndEnrichData(data.dsData, data.personalizedCreatives);
    const campaign = TikTokRequestMapper.mapAttributes('campaign', {}, {}, data);
    campaign.adGroups = [];
    const adSetGroups = {};
    const uniqueAdSetNames = new Set();

    // Group by ad set names
    for (const [rowId, entry] of Object.entries(groupedData)) {
      const adSetName = entry.dsData.adgroup_name;
      if (!adSetGroups[adSetName]) {
        adSetGroups[adSetName] = {};
        uniqueAdSetNames.add(adSetName);
      }
      adSetGroups[adSetName][rowId] = entry;
    }

    let count = 0;

    // Process each ad set group
    for (const adSetName of uniqueAdSetNames) {
      const adSetEntries = adSetGroups[adSetName];
      const firstEntry = adSetEntries[Object.keys(adSetEntries)[0]];

      // Create ad group
      const adGroup = TikTokRequestMapper.mapAttributes('adgroup', firstEntry.dsData, firstEntry.config, data);
      adGroup.ads = [];
      campaign.adGroups.push(adGroup);
      count++;

      // Create ads for each entry in the ad set
      for (const [, entry] of Object.entries(adSetEntries)) {
        const ad = TikTokRequestMapper.mapAttributes('ad', entry.dsData, entry.creative, data);
        ad.creatives = [TikTokRequestMapper.mapAttributes('creative', entry.dsData, entry.creative, data)];
        adGroup.ads.push(ad);
      }
    }

    return { campaign: { tempCampaignId: campaign }, errors: {}, count };
  }
}
