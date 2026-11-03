import { db } from '../../../lib/drivers/database.js';

const { Schema } = db;

const lineItemConfigSchema = new Schema(
  {
    data: {
      type: Object,
      required: true,
    },
  },
  { strict: false },
);

export const LineItemConfigModel = db.model(
  'LineItemConfigV2',
  lineItemConfigSchema,
  'lineItemConfig_v2',
);
