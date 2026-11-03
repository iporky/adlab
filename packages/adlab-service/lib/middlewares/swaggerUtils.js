import * as Constants from '../constants.js';
import { AVAILABLE_CAMPAIGN_TYPES } from '../campaignConstants.js';
import { AVAILABLE_TARGETING_TYPES } from '../targetingConstants.js';

export const checkForDefinitionPathConflicts = (swaggerObject) => {
  const definitionsSet = new Set();
  const pathsSet = new Set();

  // Handle both OpenAPI 2.0 (definitions) and 3.0.0 (components.schemas)
  const definitions = swaggerObject.definitions || (swaggerObject.components && swaggerObject.components.schemas) || {};

  Object.keys(definitions).forEach((sdVal) => {
    if (definitionsSet.has(sdVal)) {
      throw new Error(`Definitions conflict: ${sdVal}`);
    } else {
      definitionsSet.add(sdVal);
    }
  });

  // Handle paths if they exist
  const paths = swaggerObject.paths || {};

  Object.keys(paths).forEach((sdVal) => {
    if (pathsSet.has(sdVal)) {
      throw new Error(`Paths conflict: ${sdVal}`);
    } else {
      pathsSet.add(sdVal);
    }
  });
};

export const commonConfig = {
  securityDefinitions: {
    authToken: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Requests should pass Authorization Bearer token in header.',
    },
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'x-tfs-service-api-key',
      description: 'Requests should pass api key in x-tfs-service-api-key header.',
    },
  },
  security: [
    {
      authToken: [],
    },
    {
      apiKey: [],
    },
  ],
  parameters: {
    clientId: {
      name: Constants.X_TFS_CLIENT_ID,
      description: 'client identifier',
      in: 'header',
      required: true,
      type: 'string',
    },
    accountId: {
      name: Constants.X_TFS_ACCOUNT_ID,
      description: 'account identifier',
      in: 'header',
      required: true,
      type: 'string',
    },
    userId: {
      name: Constants.X_TFS_USER_ID,
      description: 'user identifier',
      in: 'header',
      required: true,
      type: 'string',
    },
    serviceApiKey: {
      name: Constants.X_TFS_SERVICE_API_KEY,
      description: 'service api key',
      in: 'header',
      required: true,
      type: 'string',
    },
    platformInQuery: {
      name: 'platform',
      description: 'platform',
      in: 'query',
      required: true,
      type: 'string',
      enum: Constants.AVAILABLE_PLATFORMS,
    },
    platformInPath: {
      name: 'platform',
      description: 'platform',
      in: 'path',
      required: true,
      type: 'string',
      enum: Constants.AVAILABLE_PLATFORMS,
    },
    draftModeInQuery: {
      name: 'draftMode',
      description: 'Is request in draft mode',
      in: 'query',
      required: false,
      type: 'boolean',
    },
    targetingType: {
      name: 'targetingType',
      description: 'Targeting type',
      in: 'path',
      required: true,
      type: 'string',
      enum: AVAILABLE_TARGETING_TYPES,
    },
    campaignType: {
      name: 'campaignType',
      description: 'Campaign type',
      in: 'path',
      required: true,
      type: 'string',
      enum: AVAILABLE_CAMPAIGN_TYPES,
    },
  },
  definitions: {
    PlatformEnum: {
      type: 'string',
      enum: Constants.AVAILABLE_PLATFORMS,
    },
  },
};
