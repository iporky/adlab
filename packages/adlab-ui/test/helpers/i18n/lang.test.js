import { checkLangPackKeyConsistency, supportedLocales } from '../../../src/helpers/i18n/lang';

describe('checkLangPackKeyConsistency', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('should not print warnings when all language packs have the same keys', () => {
    checkLangPackKeyConsistency();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test('should print warnings when a language pack is missing keys', () => {
    // Temporarily delete a key from a language pack
    const temp = supportedLocales.es.your_homepage;
    delete supportedLocales.es.your_homepage;

    checkLangPackKeyConsistency();
    const errorMessages = consoleErrorSpy.mock.calls.map((call) => call[0]).join('\n');
    expect(errorMessages.includes('WARNING: I18N lang pack keys inconsistencies detected.')).toBeTruthy();
    expect(errorMessages.includes("Missing keys in 'es': [your_homepage]")).toBeTruthy();
    expect(errorMessages.includes('Language pack key inconsistencies will cause application issues!.')).toBeTruthy();

    // Restore the deleted key
    supportedLocales.es.your_homepage = temp;
  });

  test('should handle gracefully when "en" language pack is missing', () => {
    // Temporarily delete the 'en' language pack
    const tempEn = supportedLocales.en;
    delete supportedLocales.en;

    expect(() => checkLangPackKeyConsistency()).not.toThrow();

    // Restore the 'en' language pack
    supportedLocales.en = tempEn;
  });
});
