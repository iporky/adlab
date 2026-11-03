/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';
import Joi from 'joi';

// Campaigns Schema
const campaignSchema = Joi.object({
  name: Joi.string().required().description('Campaign Name'),
  status: Joi.string().valid('ACTIVE', 'PAUSED').required(),
  ad_account_id: Joi.string().required(),
  daily_budget_micro: Joi.number().optional(),
  lifetime_spend_cap_micro: Joi.number().optional(),
  start_time: Joi.date().iso().min('now').required(),
  end_time: Joi.date().iso().min('now').required(),
  buy_model: Joi.string().valid('AUCTION', 'RESERVED').optional(),
  objective: Joi.string()
    .valid(
      'BRAND_AWARENESS',
      'APP_CONVERSION',
      'APP_INSTALL',
      'CATALOG_SALES',
      'ENGAGEMENT',
      'LEAD_GENERATION',
      'VIDEO_VIEW',
      'WEB_CONVERSION',
      'PROMOTE_STORIES',
      'PROMOTE_PLACES',
    )
    .optional(),
  promotion_type: Joi.string().optional().description('NEED TO RESEARCH'),
  measurement_spec: Joi.object({
    ios_app_id: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('The IOS App Id is not valid. It needs to adhere to this Regex: [0-9]+')
      .optional(),
    android_app_url: Joi.string()
      .pattern(/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/)
      .message(
        'The Android App URL is not valid. It needs to adhere to this Regex: ^[a-zA-Z][a-zA-Z0-9_]*(\\.[a-zA-Z][a-zA-Z0-9_]*)+$',
      )
      .optional(),
  }).optional(),
  regulations: Joi.object({
    restricted_delivery_signals: Joi.boolean().optional(),
  }).optional(),
});

// Update Campaign Schema
const updateCampaignSchema = campaignSchema
  .fork(
    ['name', 'status'], // Fields to be required
    (field) => field.required(),
  )
  .fork(
    ['daily_budget_micro', 'lifetime_spend_cap_micro', 'start_time', 'end_time'], // Fields to be optional
    (field) => field.optional(),
  )
  .keys({
    id: Joi.string().required().description('Campaign ID'),
  });

export { campaignSchema, updateCampaignSchema };
