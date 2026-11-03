import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { ErrorBoundary } from '../../src/components';
import i18n from '../../src/helpers/i18n';

// A component that will intentionally throw an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component tests', () => {
  beforeAll(() => {
    // Silence the console.error calls that React makes when a component throws an error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  test('ErrorBoundary should catch errors and display an error message', () => {
    const { container, getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();

    expect(getByText('Catastrophic application failure encountered.')).toBeInTheDocument();
    expect(getByText('Please contact you system administrator for further assistance.')).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByText('Error message'));
    });

    expect(container.innerHTML).toEqual(expect.stringContaining('Error: Test error'));
  });

  test('ErrorBoundary should not catch errors if there are none', () => {
    const { container, getByText } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(container).toMatchSnapshot();
    expect(getByText('Test content')).toBeInTheDocument();
  });

  test('ErrorBoundaryUI should initialize i18n and display error message', async () => {
    const i18nIsInitializedMock = jest.spyOn(i18n, 'isI18NInitialized').mockReturnValue(false);

    const { findByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(i18nIsInitializedMock).toHaveBeenCalled();

    const errorMsg = await findByText('Catastrophic application failure encountered.');
    expect(errorMsg).toBeInTheDocument();

    i18nIsInitializedMock.mockRestore();
  });
});
