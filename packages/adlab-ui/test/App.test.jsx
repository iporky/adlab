import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, Outlet } from 'react-router-dom';
import { render, waitFor, within } from '@testing-library/react';

import App, { routes } from '../src/App';
import { DIALOG, dialogSlice } from '../src/commons/dialog/dialogSlice';
import { NOTIFICATIONS, notificationsSlice } from '../src/commons/notifications/notificationSlice';
import { PROMPT, promptSlice } from '../src/commons/prompt/promptSlice';
import { apiSlice } from '../src/features/api/apiSlice';
import { HOME, homeSlice } from '../src/features/home/homeSlice';
import { SESSION, sessionSlice } from '../src/features/session/sessionSlice';

/* eslint-disable jest/no-mocks-import */
import { setupApiStore } from './features/apis/__mocks__/mockStore';
/* eslint-enable jest/no-mocks-import */

/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

jest.mock('@okta/okta-react', () => ({
  Security: ({ children }) => <div data-testid={'security'}>{children}</div>,
  LoginCallback: () => <div>LoginCallback</div>,
}));

jest.mock('../src/components/ErrorBoundary', () => {
  return function DummyErrorBoundary({ children }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock('../src/commons/security/SecureRoute', () => ({
  SecureRoute: ({ children }) => <div data-testid="secure-route">{children}</div>,
}));

jest.mock('../src/commons/layout', () => {
  return function DummyLayout() {
    return (
      <div data-testid="layout">
        <Outlet />
      </div>
    );
  };
});

jest.mock('../src/features/home', () => {
  return function DummyHome() {
    return <div data-testid="home">Home</div>;
  };
});

jest.mock('../src/features/demos', () => {
  return function DummyDemoCenter() {
    return <div data-testid="democenter">DemoCenter</div>;
  };
});

describe('App', () => {
  let storeRef;
  beforeAll(async () => {
    storeRef = setupApiStore(apiSlice, {
      [HOME]: homeSlice.reducer,
      [SESSION]: sessionSlice.reducer,
      [PROMPT]: promptSlice.reducer,
      [DIALOG]: dialogSlice.reducer,
      [NOTIFICATIONS]: notificationsSlice.reducer,
    });
  });

  it('renders without crashing', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/', '/login/callback', '/adlab', '/adlab/demos'],
      initialIndex: 1,
    });

    const { getByText, getByTestId, getAllByTestId, container } = render(
      <Provider store={storeRef.store}>
        <App router={router} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText('LoginCallback')).toBeDefined();
    });

    expect(container).toMatchSnapshot();

    await router.navigate('/adlab');

    await waitFor(() => {
      const errorBoundaries = getAllByTestId('error-boundary');
      expect(errorBoundaries.length).toBe(2);

      expect(getByTestId('secure-route')).toBeDefined();
      const layout = getByTestId('layout');
      const errorBoundaryInLayout = within(layout).getByTestId('error-boundary');
      expect(errorBoundaryInLayout).toBeDefined();
      expect(getByText('Home')).toBeDefined();
    });

    expect(container).toMatchSnapshot();

    await router.navigate('/adlab/demos');

    await waitFor(() => {
      const errorBoundaries = getAllByTestId('error-boundary');
      expect(errorBoundaries.length).toBe(2);

      expect(getByTestId('secure-route')).toBeDefined();
      const layout = getByTestId('layout');
      const errorBoundaryInLayout = within(layout).getByTestId('error-boundary');
      expect(errorBoundaryInLayout).toBeDefined();
      expect(getByText('DemoCenter')).toBeDefined();
    });

    expect(container).toMatchSnapshot();
  });
});
