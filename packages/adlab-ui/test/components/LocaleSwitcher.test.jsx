import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render } from '@testing-library/react';

import { LocaleSwitcher } from '../../src/components';
import { HOME, homeSlice } from '../../src/features/home/homeSlice';

const { reducer: homeReducer } = homeSlice;

describe('LocaleSwitcher Component tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [HOME]: homeReducer,
      },
    });
  });

  test('LocaleSwitcher component should render correctly', () => {
    const { getByRole, getByText } = render(
      <Provider store={store}>
        <LocaleSwitcher />
      </Provider>,
    );
    expect(getByText('Switch Locale')).toBeInTheDocument();
    expect(getByRole('combobox')).toBeInTheDocument();
  });

  test('LocaleSwitcher component should render with default locale', () => {
    const { getByDisplayValue } = render(
      <Provider store={store}>
        <LocaleSwitcher />
      </Provider>,
    );
    expect(getByDisplayValue('en')).toBeInTheDocument();
  });

  test('LocaleSwitcher component should change locale on select', async () => {
    const { getByRole, getByDisplayValue } = render(
      <Provider store={store}>
        <LocaleSwitcher />
      </Provider>,
    );
    await act(async () => {
      await fireEvent.change(getByRole('combobox'), {
        target: { value: 'fr' },
      });
    });
    expect(getByDisplayValue('fr')).toBeInTheDocument();
  });
});
