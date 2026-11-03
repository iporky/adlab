import { db } from '../../../lib/drivers/database.js';
import * as constants from '../../../lib/campaignConstants.js';
export { validateDBObjectId, validateStringForNoSQLInjection } from '../../../lib/util.js';

const CampaignObjective = Object.keys(constants.CAMPAIGN_OBJECTIVE);
const CampaignGoalType = Array.from(new Set(Object.values(constants.CAMPAIGN_GOALS).flat()));
const CampaignStatus = constants.CAMPAIGN_STATUS;
const CampaignType = Object.values(constants.CAMPAIGN_TYPES);
const CampaignFormat = Object.values(constants.CAMPAIGN_FORMATS);
const { Schema } = db;

const budgetSchema = new Schema(
  {
    budgetType: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    pacing: String,
  },
  { _id: false }
);

const campaignSchema = new Schema(
  {
    campaignName: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(CampaignStatus),
      default: CampaignStatus.DRAFT,
    },
    objective: {
      type: String,
      enum: Object.values(CampaignObjective),
      default: CampaignObjective.AWARENESS,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: budgetSchema,
    tags: { type: [String], default: [] },
    goals: {
      type: [String],
      enum: Object.values(CampaignGoalType),
      default: [],
    },
    campaignType: { type: String, required: true, enum: CampaignType },
    campaignFormat: { type: String, required: true, enum: CampaignFormat },
    targetingIds: {
      type: [Schema.Types.ObjectId],
      ref: 'TargetingV2',
      default: [],
    },
    platformCampaigns: {
      type: [Schema.Types.ObjectId],
      ref: 'PlatformCampaignV2',
      default: [],
    },
    clientId: { type: String, required: true },
    accountId: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: Date.now },
  },
  { strict: false }
);

// Indexes for efficient queries
campaignSchema.index({ clientId: 1, accountId: 1 });
campaignSchema.index({ platforms: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdOn: -1 });

// Update timestamps on modification
campaignSchema.pre('save', function (next) {
  if (this.updatedBy) {
    this.updatedOn = Date.now();
  }
  next();
});

export const CampaignModel = db.model('CampaignV2', campaignSchema, 'campaigns_v2');
