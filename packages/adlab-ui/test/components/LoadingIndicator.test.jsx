import React from 'react';
import { render } from '@testing-library/react';

import { LoadingIndicator } from '../../src/components';

describe('LoadingIndicator Component tests', () => {
  test('LoadingIndicator component should render correctly', () => {
    const { getByText } = render(<LoadingIndicator />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  test('LoadingIndicator component should render with correct FlexDiv styles', () => {
    const { container } = render(<LoadingIndicator />);
    const flexDiv = container.firstChild;
    expect(flexDiv).toHaveStyle(`
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 140px;
      width: 140px;
      background-color: #D2CEEE;
      border-radius: 5px;
    `);
  });

  test('LoadingIndicator component should render with custom label', () => {
    const { getByText } = render(<LoadingIndicator label="Custom Loading..." />);
    expect(getByText('Custom Loading...')).toBeInTheDocument();
  });

  test('LoadingIndicator component should render with label position above', () => {
    const { container } = render(<LoadingIndicator labelPosition="above" />);
    const spinner = container.querySelector('.fui-Spinner__spinner');
    const label = container.querySelector('.fui-Spinner__label');

    // Check if the label is rendered before the spinner in the DOM
    expect(label.compareDocumentPosition(spinner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('LoadingIndicator component should render with label position below', () => {
    const { container } = render(<LoadingIndicator labelPosition="below" />);
    const spinner = container.querySelector('.fui-Spinner__spinner');
    const label = container.querySelector('.fui-Spinner__label');

    // Check if the label is rendered after the spinner in the DOM
    expect(label.compareDocumentPosition(spinner) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });
});
