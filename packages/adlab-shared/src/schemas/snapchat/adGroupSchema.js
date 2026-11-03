/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';
import { targetingSchema } from './targetingSchema.js';
import { adSchedulingConfigSchema } from './adSchedulingConfigSchema.js';

// Define the placement_v2 schema
const placementV2Schema = Joi.object({
  config: Joi.string().valid('AUTOMATIC', 'CUSTOM').required(),
  platforms: Joi.array().items(Joi.string().valid('SNAPCHAT')).when('config', {
    is: 'CUSTOM',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  snapchat_positions: Joi.array()
    .items(
      Joi.string().valid(
        'INTERSTITIAL_USER',
        'INTERSTITIAL_CONTENT',
        'INTERSTITIAL_SPOTLIGHT',
        'INSTREAM',
        'PUBLIC_STORIES_INSTREAM',
        'FEED',
        'LENS',
        'POST_CAPTURE_CAROUSEL',
      ),
    )
    .when('config', {
      is: 'CUSTOM',
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  inclusion: Joi.object({
    content_types: Joi.array().optional(),
    premium_content_bundle_ids: Joi.array().items(Joi.string().guid()).optional(),
    creator_content_types: Joi.array().optional(),
  }).optional(),
  exclusion: Joi.object({
    content_types: Joi.array().optional(),
    creator_content_types: Joi.array().optional(),
  }).optional(),
}).custom((value, helpers) => {
  if (value.inclusion && value.exclusion) {
    const inclusionTypes = value.inclusion.content_types || [];
    const exclusionTypes = value.exclusion.content_types || [];
    const intersection = inclusionTypes.filter((type) => exclusionTypes.includes(type));
    if (intersection.length > 0) {
      return helpers.message('Inclusion and exclusion content types must be mutually exclusive');
    }
  }
  return value;
});

// AdGroup Schema
const adGroupSchema = Joi.object({
  name: Joi.string().required().description('AdGroup Name'),
  campaign_id: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'PAUSED').required(),
  delivery_constraint: Joi.string().valid('DAILY_BUDGET', 'LIFETIME_BUDGET', 'REACH_AND_FREQUENCY').required(),
  daily_budget_micro: Joi.number().integer().min(5000000).label('Daily Budget Micro'),
  lifetime_budget_micro: Joi.number().integer().min(5000000).label('Lifetime Budget Micro'),
  start_time: Joi.date().iso().min('now').required(),
  end_time: Joi.date().iso().min('now').optional(),
  ad_scheduling_config: adSchedulingConfigSchema.optional(),
  cap_and_exclusion_config: Joi.any().optional(),
  placement_v2: placementV2Schema.optional(),
  optimization_goal: Joi.string()
    .valid(
      'IMPRESSIONS',
      'SWIPES',
      'APP_INSTALLS',
      'VIDEO_VIEWS',
      'VIDEO_VIEWS_15_SEC',
      'USES',
      'STORY_OPENS',
      'PIXEL_PAGE_VIEW',
      'PIXEL_ADD_TO_CART',
      'PIXEL_PURCHASE',
      'PIXEL_SIGNUP',
      'APP_ADD_TO_CART',
      'APP_PURCHASE',
      'APP_SIGNUP',
      'APP_REENGAGE_OPEN',
      'APP_REENGAGE_PURCHASE',
      'LEAD_FORM_SUBMISSIONS',
    )
    .required(),
  bid_strategy: Joi.string().valid('AUTO_BID', 'LOWEST_COST_WITH_MAX_BID', 'MIN_ROAS', 'TARGET_COST').required(),
  bid_micro: Joi.number().when('bid_strategy', {
    is: 'AUTO_BID',
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  pacing_type: Joi.string().valid('STANDARD', 'ACCELERATED').optional(),
  measurement_provider_names: Joi.string().valid('MOAT_SS', 'DOUBLEVERIFY').optional(),
  pixel_id: Joi.string().optional(),
  targeting: targetingSchema.optional(),
  billing_event: Joi.string().valid('IMPRESSION').required(),
  child_ad_type: Joi.string()
    .valid(
      'SNAP_AD',
      'LONGFORM_VIDEO',
      'APP_INSTALL',
      'REMOTE_WEBPAGE',
      'DEEP_LINK',
      'STORY',
      'AD_TO_LENS',
      'AD_TO_CALL',
      'AD_TO_MESSAGE',
      'FILTER',
      'LENS',
      'LENS_WEB_VIEW',
      'LENS_APP_INSTALL',
      'LENS_DEEP_LINK',
      'LENS_LONGFORM_VIDEO',
      'COLLECTION',
    )
    .optional(),
  forced_view_setting: Joi.string().valid('FULL_DURATION', 'SIX_SECONDS').optional(),
  conversion_window: Joi.string().valid('SWIPE_28DAY_VIEW_1DAY', 'SWIPE_7DAY').optional(),
  type: Joi.string().valid('SNAP_ADS', 'LENS', 'FILTER').required(),
})
  .xor('daily_budget_micro', 'lifetime_budget_micro')
  .custom((value, helpers) => {
    if (value.pacing_type === 'ACCELERATED') {
      if (value.bid_strategy !== 'LOWEST_COST_WITH_MAX_BID') {
        return helpers.message('bid_strategy must be set to LOWEST_COST_WITH_MAX_BID when pacing_type is ACCELERATED');
      }
      if (!value.bid_micro) {
        return helpers.message('bid_micro must be set when pacing_type is ACCELERATED');
      }
      const validGoals = ['IMPRESSIONS', 'USES', 'SWIPES', 'VIDEO_VIEWS', 'VIDEO_VIEWS_15_SEC', 'STORY_OPENS'];
      if (!validGoals.includes(value.optimization_goal)) {
        return helpers.message(
          'optimization_goal must be one of IMPRESSIONS, USES, SWIPES, VIDEO_VIEWS, VIDEO_VIEWS_15_SEC, or STORY_OPENS when pacing_type is ACCELERATED',
        );
      }
    }

    // Additional validation for optimization goals
    const pixelGoals = ['PIXEL_ADD_TO_CART', 'PIXEL_PURCHASE', 'PIXEL_SIGNUP'];
    const appGoals = ['APP_ADD_TO_CART', 'APP_PURCHASE', 'APP_SIGNUP'];
    const reengageGoals = ['APP_REENGAGE_OPEN', 'APP_REENGAGE_PURCHASE'];

    if (pixelGoals.includes(value.optimization_goal) || appGoals.includes(value.optimization_goal)) {
      if (!value.pixel_id) {
        return helpers.message(
          `pixel_id must be set when optimization_goal is one of ${pixelGoals.concat(appGoals).join(', ')}`,
        );
      }
    }

    if (reengageGoals.includes(value.optimization_goal)) {
      if (!value.targeting || !value.targeting.app_install_state) {
        return helpers.message(
          `targeting.app_install_state must be set when optimization_goal is one of ${reengageGoals.join(', ')}`,
        );
      }
    }

    return value;
  });

// AdGroup Schema for Update
const updateAdGroupSchema = adGroupSchema.keys({
  id: Joi.string().required().description('AdGroup ID'),
});

export { adGroupSchema, updateAdGroupSchema };
