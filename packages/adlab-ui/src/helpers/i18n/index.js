/**
 * Internationalization support module
 * @module helpers/i18n
 */
/* eslint-disable no-undef */
import { utils } from 'adlab-shared';
import { capitalize, isObject, keys, startCase } from 'lodash';
import Polyglot from 'node-polyglot';

import constants from '../../lib/constants';

import en from './lang/en';
import { checkLangPackKeyConsistency, getTranslationsForLocale } from './lang';

const {
  localeUtils: { supportedFormats, getFormattedDateForLocale, getFormattedCurrencyForLocale },
} = utils;
/**
 * Singleton i18n access object. Used by I18N class for translation
 * @type {{}}
 */
let i18n = {};
let lang;
let locale;

/**
 * The map stores 'en' object as {[value]: key} to do a reverse lookup of key by value.
 * This map is used by t to look for the actual key with value allowing developers to
 * do i18n.key<alias for en>.<key from en module> as get <key from en module> as string.
 * eg: i18n.key.your_homepage => 'your_homepage'
 * Benefits,
 * 1. Static key lookup.
 * 2. Prevents typos.
 * 3. Prevents redundant values with different keys.
 * @type {{}}
 */
const reverseENKeyMap = keys(en).reduce((acc, key) => {
  if (keys(acc).includes(en[key])) {
    //eslint-disable-next-line no-console
    console.error(`
      Redundant key with same value ${en[key]} found in lang module 'en'.
      Keys [${[key, acc[en[key]]]}] have same values. This will impact with I18N key lookup.
      `);
  }
  return {
    ...acc,
    [en[key]]: key,
  };
}, {});

/**
 * Internationalization wrapper class for Polyglot.
 * Abstracts implementation and exposes translate function
 */
class I18N {
  init = (opts) => {
    lang = opts.lang;
    locale = opts.locale;
    i18n[lang] = new Polyglot({
      phrases: opts.translations,
      interpolation: { prefix: '{', suffix: '}' },
    });
  };
}

/**
 * Formats given value based on provided format based on current locale.
 * @param value
 * @param type
 * @returns {string}
 */
const formatValueForLocale = ({ value, format, options = {} }) => {
  if (format === supportedFormats.DATE) {
    return getFormattedDateForLocale(value, locale);
  }
  if (format === supportedFormats.CURRENCY) {
    return getFormattedCurrencyForLocale({ value, code: options.code }, locale);
  }
  if (format === supportedFormats.NUMBER) {
    return new Intl.NumberFormat(locale).format(value);
  }
  return value;
};
/**
 *
 * The main translate function of I18n. Gets the key and preprocess replacement keys for locale based formatting,
 * passes to polyglot for replacements and returns the string after postprocessing for given text options.
 * @param key
 * @param replacements
 * @param options
 * @returns {*|ZodString|string|string}
 */
const translate = (key, replacements = {}, options = {}) => {
  const preprocessedReplacements = keys(replacements).reduce(
    (acc, repKey) => ({
      ...acc,
      [repKey]: replacements[repKey],
      /* complex value override */
      ...(isObject(replacements[repKey]) && {
        [repKey]: formatValueForLocale(replacements[repKey]),
      }),
    }),
    {},
  );

  const translation = i18n[lang].t(reverseENKeyMap[key], preprocessedReplacements);
  if (translation) {
    if (options.capitalize) {
      return capitalize(translation);
    }
    if (options.startCase) {
      return startCase(translation);
    }
    if (options.upperCase) {
      return translation.toUpperCase();
    }
    if (options.lowerCase) {
      return translation.toLowerCase();
    }
    return translation;
  }
  return key;
};

const getBrowserLocale = () => window.navigator.language || window.browserLanguage || window.userLanguage;

const initiateI18N = (forcedLocale, reduxCallback) =>
  new Promise((resolve, reject) => {
    try {
      if (process.env.NODE_ENV !== constants.PRODUCTION_ENV) {
        checkLangPackKeyConsistency();
      }
      const chosenLocale = forcedLocale || getBrowserLocale();
      getTranslationsForLocale(chosenLocale).then(([locale, lang, translations]) => {
        new I18N().init({
          lang,
          locale,
          translations,
        });
        reduxCallback && reduxCallback({ lang, locale });
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });

const isI18NInitialized = () => !!lang && !!i18n[lang] && reverseENKeyMap && keys(reverseENKeyMap).length > 0;
const getCurrentLang = () => lang;
const getCurrentLocale = () => locale;

export default {
  initiateI18N,
  t: translate,
  keys: en,
  formats: supportedFormats,
  formatValueForLocale,
  isI18NInitialized,
  /**
   * @Deprecated - Do not invoke this directly. Use initiateI18N function instead.
   * @returns {I18N}
   */
  get _i18n() {
    return I18N;
  },
  getCurrentLang,
  getCurrentLocale,
};
