import mongoose from 'mongoose';
import { TEMPLATE_STATUS, DAYS_OF_WEEK, OPERATING_SYSTEM } from '../../../lib/targetingConstants.js';
import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const macroSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['image', 'text', 'video'],
    },
    url: {
      type: String,
      required: true,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
  },
  { _id: false }
);

const templateSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    macros: [macroSchema],
  },
  { _id: false }
);

const combinationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      default: function () {
        return `default-product-${Date.now()}`;
      },
    },
    mapping: {
      type: Schema.Types.Mixed,
      required: true,
    },
    persona: [
      {
        type: Schema.Types.Mixed,
        default: {},
      },
    ],
  },
  { _id: false, strict: false }
);

const personaConfigSchema = new Schema(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CampaignV2',
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TEMPLATE_STATUS),
      default: TEMPLATE_STATUS.DRAFT,
    },
    template: {
      type: templateSchema,
      required: true,
    },
    combinations: {
      type: [combinationSchema],
      default: [],
    },
    clientId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    updatedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    strict: false,
  }
);

// Indexes for efficient queries
personaConfigSchema.index({ clientId: 1, accountId: 1 });
personaConfigSchema.index({ campaignId: 1 });
personaConfigSchema.index({ createdOn: -1 });

// Update timestamps on modification
personaConfigSchema.pre('save', function (next) {
  if (this.updatedBy) {
    this.updatedOn = Date.now();
  }
  next();
});

// Auto-generate combination IDs if not provided
personaConfigSchema.pre('save', function (next) {
  if (!this.combinations) {
    this.combinations = [];
  }
  this.combinations.forEach((combination) => {
    if (!combination.id) {
      combination.id = new mongoose.Types.ObjectId().toString();
    }
  });
  next();
});

export const PersonaConfigModel = mongoose.model('PersonaConfigV2', personaConfigSchema, 'persona_config_v2');
