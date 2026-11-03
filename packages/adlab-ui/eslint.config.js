import globals from 'globals';
import pluginJs from '@eslint/js';
import jest from 'eslint-plugin-jest';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintPrettierConfig from 'eslint-config-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    ignores: [
      '**/*.config.{js,mjs,cjs}',
      'public/**',
      'dist/**',
      'test-results/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'config/**',
    ],
  },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        global: 'readonly',
      },
    },
  },
  { languageOptions: { ecmaVersion: 'latest' } },
  pluginJs.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      'react-hooks': reactHooksPlugin,
      import: eslintPluginImport,
    },
  },
  pluginReactConfig,
  jsxA11y.flatConfigs.recommended,
  eslintPrettierConfig,
  {
    files: ['test/**'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Packages `react` related packages come first.
            ['^react', '^prop-types', '^@?\\w'],
            // Side effect imports.
            ['^\\u0000'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css|scss)$'],
          ],
        },
      ],
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'keyword-spacing': [
        'error',
        {
          after: true,
        },
      ],
      'no-console': 2,
      'no-multi-spaces': 'error',
      semi: ['error', 'always'],
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/label-has-associated-control': [
        2,
        {
          controlComponents: ['TextField'],
        },
      ],
      'react/prop-types': 1,
      'import/no-extraneous-dependencies': 0,
      'import/no-named-as-default': 0,
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'import/extensions': [
        'error',
        'never',
        {
          js: 'never',
          jsx: 'never',
        },
      ],
      'react/no-did-update-set-state': 0,
      'react/destructuring-assignment': 0,
      'react/forbid-prop-types': 0,
      'react/jsx-boolean-value': 0,
      'class-methods-use-this': 0,
      'import/named': 0,
      'no-param-reassign': 0,
      'default-param-last': 0,
      'no-use-before-define': [2, { variables: false }],
      'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
      'react/no-unstable-nested-components': [2, { allowAsProps: true }],
      'react/function-component-definition': [
        2,
        {
          namedComponents: ['arrow-function', 'function-declaration'],
          unnamedComponents: 'arrow-function',
        },
      ],
      'function-paren-newline': 0,
      'no-unsafe-optional-chaining': [2, { disallowArithmeticOperators: false }],
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
