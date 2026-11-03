import i18n from '../../../src/helpers/i18n';
import { supportedLocales } from '../../../src/helpers/i18n/lang';
import en from '../../../src/helpers/i18n/lang/en';
import es from '../../../src/helpers/i18n/lang/es';

jest.mock('../../../src/helpers/i18n/lang/en', () => ({
  __esModule: true, // this property makes it work
  default: {
    your_homepage: 'your homepage',
    your_homepage_duplicate: 'your homepage',
    campaigns_count_message: 'you have {smart_count} active campaign. |||| you have {smart_count} active campaigns.',
    active_campaign_budget_msg: 'you have an active campaign budget of {total}.',
    // Add other keys as needed
  },
}));

describe('i18n tests', () => {
  describe('initiateI18N tests', function () {
    afterAll(() => {
      i18n.initiateI18N('en-US');
    });

    test('reverseENKeyMap throws redundant key warning on module load.', async () => {
      jest.resetModules();
      jest.spyOn(console, 'error').mockImplementation(() => {});
      await import('../../../src/helpers/i18n');
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith(`
      Redundant key with same value your homepage found in lang module 'en'.
      Keys [your_homepage_duplicate,your_homepage] have same values. This will impact with I18N key lookup.
      `);
      // eslint-disable-next-line no-console
      console.error.mockRestore();
    });

    test('initiateI18N initializes i18n correctly', async () => {
      await i18n.initiateI18N();
      expect(i18n.isI18NInitialized()).toBe(true);
      expect(i18n.getCurrentLang()).toBe('en');
      expect(i18n.getCurrentLocale()).toBe('en-US');
    });

    test('initiateI18N initializes given locale to override browser locale', async () => {
      await i18n.initiateI18N('fr_FR');
      expect(i18n.isI18NInitialized()).toBe(true);
      expect(i18n.getCurrentLang()).toBe('fr');
      expect(i18n.getCurrentLocale()).toBe('fr_FR');
    });

    test('initiateI18N initializes fallback locale if incorrect locale is supplied', async () => {
      await i18n.initiateI18N('pz_QR');
      expect(i18n.isI18NInitialized()).toBe(true);
      expect(i18n.getCurrentLang()).toBe('en');
      expect(i18n.getCurrentLocale()).toBe('en-US');
    });

    test('isI18NInitialized returns correct status', () => {
      expect(i18n.isI18NInitialized()).toBe(true);
    });

    test('I18n provides override to init locale.', async () => {
      await i18n.initiateI18N('fr_FR');
      expect(i18n.getCurrentLang()).toBe('fr');
      new i18n._i18n().init({
        lang: 'en',
        locale: 'en-US',
        translations: supportedLocales.en,
      });
      expect(i18n.getCurrentLang()).toBe('en');
    });
  });

  describe(`'t' tests`, function () {
    afterAll(() => {
      i18n.initiateI18N('en-US');
    });
    test('t returns incorrect keys as is', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const translation = i18n.t('key_no_in_lang_file');
      expect(translation).toBe('key_no_in_lang_file');
      // eslint-disable-next-line no-console
      console.error.mockRestore();
    });

    test('t translates keys correctly', () => {
      const translation = i18n.t(i18n.keys.your_homepage);
      expect(translation).toBe(en.your_homepage);
    });

    test('t interpolates substitutions correctly', () => {
      const translation = i18n.t(i18n.keys.active_campaign_budget_msg, {
        total: {
          value: 1000,
          format: i18n.formats.CURRENCY,
          options: { code: 'USD' },
        },
      });
      expect(translation).toBe(en.active_campaign_budget_msg.replace('{total}', '$1,000.00'));
    });

    test('t handles pluralization correctly', () => {
      let translation = i18n.t(i18n.keys.campaigns_count_message, {
        smart_count: 1,
      });
      expect(translation).toBe('you have 1 active campaign.');

      translation = i18n.t(i18n.keys.campaigns_count_message, {
        smart_count: 3,
      });
      expect(translation).toBe('you have 3 active campaigns.');
    });

    test('t handles text decorations correctly', () => {
      let translation = i18n.t(i18n.keys.your_homepage, null, {
        upperCase: true,
      });
      expect(translation).toBe(en.your_homepage.toUpperCase());

      translation = i18n.t(i18n.keys.your_homepage, null, { lowerCase: true });
      expect(translation).toBe(en.your_homepage.toLowerCase());

      translation = i18n.t(i18n.keys.your_homepage, null, { capitalize: true });
      expect(translation).toBe(en.your_homepage.charAt(0).toUpperCase() + en.your_homepage.slice(1));

      translation = i18n.t(i18n.keys.your_homepage, null, { startCase: true });
      expect(translation).toBe('Your Homepage');
    });

    test('t returns correct translation for given locale', async () => {
      await i18n.initiateI18N('es_ES');
      const translation = i18n.t(i18n.keys.your_homepage);
      expect(translation).toBe(es.your_homepage);
    });
  });

  describe('formatValueForLocale', function () {
    afterAll(() => {
      i18n.initiateI18N('en-US');
    });
    test('formatValueForLocale formats values correctly', () => {
      const formattedValue = i18n.formatValueForLocale({
        value: 1000,
        format: i18n.formats.NUMBER,
      });
      expect(formattedValue).toBe('1,000');
    });
    test('formatValueForLocale formats currency correctly', () => {
      const formattedValue = i18n.formatValueForLocale({
        value: 1000,
        format: i18n.formats.CURRENCY,
        options: { code: 'USD' },
      });
      expect(formattedValue).toBe('$1,000.00');
    });
    test('formatValueForLocale formats date correctly', () => {
      const formattedValue = i18n.formatValueForLocale({
        value: new Date('2021-07-01'),
        format: i18n.formats.DATE,
      });
      expect(formattedValue).toBe(
        // eslint-disable-next-line no-undef
        Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date('2021-07-01')),
      );
    });
    test('formatValueForLocale returns value as is for unknown format', () => {
      const formattedValue = i18n.formatValueForLocale({
        value: 1000,
        format: 'unknown',
      });
      expect(formattedValue).toBe(1000);
    });
  });

  test('formats contains correct formats', () => {
    expect(i18n.formats).toEqual({
      NUMBER: 'number',
      CURRENCY: 'currency',
      DATE: 'date',
    });
  });
});
