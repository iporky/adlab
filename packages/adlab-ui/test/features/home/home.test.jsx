import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { apiSlice } from '../../../src/features/api/apiSlice';
import Home from '../../../src/features/home';
import { HOME, homeSlice } from '../../../src/features/home/homeSlice';
import { SESSION, sessionSlice } from '../../../src/features/session/sessionSlice';
// eslint-disable-next-line jest/no-mocks-import
import { setupApiStore } from '../apis/__mocks__/mockStore';

describe('Home', () => {
  let storeRef = undefined;
  beforeAll(() => {
    storeRef = setupApiStore(apiSlice, {
      [HOME]: homeSlice.reducer,
      [SESSION]: sessionSlice.reducer,
    });
  });

  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={storeRef.store}>
        <Home />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders SectionalHeader with correct props', () => {
    const { getByText } = render(
      <Provider store={storeRef.store}>
        <Home />
      </Provider>,
    );
    const header = getByText(/your homepage/i);
    expect(header).toBeInTheDocument();
  });
});
