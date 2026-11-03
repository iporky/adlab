import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import i18n from '../../src/helpers/i18n';
import { TextDecoder, TextEncoder } from 'util';

i18n.initiateI18N('en-US').then(() => {
  console.log(`----> i18n initialized with default locale 'en-US' <---- `);
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

window.ResizeObserver = require('resize-observer-polyfill');

global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeGlobalMocks = new Promise((resolve) => {
  jest.mock('../../src/helpers/authN', () => ({
    oktaAuth: {
      getAccessToken: jest.fn(() => 'mocked-access-token'),
      signOut: jest.fn(),
    },
  }));
  resolve();
});

initializeGlobalMocks.then(() => {
  console.log('<---- global mocks initialized ----> ');
});
