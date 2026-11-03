import { db } from '../../../lib/drivers/database.js';
import { AD_PLATFORM, AVAILABLE_STATUSES } from '../../../lib/constants.js';

const { Schema } = db;

const platformAdGroupSchema = new Schema(
  {
    platform: {
      type: String,
      enum: Object.keys(AD_PLATFORM),
      required: true,
    },
    adGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'AdGroupV2',
      required: true,
    },
    platformCampaignId: {
      type: Schema.Types.ObjectId,
      ref: 'PlatformCampaignV2',
      required: true,
    },
    extPlatformAdGroupId: {
      type: String,
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

export const PlatformAdGroupModel = db.model('PlatformAdGroupV2', platformAdGroupSchema, 'platformAdGroups_v2');
