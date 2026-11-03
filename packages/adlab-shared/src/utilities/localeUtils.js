export const supportedFormats = {
  NUMBER: 'number',
  CURRENCY: 'currency',
  DATE: 'date',
};

/**
 * Get formatted date for locale. Default locale is 'en-US'.
 * @param date
 * @param locale
 * @returns {string}
 */
export const getFormattedDateForLocale = (date, locale = 'en-US') =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

/**
 * @typedef {Object} Currency
 * @property {string} code - The currency code.
 * @property {number} value - The currency value.
 */

/**
 * Get formatted currency for locale. Default locale is 'en-US'.
 * @param {Currency} currency
 * @param {string} [locale='en-US']
 * @returns {string}
 */
export const getFormattedCurrencyForLocale = (currency, locale = 'en-US') =>
  new Intl.NumberFormat(locale, {
    style: supportedFormats.CURRENCY,
    currency: currency.code,
  }).format(currency.value);
