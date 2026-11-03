import { setupWorker } from 'msw/browser';

/**
 * This function enables the mocking of the Service Worker before app startup.
 * @returns {Promise<ServiceWorkerRegistration | undefined>}
 */
let worker;
export const isServiceWorkerStarted = () => !!worker;

export const enableMockServiceWorker = async () => {
  // Check if app stated on dev:msw mode.
  if (process.env.PUBLIC_ENABLE_MSW !== 'true') {
    return;
  }
  // Import the `worker` object from the mock file.
  const { httpHandlers } = await import('../../../test/features/apis/__mocks__/requestHandlers');
  worker = setupWorker(...httpHandlers);
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
};

/**
 * This function disables the mocking of the Service Worker.
 * @returns {Promise<void>}
 */
export const disableMockServiceWorker = async () => {
  if (!isServiceWorkerStarted()) {
    return;
  }
  // `worker.stop()` returns a Promise that resolves
  // once the Service Worker has stopped.
  return worker.stop();
};

export const resetServiceWorker = async () => {
  if (!isServiceWorkerStarted()) {
    return;
  }
  return worker.resetHandlers();
};

export const forceServiceShutdown = async () => {
  await worker?.stop();
  worker = undefined;
};
