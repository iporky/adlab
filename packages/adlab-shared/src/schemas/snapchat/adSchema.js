/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';

// Ads Schema
const adSchema = Joi.object({
  ad_squad_id: Joi.string().required().description('Ad Squad ID'),
  creative_id: Joi.string().required().description('Creative ID'),
  name: Joi.string().required().description('Ad Name'),
  status: Joi.string().valid('ACTIVE', 'PAUSED').required(),
  type: Joi.string()
    .valid(
      'SNAP_AD',
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
      'COLLECTION',
      'LEAD_GENERATION',
    )
    .required(),
});

// Ads Schema for Update
const updateAdSchema = adSchema.keys({
  id: Joi.string().required().description('Ad ID'),
});

export { adSchema, updateAdSchema };
