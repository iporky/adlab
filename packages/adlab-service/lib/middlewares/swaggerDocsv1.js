import extend from 'extend';
import { fileURLToPath } from 'url';
import path from 'path';
import { checkForDefinitionPathConflicts, commonConfig } from './swaggerUtils.js';
import { loadJSON } from '../util.js';

const permissionsSwaggerDoc = loadJSON('../api/v1/permissions.json');
const adsSwaggerDoc = loadJSON('../api/v1/ads.json');
const legacyAPIsSwaggerDoc = loadJSON('../api/v1/legacyAPIs.json');
const targetingsSwaggerDoc = loadJSON('../api/v1/targetings.json');
const previewSwaggerDoc = loadJSON('../api/v1/preview.json');
const validationsSwaggerDoc = loadJSON('../api/v1/validations.json');
const metricsSwaggerDoc = loadJSON('../api/v1/metrics.json');
const tokensSwaggerDoc = loadJSON('../api/v1/tokens.json');
const audienceSwaggerDoc = loadJSON('../api/v1/audience.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const exportConfig = () => {
  const docsV1 = [
    permissionsSwaggerDoc,
    adsSwaggerDoc,
    legacyAPIsSwaggerDoc,
    targetingsSwaggerDoc,
    previewSwaggerDoc,
    validationsSwaggerDoc,
    metricsSwaggerDoc,
    tokensSwaggerDoc,
    audienceSwaggerDoc,
  ];

  docsV1.forEach((doc) => {
    checkForDefinitionPathConflicts(doc);
  });

  const mergedSwaggerDocsV1 = extend(true, {}, ...docsV1, {
    info: {
      title: 'adlab',
    },
    ...commonConfig,
  });

  return {
    docs: mergedSwaggerDocsV1,
    pathToControllers: `${__dirname}/../../controllers/v1`,
  };
};
