import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const personalizationDataSchema = new Schema(
  {
    data: {
      type: Object,
      required: true,
    },
  },
  { strict: false },
);

export const PersonalizationDataModel = db.model(
  'PersonalizationDataV2',
  personalizationDataSchema,
  'personalizationData_v2',
);
