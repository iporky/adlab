/**
 * Formats a string from SNAKE_CASE to Title Case format
 * @param {string} name - The string to format
 * @returns {string} The formatted string
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};