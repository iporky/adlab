import { db } from '../../../lib/drivers/database.js';

const { Schema, Types } = db;

const personaDataSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId, // UUID string
      required: true,
    },
    personaConfigId: {
      type: Types.ObjectId,
      required: true,
      ref: 'PersonaConfig',
      index: true,
    },
    data: {
      type: Object,
      required: true,
    },
    campaignId: {
      type: Types.ObjectId,
      required: true,
      ref: 'campaign',
      index: true,
    },
    format: {
      type: String,
      enum: ['xls', 'json'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    strict: false
  }
);

// Single-field index
personaDataSchema.index({ personaConfigId: 1 });

// Compound unique index to prevent duplicate persona data for same config
personaDataSchema.index(
  { personaConfigId: 1, _hash: 1 },
  { unique: true }
);
export const PersonaDataModel = db.model(
  'PersonaDataV2',      // Model name
  personaDataSchema,    // Schema
  'personaData_v2'      // Collection name in MongoDB
);
