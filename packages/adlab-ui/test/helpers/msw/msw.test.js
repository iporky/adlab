import {
  disableMockServiceWorker,
  enableMockServiceWorker,
  forceServiceShutdown,
  resetServiceWorker,
} from '../../../src/helpers/msw';

// eslint-disable-next-line jest/no-mocks-import
import { resetHandlers, start, stop } from './__mocks__/mswMocks';

/* eslint-disable */
jest.mock('msw/browser', () => require('./__mocks__/mswMocks'));
/* eslint-enable */

describe('MockServiceWorker tests', () => {
  afterEach(async () => {
    await forceServiceShutdown();
    jest.clearAllMocks();
  });

  test('returns undefined when app is not in dev:msw mode', async () => {
    process.env.PUBLIC_ENABLE_MSW = 'false';

    const result = await enableMockServiceWorker();

    expect(result).toBeUndefined();
  });

  test('starts worker when app is in dev:msw mode', async () => {
    process.env.PUBLIC_ENABLE_MSW = 'true';

    await enableMockServiceWorker();

    expect(start).toHaveBeenCalledTimes(1);
  });

  it('disableMockServiceWorker calls worker.stop when service worker is started', async () => {
    process.env.PUBLIC_ENABLE_MSW = 'true';
    await enableMockServiceWorker();

    await disableMockServiceWorker();

    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('disableMockServiceWorker does nothing when service worker is not started', async () => {
    await disableMockServiceWorker();

    expect(stop).not.toHaveBeenCalled();
  });

  it('resetServiceWorker calls worker.resetHandlers when service worker is started', async () => {
    process.env.PUBLIC_ENABLE_MSW = 'true';
    await enableMockServiceWorker();

    await resetServiceWorker();

    expect(resetHandlers).toHaveBeenCalledTimes(1);
  });

  it('resetServiceWorker does nothing when service worker is not started', async () => {
    await resetServiceWorker();

    expect(resetHandlers).not.toHaveBeenCalled();
  });
});
