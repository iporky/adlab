const start = jest.fn();
const stop = jest.fn();
const resetHandlers = jest.fn();

const setupWorker = () => ({
  start,
  stop,
  resetHandlers,
});

export { setupWorker, start, stop, resetHandlers };
