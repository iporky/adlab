import { db } from '../../../lib/drivers/database.js';
import { AD_PLATFORM, AVAILABLE_STATUSES } from '../../../lib/constants.js';

const { Schema } = db;

const platformAdSchema = new Schema(
  {
    platform: {
      type: String,
      enum: Object.keys(AD_PLATFORM),
      required: true,
    },
    adId: {
      type: Schema.Types.ObjectId,
      ref: 'AdV2',
      required: true,
    },
    platformAdGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'PlatformAdGroupV2',
      required: true,
    },
    platformCampaignId: {
      type: Schema.Types.ObjectId,
      ref: 'PlatformCampaignV2',
      required: true,
    },
    status: {
      type: String,
      enum: AVAILABLE_STATUSES,
    },
    platformConfig: {
      type: Object,
      required: true,
    },
  },
  { strict: false },
);

export const PlatformAdGroupModel = db.model('PlatformAdV2', platformAdSchema, 'platformAds_v2');
