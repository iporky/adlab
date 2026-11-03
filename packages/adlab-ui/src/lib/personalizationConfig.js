/**
 * Personalization Configuration & Preset Helpers
 */

import { DEFAULT_PERSONALIZATION_FIELDS } from './personalizationConstants';

export const PERSONALIZATION_CONFIG = {
  maxCombinationsLimit: 100,
  defaultBatchSize: 25,
  supportedOperators: ['equals', 'not_equals', 'in', 'not_in', 'greater_than', 'less_than'],
  defaultDimensions: DEFAULT_PERSONALIZATION_FIELDS,
  matrixExportFormats: ['csv', 'xlsx', 'json'],
};

export const getDimensionByName = (dimensionName) => {
  return DEFAULT_PERSONALIZATION_FIELDS.find(
    (field) => field.name.toLowerCase() === (dimensionName || '').toLowerCase()
  );
};

export default PERSONALIZATION_CONFIG;
