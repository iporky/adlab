/**
 * Utility functions for handling dates in the application
 * Helps with serialization/deserialization of dates for Redux
 */

/**
 * Serializes a date object to ISO string format for Redux storage
 * @param {Date|null} date - Date object to serialize
 * @returns {string|null} - ISO string representation or null
 */
export const serializeDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

/**
 * Deserializes an ISO string date from Redux store to a Date object
 * @param {string|null} dateString - ISO string date
 * @returns {Date|null} - Date object or null
 */
export const deserializeDate = (dateString) => {
  if (dateString && typeof dateString === 'string') {
    return new Date(dateString);
  }
  return dateString;
};
