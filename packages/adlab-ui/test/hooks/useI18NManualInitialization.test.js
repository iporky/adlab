import { renderHook } from '@testing-library/react-hooks';

import i18n from '../../src/helpers/i18n';
import useI18NManualInitialization from '../../src/hooks/useI18NManualInitialization';

jest.mock('../../src/helpers/i18n/index.js', () => {
  return {
    _i18n: jest.fn().mockImplementation(() => {
      return { init: jest.fn() };
    }),
    isI18NInitialized: jest.fn(),
  };
});

describe('useI18NManualInitialization tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initializes i18n and allows UI to render', () => {
    i18n.isI18NInitialized.mockReturnValue(false);

    renderHook(() => useI18NManualInitialization());

    expect(i18n._i18n).toHaveBeenCalledTimes(1);
  });

  test('does not initialize i18n again if it is already initialized', () => {
    i18n.isI18NInitialized.mockReturnValue(true);

    renderHook(() => useI18NManualInitialization());

    expect(i18n._i18n).not.toHaveBeenCalled();
  });
});
