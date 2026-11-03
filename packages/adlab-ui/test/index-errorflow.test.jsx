import React from 'react';
import ReactDOM from 'react-dom';
import { waitFor } from '@testing-library/react';

import ErrorBoundary from '../src/components/ErrorBoundary';
import { apiSlice } from '../src/features/api/apiSlice';
import i18n from '../src/helpers/i18n';

jest.mock('../src/App', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="mockedApp" />;
    },
  };
});

const mockRender = jest.fn();
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createRoot: jest.fn().mockImplementation(() => ({
    render: mockRender,
  })),
}));

jest.mock('../src/store', () => {
  const { setupApiStore } = jest.requireActual('./features/apis/__mocks__/mockStore');
  const storeRef = setupApiStore(apiSlice, {});
  return {
    store: storeRef.store,
  };
});

jest.mock('../src/helpers/i18n/index.js', () => ({
  initiateI18N: jest.fn(),
}));

jest.mock('../src/helpers/msw', () => ({
  enableMockServiceWorker: jest.fn().mockImplementation(() => Promise.resolve()),
}));

jest.mock('../src/helpers/msw', () => ({
  enableMockServiceWorker: jest.fn().mockImplementation(() => Promise.resolve()),
}));

describe('index error flow tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('renders ErrorBoundary when preprocess throws an error', async () => {
    const error = new Error('Test error');
    i18n.initiateI18N.mockImplementationOnce(() => Promise.reject(error));

    await import('../src/index.jsx');

    await waitFor(() => {
      expect(ReactDOM.createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalledWith(<ErrorBoundary error={error} />);
    });
  });
});
