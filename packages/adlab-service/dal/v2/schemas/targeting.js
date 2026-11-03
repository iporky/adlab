import { db } from '../../../lib/drivers/database.js';
import * as constants from '../../../lib/targetingConstants.js';
import { AVAILABLE_PLATFORMS } from '../../../lib/campaignConstants.js';
export { validateDBObjectId, validateStringForNoSQLInjection } from '../../../lib/util.js';

const { Schema } = db;

// Sub-schemas
const demographicsSchema = new Schema(
  {
    age: {
      type: [String],
      enum: Object.keys(constants.AGE).filter((key) => key !== 'AGE_65_PLUS'),
      default: [],
    },
    gender: {
      type: [String],
      enum: Object.values(constants.DEMOGRAPHIC.GENDER),
      default: [],
    },
    income: {
      type: [String],
      enum: Object.values(constants.DEMOGRAPHIC.INCOME),
      default: [],
    },
  },
  { _id: false }
);

const geoSchema = new Schema(
  {
    countries: {
      type: [String],
      default: [],
    },
    cities: {
      type: [String],
      default: [],
    },
    radius: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const audiencesSchema = new Schema(
  {
    interests: {
      type: [String],
      enum: [
        ...Object.values(constants.INTEREST.CONSUMER),
        ...Object.values(constants.INTEREST.LIFESTYLE),
        ...Object.values(constants.INTEREST.PROFESSIONAL),
        ...Object.values(constants.INTEREST.CULTURAL),
      ],
      default: [],
    },
    behaviors: {
      type: [String],
      enum: Object.values(constants.AUDIENCE_GROUP.BEHAVIOR),
      default: [],
    },
    customSegments: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const brandSafetySchema = new Schema(
  {
    contentCategories: {
      type: [String],
      enum: Object.values(constants.BRAND_SAFETY.CONTENT),
      default: [],
    },
    riskLevel: {
      type: String,
      enum: Object.values(constants.BRAND_SAFETY_LEVEL),
      default: constants.BRAND_SAFETY_LEVEL.MODERATE,
    },
    excludedTopics: {
      type: [String],
      enum: Object.values(constants.EXCLUDED_CONTENT_CATEGORY),
      default: [],
    },
  },
  { _id: false }
);

const placementsSchema = new Schema(
  {
    positions: {
      type: [String],
      enum: [
        ...Object.values(constants.VIDEO_PLACEMENT.STREAM),
        ...Object.values(constants.VIDEO_PLACEMENT.PLACEMENT),
        ...Object.values(constants.NATIVE_PLACEMENT.CONTENT),
        ...Object.values(constants.NATIVE_PLACEMENT.DISPLAY),
      ],
      default: [],
    },
    devices: {
      type: [String],
      enum: Object.values(constants.DEVICE_TYPE),
      default: [],
    },
    platforms: {
      type: [String],
      enum: Object.values(constants.OPERATING_SYSTEM),
      default: [],
    },
  },
  { _id: false }
);

const frequencySchema = new Schema(
  {
    cap: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ['DAY', 'WEEK', 'MONTH'],
      required: true,
    },
  },
  { _id: false }
);

const timingSchema = new Schema(
  {
    dayParting: {
      type: [String],
      enum: [...Object.values(constants.DAY_PART), ...Object.values(constants.WEEK_PART)],
      default: [],
    },
    frequency: {
      type: frequencySchema,
      default: null,
    },
  },
  { _id: false }
);

const targetingSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CampaignV2',
    },
    platform: {
      type: String,
      required: true,
      enum: Object.values(AVAILABLE_PLATFORMS),
    },
    demographics: {
      type: demographicsSchema,
      default: () => ({}),
    },
    geo: {
      type: geoSchema,
      default: () => ({}),
    },
    audiences: {
      type: audiencesSchema,
      default: () => ({}),
    },
    brandSafety: {
      type: brandSafetySchema,
      default: () => ({}),
    },
    placements: {
      type: placementsSchema,
      default: () => ({}),
    },
    timing: {
      type: timingSchema,
      default: () => ({}),
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
targetingSchema.index({ clientId: 1, accountId: 1 });
targetingSchema.index({ campaignId: 1 });
targetingSchema.index({ platform: 1 });
targetingSchema.index({ createdOn: -1 });

// Update timestamps on modification
targetingSchema.pre('save', function (next) {
  if (this.updatedBy) {
    this.updatedOn = Date.now();
  }
  next();
});

export const TargetingModel = db.model('TargetingV2', targetingSchema, 'targetings_v2');
