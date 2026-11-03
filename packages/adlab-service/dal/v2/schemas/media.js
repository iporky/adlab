import { db } from '../../../lib/drivers/database.js';
import { AD_PLATFORM } from '../../../lib/constants.js';

const { Schema } = db;

const platformMediaSchema = new Schema(
  {
    platform: {
      type: String,
      enum: Object.keys(AD_PLATFORM),
      required: true,
    },
    mediaId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const mediaSchema = new Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    platformMediaIds: [platformMediaSchema],
  },
  { strict: false },
);

export const MediaModel = db.model('MediaV2', mediaSchema, 'media_v2');
