import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const adGroupSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'CampaignV2',
      required: true,
    },
    adGroupName: {
      type: String,
      required: true,
    },
    targeting: {
      type: Object,
      required: true,
    },
  },
  { strict: false },
);

export const AdGroupModel = db.model('AdGroupV2', adGroupSchema, 'adGroups_v2');
