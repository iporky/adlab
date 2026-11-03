import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const creativeSchema = new Schema(
  {
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: 'MediaV2',
      required: true,
    },
    type: { type: String, required: true },
    heading: String,
    description: String,
  },
  { _id: false },
);

const adSchema = new Schema(
  {
    adGroupIdId: {
      type: Schema.Types.ObjectId,
      ref: 'AdGroupV2',
      required: true,
    },
    adName: {
      type: String,
    },
    targeting: {
      type: Object,
      required: true,
    },
    integrationType: {
      type: String,
    },
    integrationTag: {
      type: String,
    },
    personalizationDataId: {
      type: Schema.Types.ObjectId,
      ref: 'PersonalizationDataV2',
      required: true,
    },
    creatives: [creativeSchema]
  },
  { strict: false },
);

export const AdModel = db.model('AdV2', adSchema, 'ads_v2');
