import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { render } from '@testing-library/react';

import { store } from '../../src/store';

describe('index tests', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    // eslint-disable-next-line no-console
    console.warn.mockRestore();
  });

  test('provides correct state', () => {
    const TestComponent = () => {
      const state = useSelector((state) => state);
      return <div data-testid={'state-container'}>{JSON.stringify(state)}</div>;
    };
    /* This state object is shadow copy of the initial state of the index. */
    /* Update this state object to match the initial state of the index. */
    const state = {
      home: {},
      session: { user: {}, app: {}, isLoading: false },
      dialog: {},
      notifications: { order: [] },
      prompt: {},
      api: {
        queries: {},
        mutations: {},
        provided: {},
        subscriptions: {},
        config: {
          online: true,
          focused: true,
          middlewareRegistered: false,
          refetchOnFocus: false,
          refetchOnReconnect: false,
          refetchOnMountOrArgChange: false,
          keepUnusedDataFor: 60,
          reducerPath: 'api',
          invalidationBehavior: 'delayed',
        },
      },
    };
    const { container } = render(
      <Provider store={store}>
        <TestComponent />
      </Provider>,
    );
    expect(container).toMatchSnapshot();
    expect(container.querySelector('[data-testid="state-container"]').textContent).toEqual(JSON.stringify(state));
  });
});
