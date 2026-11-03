/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Joi from 'joi';

export const mediaSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  type: Joi.string().valid('VIDEO', 'IMAGE', 'LENS_PACKAGE').required(),
  ad_account_id: Joi.string().required().label('Ad Account ID'),
});

export const mediaValidationSchema = Joi.object({
  mediaType: Joi.string()
    .valid(
      'Top Snap',
      'Long form video',
      'Top Snap Image',
      'App Icon (Snap Ads)',
      'App Icon (Lens)',
      'Preview Image',
      'Logo Image',
      'Audience Filter',
    )
    .required(),

  dimensions: Joi.string()
    .required()
    .pattern(/^\d+x\d+$/)
    .when('mediaType', {
      is: Joi.valid('Top Snap', 'Top Snap Image'),
      then: Joi.string().custom((value, helpers) => {
        const [width, height] = value.split('x').map(Number);
        if (width < 1080 || height < 1920) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Minimum dimensions validation'),
    })
    .when('mediaType', {
      is: 'App Icon (Snap Ads)',
      then: Joi.string().custom((value, helpers) => {
        const [width, height] = value.split('x').map(Number);
        if (width !== height || width < 200 || width > 2000) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Aspect ratio and size validation'),
    })
    .when('mediaType', {
      is: 'App Icon (Lens)',
      then: Joi.string()
        .pattern(/^\d+x\d+$/)
        .valid('256x256'),
    })
    .when('mediaType', {
      is: 'Preview Image',
      then: Joi.string().custom((value, helpers) => {
        const [width, height] = value.split('x').map(Number);
        if (width / height !== 3 / 5 || width < 360 || height < 600) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Aspect ratio and size validation'),
    })
    .when('mediaType', {
      is: 'Logo Image',
      then: Joi.string()
        .pattern(/^\d+x\d+$/)
        .valid('993x284'),
    })
    .when('mediaType', {
      is: 'Audience Filter',
      then: Joi.string()
        .pattern(/^\d+x\d+$/)
        .valid('1080x2340'),
    }),

  size: Joi.number()
    .required()
    .when('mediaType', {
      is: 'Top Snap',
      then: Joi.number().max(1024 * 1024 * 1024),
    })
    .when('mediaType', {
      is: 'Top Snap Image',
      then: Joi.number().max(5 * 1024 * 1024),
    })
    .when('mediaType', {
      is: 'Preview Image',
      then: Joi.number().max(2 * 1024 * 1024),
    })
    .when('mediaType', {
      is: 'Logo Image',
      then: Joi.number().max(2 * 1024 * 1024),
    })
    .when('mediaType', {
      is: 'Audience Filter',
      then: Joi.number().max(300 * 1024),
    }),

  fileType: Joi.string()
    .valid('png', 'jpeg', 'mov', 'mp4')
    .required()
    .when('mediaType', {
      is: 'Top Snap',
      then: Joi.string().valid('mov', 'mp4'),
    })
    .when('mediaType', {
      is: 'Top Snap Image',
      then: Joi.string().valid('png', 'jpeg'),
    })
    .when('mediaType', {
      is: 'App Icon (Snap Ads)',
      then: Joi.string().valid('png'),
    })
    .when('mediaType', {
      is: 'App Icon (Lens)',
      then: Joi.string().valid('png'),
    })
    .when('mediaType', {
      is: 'Preview Image',
      then: Joi.string().valid('png'),
    })
    .when('mediaType', {
      is: 'Logo Image',
      then: Joi.string().valid('png'),
    })
    .when('mediaType', {
      is: 'Audience Filter',
      then: Joi.string().valid('png'),
    }),

  duration: Joi.number()
    .when('mediaType', {
      is: 'Top Snap',
      then: Joi.number().min(3).max(180),
    })
    .when('mediaType', {
      is: 'Long form video',
      then: Joi.number().min(15),
    }),
});
