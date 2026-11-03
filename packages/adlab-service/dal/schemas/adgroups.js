import { db } from '../../lib/drivers/database.js';
import * as Constants from '../../lib/constants.js';

export { validateDBObjectId } from '../../lib/util.js';

const { Schema } = db;

const adGroupSchema = new Schema(
  {
    adGroupName: String,
    platformAdGroupId: { type: String, default: null },
    status: {
      type: String,
      enum: Constants.AVAILABLE_STATUSES,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    platformCampaignId: {
      type: String,
      ref: 'Campaign.platformId',
      required: true,
    },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: null },
  },
  { strict: false },
);

export const AdGroupModel = db.model('AdGroup', adGroupSchema, 'ad_groups');
