import { db } from '../../../lib/drivers/database.js';
import { AD_PLATFORM } from '../../../lib/constants.js';
import { CAMPAIGN_STATUS } from '../../../lib/campaignConstants.js';

const { Schema } = db;

const platformCampaignSchema = new Schema(
  {
    platform: {
      type: String,
      enum: Object.keys(AD_PLATFORM),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CAMPAIGN_STATUS),
      default: CAMPAIGN_STATUS.DRAFT,
    },
    extPlatformCampaignId: {
      type: String,
      required: true,
    },
    platformConfig: {
      type: Object,
      required: true,
    },
  },
  { strict: false },
);

export const PlatformCampaignModel = db.model('PlatformCampaignV2', platformCampaignSchema, 'platformCampaigns_v2');
