/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';

const hourSchema = Joi.array().items(Joi.number().integer().min(0).max(23)).min(1);

export const adSchedulingConfigSchema = Joi.object({
  monday: Joi.object({ hour_of_day: hourSchema }).optional(),
  tuesday: Joi.object({ hour_of_day: hourSchema }).optional(),
  wednesday: Joi.object({ hour_of_day: hourSchema }).optional(),
  thursday: Joi.object({ hour_of_day: hourSchema }).optional(),
  friday: Joi.object({ hour_of_day: hourSchema }).optional(),
  saturday: Joi.object({ hour_of_day: hourSchema }).optional(),
  sunday: Joi.object({ hour_of_day: hourSchema }).optional(),
}).min(1);
