import { isEmpty, isNil, keys } from 'lodash';

import en from './en';
import es from './es';
import fr from './fr';

export const supportedLocales = {
  en: en,
  es: es,
  fr: fr,
};

/*eslint-disable no-console*/
export const checkLangPackKeyConsistency = () => {
  const enKeys = keys(supportedLocales.en);
  let isKeysMissingWarningPrinted = false;
  keys(supportedLocales)
    .filter((lang) => lang !== 'en')
    .forEach((lang) => {
      const missingKeys = enKeys.filter((key) => !keys(supportedLocales[lang]).includes(key));
      if (!isEmpty(missingKeys)) {
        if (!isKeysMissingWarningPrinted) {
          console.error('WARNING: I18N lang pack keys inconsistencies detected.');
          isKeysMissingWarningPrinted = true;
          console.group();
        }
        console.error(`Missing keys in '${lang}': [${missingKeys.join(', ')}]`);
      }
    });
  console.groupEnd();
  if (isKeysMissingWarningPrinted) {
    console.error('Language pack key inconsistencies will cause application issues!.');
  }
};
/**
 * Convert en-US to en-us and split the language code 'en'.
 * @param locale
 * @returns {string}
 */
const normalizeLocaleCode = (locale) => locale.replace('_', '-').toLowerCase().split('-')[0];

/**
 * dynamically import a language pack module based on the provided locale.
 * @param locale
 * @param fallback
 * @returns {Promise<*>}
 */
export const getTranslationsForLocale = async (locale, fallback = 'en-US') => {
  let validLocale = locale;

  if (isNil(locale) || !keys(supportedLocales).includes(normalizeLocaleCode(locale))) {
    validLocale = fallback;
  }
  const validLocaleLang = normalizeLocaleCode(validLocale);
  const translations = supportedLocales[validLocaleLang];

  return [validLocale, validLocaleLang, translations];
};
