import { db } from '../../lib/drivers/database.js';

const { Schema } = db;

const campaignFormDataSchema = new Schema(
  {
    data: { type: Object, required: true },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: null },
  },
  { strict: false },
);

export const CampaignFormDataModel = db.model('CampaignFormData', campaignFormDataSchema, 'campaign_form_data');
