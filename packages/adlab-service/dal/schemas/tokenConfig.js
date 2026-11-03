import { db } from '../../lib/drivers/database.js';
import * as Constants from '../../lib/constants.js';

const { Schema } = db;

const appSchema = new Schema(
  {
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String },
    authorizationCode: { type: String },
    refreshToken: { type: String },
    accessToken: { type: String },
    app_name: { type: String },
    identityId: { type: String },
  },
  { _id: false },
);

const tokenConfigSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      unique: true,
      enum: Constants.AVAILABLE_PLATFORMS,
    },
    xTFSAccountId: { type: String, required: true },
    adAccountId: { type: String, required: true },
    tokenUrl: { type: String },
    apiBaseUrl: { type: String },
    bypassJoiSchemaValidation: { type: Boolean, default: false },
    apps: [appSchema],
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: null },
  },
  { strict: false },
);

export const TokenConfigModel = db.model('tokens', tokenConfigSchema, 'token_configs');
