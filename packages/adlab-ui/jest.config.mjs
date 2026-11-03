/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  bail: 1,
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''], // for msw node environment support
  },
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.js', 'jest-extended'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            jsx: true,
            syntax: 'ecmascript',
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
          target: 'es2022',
        },
        isModule: true,
      },
    ],
  },
  moduleNameMapper: {
    '^adlab-shared$': '<rootDir>/../adlab-shared/src/index.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/fileTransform.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/config/jest/cssTransform.js',
  },
  testMatch: ['<rootDir>/test/**/*.test.{js,jsx}'],
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/test',
    '<rootDir>/e2e',
    '<rootDir>/public',
    '<rootDir>/config',
    '<rootDir>/src/features/demos',
  ],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 85,
      lines: 95,
    },
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
