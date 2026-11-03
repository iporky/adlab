import { apiSlice } from '../../../src/features/api/apiSlice';
import { HOME, homeSlice } from '../../../src/features/home/homeSlice';
import { SESSION, sessionSlice } from '../../../src/features/session/sessionSlice';

/* eslint-disable jest/no-mocks-import */
import { setupApiStore } from './__mocks__/mockStore';
import { closeMockServer, enableMockServer, resetMockSever } from './__mocks__/mswForNode';
/* eslint-enable jest/no-mocks-import */

describe('apiSlice tests', () => {
  let storeRef = undefined;

  /* eslint-disable no-console */
  beforeAll(async () => {
    storeRef = setupApiStore(apiSlice, {
      [HOME]: homeSlice.reducer,
      [SESSION]: sessionSlice.reducer,
    });
    console.log('<---- RTK index setup ----> ');

    process.env.PUBLIC_ENABLE_MSW = 'true';
    await enableMockServer();
    console.log('<---- mock service worker has started ----> ');
  });

  afterEach(async () => {
    await resetMockSever();
  });

  afterAll(async () => {
    await closeMockServer();
    console.log('<---- mock service worker stopped ----> ');
  });

  describe('configuration tests', function () {
    test('apiSlice defines correct endpoints', () => {
      expect(Object.keys(apiSlice.endpoints)).toMatchInlineSnapshot(`
      [
        "getAllCampaigns",
        "createCampaign",
      ]
    `);
    });

    test('apiSlice all endpoints to index', () => {
      expect(storeRef.store.getState()[apiSlice.reducerPath]).toBeDefined();
    });
  });
});
