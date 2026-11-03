import { db } from '../../lib/drivers/database.js';
import * as Constants from '../../lib/constants.js';

export { validateDBObjectId, validateStringForNoSQLInjection } from '../../lib/util.js';

const { Schema } = db;

const campaignSchema = new Schema(
  {
    campaignName: String,
    platformCampaignId: { type: String, default: null },
    platform: {
      type: String,
      enum: Constants.AVAILABLE_PLATFORMS,
      required: true,
    },
    formDataId: {
      type: Schema.Types.ObjectId,
      ref: 'CampaignFormData',
      required: true,
    },
    status: {
      type: String,
      enum: Constants.AVAILABLE_STATUSES,
    },
    clientId: { type: String, required: true },
    accountId: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: null },
  },
  { strict: false }
);

export const CampaignModel = db.model('Campaign', campaignSchema, 'campaigns');
