/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';

export const targetingSchema = Joi.object({
  geos: Joi.array()
    .items(
      Joi.object({
        country_code: Joi.string().length(2).uppercase().required(),
        operation: Joi.string().valid('include', 'exclude').optional(),
        region_id: Joi.array().items(Joi.string()).optional(),
        metro_id: Joi.array().items(Joi.string()).optional(),
        postal_code: Joi.array().items(Joi.string()).optional(),
      }).oxor('region_id', 'metro_id', 'postal_code'),
    )
    .optional(),
  demographics: Joi.array()
    .items(
      Joi.object({
        age_groups: Joi.array().items(Joi.string()).optional(),
        min_age: Joi.number().optional(),
        max_age: Joi.number().optional(),
        gender: Joi.string().valid('MALE', 'FEMALE').optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        advanced_demographics: Joi.array().items(Joi.string()).optional(),
      }),
    )
    .optional(),
  devices: Joi.array()
    .items(
      Joi.object({
        os_type: Joi.string().valid('iOS', 'ANDROID').optional(),
        os_version_min: Joi.string().optional(),
        os_version_max: Joi.string().optional(),
        connection_type: Joi.string().valid('WIFI', 'CELL').optional(),
        carrier_id: Joi.array().items(Joi.string()).optional(),
        marketing_name: Joi.array().items(Joi.string()).optional(),
      }),
    )
    .optional(),
  interests: Joi.array()
    .items(
      Joi.object({
        category_id: Joi.array().items(Joi.string()).optional(),
        operation: Joi.string().valid('include', 'exclude').optional(),
      }),
    )
    .optional(),
  segments: Joi.array()
    .items(
      Joi.object({
        segment_id: Joi.array().items(Joi.string()).optional(),
        operation: Joi.string().valid('include', 'exclude').optional(),
      }),
    )
    .optional(),
  locations: Joi.array()
    .items(
      Joi.object({
        location_type: Joi.array().items(Joi.string()).optional(),
        proximity_unit: Joi.string().valid('MILES', 'KILOMETERS').optional(),
        proximity: Joi.number().optional(),
        circles: Joi.array()
          .items(
            Joi.object({
              latitude: Joi.number().required(),
              longitude: Joi.number().required(),
              radius: Joi.number().required(),
              unit: Joi.string().valid('MILES', 'KILOMETERS').optional(),
            }),
          )
          .optional(),
        operation: Joi.string().valid('include', 'exclude').optional(),
      }),
    )
    .optional(),
  app_install_states: Joi.array()
    .items(
      Joi.object({
        state: Joi.string().valid('INSTALLED', 'NOT_INSTALLED').required(),
        snap_app_ids: Joi.array().items(Joi.string()).optional(),
      }),
    )
    .optional(),
  product_audiences: Joi.array()
    .items(
      Joi.object({
        product_set: Joi.string().required(),
        event_type: Joi.string().valid('PAGE_VIEW', 'ADD_CART', 'VIEW_CONTENT', 'PURCHASE').required(),
        retention_seconds: Joi.number().required(),
        operation: Joi.string().valid('include', 'exclude').optional(),
      }),
    )
    .optional(),
  regulated_content: Joi.boolean().optional(),
});
