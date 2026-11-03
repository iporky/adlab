/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

/**
 * Maps the campaign data to the required format.
 *
 * @param {Object} campaignData - The original campaign data.
 * @param {string} campaignData.id - The campaign ID.
 * @param {string} campaignData.ad_account_id - The ad account ID.
 * @param {number} [campaignData.dailyBudget] - The daily budget in standard units.
 * @param {string} [campaignData.end_time] - The end time of the campaign.
 * @param {string} campaignData.name - The name of the campaign.
 * @param {string} [campaignData.start_time] - The start time of the campaign.
 * @param {string} campaignData.status - The status of the campaign.
 * @param {number} [campaignData.lifetimeSpendCap] - The lifetime spend cap in standard units.
 * @param {string} [campaignData.iosAppId] - The iOS app ID.
 * @param {string} [campaignData.androidAppUrl] - The Android app URL.
 * @param {string} campaignData.objective - The objective of the campaign.
 * @param {string} campaignData.buyModel - The buy model of the campaign.
 * @param {boolean} [campaignData.restrictedDeliverySignals] - The restricted delivery signals flag.
 * @param {string} [campaignData.candidateBallotInformation] - The candidate ballot information.
 * @returns {Object} - The mapped campaign data.
 */

function mapCampaignData(campaignData) {
  return {
    id: campaignData.id,
    ad_account_id: campaignData.ad_account_id,
    daily_budget_micro: campaignData.dailyBudget ? campaignData.dailyBudget * 1000000 : undefined,
    end_time: campaignData.end_time ? new Date(campaignData.end_time) : undefined,
    name: campaignData.name,
    start_time: campaignData.start_time ? new Date(campaignData.start_time) : undefined,
    status: campaignData.status,
    lifetime_spend_cap_micro: campaignData.lifetimeSpendCap ? campaignData.lifetimeSpendCap * 1000000 : undefined,
    measurement_spec: {
      ios_app_id: campaignData.iosAppId,
      android_app_url: campaignData.androidAppUrl,
    },
    objective: campaignData.objective,
    buy_model: campaignData.buyModel,
    regulations: {
      restricted_delivery_signals: campaignData.restrictedDeliverySignals,
      candidate_ballot_information: campaignData.candidateBallotInformation,
    },
  };
}

function mapAdGroupData(params) {
  return {
    id: params.id,
    campaign_id: params.campaign_id,
    bid_micro: params.bid_micro,
    billing_event: params.billing_event,
    child_ad_type: params.child_ad_type || undefined,
    forced_view_setting: params.forced_view_setting || undefined,
    lifetime_budget_micro: params.lifetime_budget_micro,
    end_time: params.end_time,
    name: params.name,
    optimization_goal: params.optimization_goal,
    conversion_window: params.conversion_window || undefined,
    placement_v2: params.placement_v2,
    start_time: params.start_time,
    status: params.status || undefined,
    story_ad_creative_type: params.story_ad_creative_type || undefined,
    type: params.type,
    targeting: params.targeting,
    ad_scheduling_config: params.ad_scheduling_config || undefined,
    bid_strategy: params.bid_strategy,
    reach_and_frequency_status: params.reach_and_frequency_status,
    delivery_constraint: params.delivery_constraint,
    reach_goal: params.reach_goal,
    impression_goal: params.impression_goal,
    pacing_type: params.pacing_type || undefined,
  };
}

function mapMediaData(params) {
  return {
    name: params.name,
    type: params.type,
  };
}

function mapCreativeData(params) {
  const obj = {
    ad_account_id: params.ad_account_id,
    brand_name: params.brand_name,
    call_to_action: params.callToAction || undefined,
    headline: params.headline,
    shareable: params.shareable !== undefined ? params.shareable : true,
    name: params.name,
    top_snap_media_id: params.top_snap_media_id,
    top_snap_crop_position: params.topSnapCropPosition || 'OPTIMIZED',
    type: params.type,
    forced_view_eligibility: params.forcedViewEligibility || undefined,
    preview_creative_id: params.previewCreativeId || undefined,
    ad_product: params.adProduct || undefined,
    profile_properties: {
      profile_id: params.profile_properties.profile_id,
    },
    lead_generation_properties:
      params.type === 'LEAD_GENERATION' ? params.leadGenerationProperties || undefined : undefined,
    web_view_properties: params.type === 'WEB_VIEW' ? params.webViewProperties || undefined : undefined,
    app_install_properties: params.type === 'APP_INSTALL' ? params.appInstallProperties || undefined : undefined,
    deep_link_properties: params.type === 'DEEP_LINK' ? params.deepLinkProperties || undefined : undefined,
    ad_to_lens_properties: params.type === 'AD_TO_LENS' ? params.adToLensProperties || undefined : undefined,
    ad_to_call_properties: params.type === 'AD_TO_CALL' ? params.adToCallProperties || undefined : undefined,
    ad_to_message_properties: params.type === 'AD_TO_MESSAGE' ? params.adToMessageProperties || undefined : undefined,
  };

  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
  return obj;
}

function mapAdData(params) {
  const obj = {
    id: params.id,
    ad_squad_id: params.ad_squad_id,
    creative_id: params.creative_id,
    name: params.name,
    paying_advertiser_name: params.payingAdvertiserName || undefined, // Optional field
    review_status: undefined, // Read-only, should not be included
    review_status_reasons: undefined, // Read-only, should not be included
    status: params.status,
    type: params.type,
    delivery_status: undefined, // Read-only, should not be included
    deleted: undefined, // Read-only, should not be included
  };

  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
  return obj;
}

export { mapCampaignData, mapAdGroupData, mapMediaData, mapCreativeData, mapAdData };
