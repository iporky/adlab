import { setupServer } from 'msw/node';

/**
 * This function enables the mocking api service for node environment.
 * @returns {Promise<ServiceWorkerRegistration | undefined>}
 */
let server;
export const enableMockServer = async () => {
  const { httpHandlers } = await import('./requestHandlers');

  server = setupServer(...httpHandlers);

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return server.listen();
};

export const closeMockServer = async () => {
  return server.close();
};

export const resetMockSever = async () => {
  return server.resetHandlers();
};
