import { defineConfig } from 'stylelint-define-config';
import OnlyLowerCaseHexColorsConfig from './config/247-stylelint/only-lowercase-hex-config.mjs';

export default defineConfig({
  extends: ['stylelint-config-recommended', 'stylelint-config-standard-scss'],
  customSyntax: '@stylelint/postcss-css-in-js',
  plugins: [OnlyLowerCaseHexColorsConfig],
  rules: {
    'declaration-property-unit-allowed-list': {
      '/^height/': ['%', 'px', 'vh'],
      '/^width/': ['%', 'px', 'vw'],
    },
    'unit-allowed-list': ['%', 'px', 'vh', 'vw'],
    'scss/operator-no-unspaced': null,
    'scss/operator-no-newline-after': null,
    'color-named': 'never',
    'color-hex-length': 'long',
    '247-styles/color-only-valid-lowercase-hex': true,
  },
});
