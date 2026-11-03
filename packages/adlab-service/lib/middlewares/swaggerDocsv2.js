import extend from 'extend';
import { fileURLToPath } from 'url';
import path from 'path';
import { checkForDefinitionPathConflicts, commonConfig } from './swaggerUtils.js';
import { loadJSON } from '../util.js';

const targetingSwaggerDoc = loadJSON('../api/v2/targetings.json');
const targetingTypeSwaggerDoc = loadJSON('../api/v2/targetingTypes.json');
const campaignTypeSwaggerDoc = loadJSON('../api/v2/campaignTypes.json');
const campaignSwaggerDoc = loadJSON('../api/v2/campaigns.json');
const personaConfigSwaggerDoc = loadJSON('../api/v2/personaConfig.json');
const matrixDataSwaggerDoc = loadJSON('../api/v2/matrixData.json');
const personaDataSwaggerDoc = loadJSON('../api/v2/personaData.json');
const advportalAssetSwaggerDoc = loadJSON('../api/v2/advportalAsset.json');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const exportConfig = () => {
  const docsV2 = [
    campaignSwaggerDoc,
    campaignTypeSwaggerDoc,
    targetingSwaggerDoc,
    targetingTypeSwaggerDoc,
    personaConfigSwaggerDoc,
    matrixDataSwaggerDoc,
    personaDataSwaggerDoc,
    advportalAssetSwaggerDoc,
  ];

  docsV2.forEach((doc) => {
    checkForDefinitionPathConflicts(doc);
  });

  const mergedSwaggerDocsV2 = extend(true, {}, ...docsV2, {
    info: {
      title: 'adlabv2',
    },
    ...commonConfig,
  });

  return {
    docs: mergedSwaggerDocsV2,
    pathToControllers: `${__dirname}/../../controllers/v2`,
  };
};
