import _ from 'lodash';

import { IMAGE_FORMATS } from '../lib/constants';

export const isImageUrl = (url) => {
  if (!_.isString(url)) return false;
  const ext = url.split('.').pop().split('?')[0].toLowerCase();
  return IMAGE_FORMATS.includes(ext);
};

/**
 * Normalizes API response data to ensure consistent array format
 * @param {*} data - The data to normalize
 * @returns {Array} - Array of { name, value } objects
 */
export const normalizeToArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (_.isObject(data)) {
    return Object.entries(data).map(([value, name]) => ({ name, value }));
  }
  return [];
};

/**
 * Normalizes categorized data (object of objects/arrays) to consistent format
 * @param {Object} data - The categorized data to normalize
 * @returns {Object} - Object with each category as an array of { name, value } objects
 */
export const normalizeCategorizedData = (data) => {
  if (!_.isObject(data)) return {};

  const result = {};
  Object.entries(data).forEach(([category, items]) => {
    result[category] = normalizeToArray(items);
  });
  return result;
};

/**
 * Generic transformer for categorized data with flexible mapping
 * @param {Object} data - The data to transform
 * @param {Function} mapFunction - Function to map items (defaults to value/name mapping)
 * @returns {Object} - Transformed data with arrays
 */
export const transformCategorizedData = (data, mapFunction = null) => {
  if (!_.isObject(data)) return {};

  const result = {};
  Object.entries(data).forEach(([category, items]) => {
    if (Array.isArray(items)) {
      result[category] = items;
    } else if (_.isObject(items)) {
      if (mapFunction) {
        result[category] = mapFunction(items);
      } else {
        // Default: map entries to { value, name } objects
        result[category] = Object.entries(items).map(([value, name]) => ({ value, name }));
      }
    }
  });
  return result;
};

/**
 * Transforms currency/group data for dropdown usage
 * @param {Object} data - The data to transform
 * @returns {Object} - Transformed data with arrays of { value, name } objects
 */
export const transformCurrencyOptions = (data) => {
  return transformCategorizedData(data);
};

/**
 * Transforms objective types data to consistent format
 * @param {Object} data - The objective types data
 * @returns {Object} - Transformed data with arrays of { name, value } objects
 */
export const transformObjectiveTypes = (data) => {
  return transformCategorizedData(data, (items) => Object.entries(items).map(([value, name]) => ({ name, value })));
};

/**
 * Transforms objective goals data to consistent format
 * @param {Object} data - The objective goals data
 * @returns {Object} - Transformed data with arrays of goal values
 */
export const transformObjectiveGoals = (data) => {
  return transformCategorizedData(data, (items) => Object.values(items));
};

/**
 * Common styles for tag/chip selection components
 */
export const getTagSelectionStyles = (tokens) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: tokens.spacingVerticalL,
  },
  header: {
    height: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    rowGap: tokens.spacingVerticalS,
  },
  error: {
    padding: tokens.spacingVerticalM,
    color: tokens.colorPaletteRedForeground1,
  },
});

/**
 * Get standard tag styles for selection state
 */
export const getTagStyles = (isSelected, tokens) => ({
  cursor: 'pointer',
  minWidth: '120px',
  height: '32px',
  background: '#FFFFFF80',
  border: '1px solid #FFFFFF',
  marginRight: tokens.spacingHorizontalXS,
  textAlign: 'center',
  fontWeight: isSelected ? 'bold' : 'normal',
  ...(isSelected && {
    backgroundColor: '#4F3ED71A',
    border: '1px solid #222AE5',
    color: '#202224',
  }),
});

/**
 * Creates a toggle handler for array-based selection
 */
export const createToggleHandler = (selectedItems, setSelectedItems, onChange) => {
  return (value) => {
    const newSelected = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
    setSelectedItems(newSelected);
    onChange?.(newSelected);
  };
};

/**
 * Creates a category-based toggle handler for object selection
 */
export const createCategoryToggleHandler = (selectedValues, setSelectedValues, onChange) => {
  return (category, value) => {
    setSelectedValues((prev) => {
      const currentSelected = prev[category] || [];
      const newSelected = currentSelected.includes(value)
        ? currentSelected.filter((v) => v !== value)
        : [...currentSelected, value];

      const newSelectedValues = {
        ...prev,
        [category]: newSelected,
      };

      if (newSelected.length === 0) {
        delete newSelectedValues[category];
      }

      onChange?.(newSelectedValues);
      return newSelectedValues;
    });
  };
};

/** * Safely retrieves a value from an object using a path array
 * @param {Object} obj - The object to search
 * @param {Array} pathArray - Array of keys representing the path
 * @returns {*} - The value at the specified path, or undefined if not found
 */
export const getValueByPath = (obj, pathArray) => {
  return pathArray.reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key];
    }
    return undefined;
  }, obj);
};

/**
 * Finds all occurrences of a pattern in a JSON object
 * @param {Object} template - The template object to search
 * @param {Object} obj - The JSON object to search
 * @param {Array} path - Current path in the object (used for recursion)
 * @returns {Array} - Array of objects with path and value of matches
 */
export const extractMacrosFromJSON = (template, obj, path = []) => {
  const results = [];
  const regex = /{{\s*([^}]+?)\s*}}/g;

  for (const key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (typeof value === 'string') {
      let match;
      while ((match = regex.exec(value)) !== null) {
        results.push({
          name: match[1].trim(),
          type: getValueByPath(template, [...currentPath.slice(0, currentPath.length - 5), 'type']) || 'text',
          width:
            getValueByPath(template, [...currentPath.slice(0, currentPath.length - 2), 'dimensions', 'width']) || 0,
          height:
            getValueByPath(template, [...currentPath.slice(0, currentPath.length - 2), 'dimensions', 'height']) || 0,
          values: [],
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      results.push(...extractMacrosFromJSON(template, value, currentPath));
    }
  }

  return results;
};

/**
 * Calculates metrics for combinations array
 * @param {Array} combinations - Array of combination objects
 * @returns {Object} - Object with total, duplicates, and uniqueKeys counts
 */
export const calculateCombinationMetrics = (combinations) => {
  const totalCombinations = combinations.length;
  
  const duplicates = [];
  const seen = new Map();
  
  combinations.forEach((combination, index) => {
    const key = JSON.stringify({
      key: combination.key,
      mapping: combination.mapping,
      persona: combination.persona
    });
    
    if (seen.has(key)) {
      duplicates.push(index);
      if (!duplicates.includes(seen.get(key))) {
        duplicates.push(seen.get(key));
      }
    } else {
      seen.set(key, index);
    }
  });

  const uniqueKeys = new Set(combinations.map(c => c.key)).size;
  
  return {
    total: totalCombinations,
    duplicates: duplicates.length,
    uniqueKeys
  };
};

/**
 * Checks if a combination at a given index is a duplicate of any later combination
 * @param {Array} combinations - Array of combination objects
 * @param {number} index - Index of the combination to check
 * @returns {boolean} - True if the combination is a duplicate
 */
export const isCombinationDuplicate = (combinations, index) => {
  if (!combinations || index >= combinations.length) return false;
  
  const current = combinations[index];
  if (!current) return false;
  
  const currentKey = JSON.stringify({
    key: current.key,
    mapping: current.mapping,
    persona: current.persona
  });
  
  return combinations.some((other, otherIndex) => {
    if (otherIndex <= index) return false;
    const otherKey = JSON.stringify({
      key: other.key,
      mapping: other.mapping,
      persona: other.persona
    });
    return currentKey === otherKey;
  });
};
