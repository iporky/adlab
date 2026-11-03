import reportWebVitals from '../../src/helpers/webVitals';

jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('calls web-vitals functions with onPerfEntry callback when onPerfEntry is a function', async () => {
    const onPerfEntry = () => {};

    await reportWebVitals(onPerfEntry);

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    expect(getCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(getFID).toHaveBeenCalledWith(onPerfEntry);
    expect(getFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  test('does nothing when onPerfEntry is not a function', async () => {
    const onPerfEntry = 'not a function';

    await reportWebVitals(onPerfEntry);

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    expect(getCLS).not.toHaveBeenCalled();
    expect(getFID).not.toHaveBeenCalled();
    expect(getFCP).not.toHaveBeenCalled();
    expect(getLCP).not.toHaveBeenCalled();
    expect(getTTFB).not.toHaveBeenCalled();
  });
});
