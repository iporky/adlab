import mongoose from 'mongoose';
import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const matrixDataSchema = new Schema(
  {
    personaConfigId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'PersonaConfigV2',
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    format: {
      type: String,
      required: true,
      enum: ['Excel'],
      default: 'Excel',
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
  }
);

// Index for efficient queries
matrixDataSchema.index({ personaConfigId: 1 });
matrixDataSchema.index({ createdOn: -1 });

// Update timestamps on modification
matrixDataSchema.pre('save', function (next) {
  if (this.updatedBy) {
    this.updatedOn = Date.now();
  }
  next();
});

export const MatrixDataModel = mongoose.model('MatrixDataV2', matrixDataSchema, 'matrix_data_v2');
