/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';

const callToActionSchema = Joi.string().valid(
  'BOOK_NOW',
  'DONATE',
  'DOWNLOAD',
  'GET_NOW',
  'INSTALL_NOW',
  'ORDER_NOW',
  'PLAY',
  'SHOP_NOW',
  'SIGN_UP',
  'TRY',
  'USE_APP',
  'WATCH',
  'VOTE',
  'DIRECTIONS',
  'PLAY_GAME',
);

export const creativeSchema = Joi.object({
  ad_account_id: Joi.string().required().label('Ad Account ID'),
  brand_name: Joi.string().max(32).required().label('Brand Name'),
  call_to_action: Joi.alternatives()
    .conditional('type', {
      switch: [
        { is: 'APP_INSTALL', then: callToActionSchema.required() },
        { is: 'LENS_APP_INSTALL', then: callToActionSchema.required() },
        { is: 'DEEP_LINK', then: callToActionSchema.required() },
        { is: 'LEAD_GENERATION', then: callToActionSchema.required() },
        { is: 'LENS_DEEP_LINK', then: callToActionSchema.required() },
        { is: 'WEB_VIEW', then: callToActionSchema.required() },
        { is: 'LENS_WEB_VIEW', then: callToActionSchema.required() },
        {
          is: 'AD_TO_LENS',
          then: Joi.string().valid('PLAY', 'TRY', 'SHOP_NOW', 'VOTE').required(),
        },
        {
          is: 'AD_TO_MESSAGE',
          then: Joi.string().valid('MESSAGE_NOW', 'OPEN_APP').required(),
        },
        {
          is: 'AD_TO_CALL',
          then: Joi.string().valid('CALL_NOW', 'OPEN_APP').required(),
        },
      ],
      otherwise: Joi.string().optional(),
    })
    .label('Call to Action'),
  headline: Joi.string().max(34).required().label('Headline'),
  shareable: Joi.boolean().optional().default(true).label('Shareable'),
  name: Joi.string().max(375).required().label('Creative Name'),
  top_snap_media_id: Joi.string().required().label('Top Snap Media ID'),
  top_snap_crop_position: Joi.string()
    .valid('OPTIMIZED', 'MIDDLE', 'TOP', 'BOTTOM')
    .optional()
    .default('OPTIMIZED')
    .label('Top Snap Crop Position'),
  type: Joi.string()
    .valid(
      'SNAP_AD',
      'APP_INSTALL',
      'WEB_VIEW',
      'DEEP_LINK',
      'AD_TO_LENS',
      'AD_TO_CALL',
      'AD_TO_MESSAGE',
      'PREVIEW',
      'COMPOSITE',
      'LENS',
      'LENS_WEB_VIEW',
      'LENS_APP_INSTALL',
      'LENS_DEEP_LINK',
      'COLLECTION',
      'LEAD_GENERATION',
    )
    .required()
    .label('Creative Type'),
  forced_view_eligibility: Joi.string()
    .valid('FULL_DURATION', 'SIX_SECONDS', 'NONE')
    .optional()
    .label('Forced View Eligibility'),
  preview_creative_id: Joi.alternatives().conditional('type', {
    is: 'COMPOSITE',
    then: Joi.string().required().label('Preview Creative ID (Required for Story Ads)'),
  }),
  ad_product: Joi.alternatives().conditional('type', {
    is: Joi.valid('SNAP_AD', 'LENS', 'FILTER'),
    then: Joi.string().optional().label('Ad Product'),
    otherwise: Joi.forbidden(),
  }),
  profile_properties: Joi.object({
    profile_id: Joi.string()
      .guid({ version: ['uuidv4'] })
      .required()
      .label('Profile ID'),
  })
    .required()
    .label('Profile Properties'),
  lead_generation_properties: Joi.alternatives().conditional('type', {
    is: 'LEAD_GENERATION',
    then: Joi.object({
      form_id: Joi.string().required().label('Lead Generation Form ID'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  web_view_properties: Joi.alternatives().conditional('type', {
    is: 'WEB_VIEW',
    then: Joi.object({
      url: Joi.string().uri().required().label('Web View URL'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  app_install_properties: Joi.alternatives().conditional('type', {
    is: 'APP_INSTALL',
    then: Joi.object({
      app_id: Joi.string().required().label('App ID'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  deep_link_properties: Joi.alternatives().conditional('type', {
    is: 'DEEP_LINK',
    then: Joi.object({
      url: Joi.string().uri().required().label('Deep Link URL'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  ad_to_lens_properties: Joi.alternatives().conditional('type', {
    is: 'AD_TO_LENS',
    then: Joi.object({
      lens_id: Joi.string().required().label('Lens ID'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  ad_to_call_properties: Joi.alternatives().conditional('type', {
    is: 'AD_TO_CALL',
    then: Joi.object({
      phone_number: Joi.string().required().label('Phone Number'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
  ad_to_message_properties: Joi.alternatives().conditional('type', {
    is: 'AD_TO_MESSAGE',
    then: Joi.object({
      message: Joi.string().required().label('Message'),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
});
