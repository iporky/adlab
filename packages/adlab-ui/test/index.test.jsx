import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { waitFor } from '@testing-library/react';
import { FluentProvider, tfsuiTheme } from '@tfs/ui-components-next';

import App from '../src/App.jsx';
import { apiSlice } from '../src/features/api/apiSlice';
import i18n from '../src/helpers/i18n';
import { store } from '../src/store';

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

describe('index success flow tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('renders root component correctly', async () => {
    i18n.initiateI18N.mockImplementationOnce(() => Promise.resolve());
    await import('../src/index.jsx');

    await waitFor(() => {
      expect(ReactDOM.createRoot).toHaveBeenCalled();
      expect(mockRender).toHaveBeenCalledWith(
        <React.StrictMode>
          <ReduxProvider store={store}>
            <FluentProvider theme={tfsuiTheme}>
              <App />
            </FluentProvider>
          </ReduxProvider>
        </React.StrictMode>,
      );
    });
  });
});
