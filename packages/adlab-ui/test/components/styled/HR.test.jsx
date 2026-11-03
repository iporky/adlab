import React from 'react';
import { render } from '@testing-library/react';

import HR from '../../../src/components/styled/HR';

describe('HR Component tests', () => {
  test('HR component should render correctly', () => {
    const { container } = render(<HR />);
    expect(container.firstChild.nodeName).toBe('DIV');
    expect(container.firstChild).toHaveStyle('height: 2px');
    expect(container.firstChild).toHaveStyle('width: 100%');
    expect(container.firstChild).toHaveStyle('margin: 4px 4px');
    expect(container.firstChild).toHaveStyle('background-color: #dbdbdb');
  });

  test('HR component should render with custom height based on prop', () => {
    const { container, rerender } = render(<HR thick />);
    // Assuming tfsuiTheme.strokeWidththick = '2px'
    expect(container.firstChild).toHaveStyle('height: 2px');

    rerender(<HR thin />);
    expect(container.firstChild).toHaveStyle('height: 1px');

    rerender(<HR thicker />);
    expect(container.firstChild).toHaveStyle('height: 3px');

    rerender(<HR thickest />);
    expect(container.firstChild).toHaveStyle('height: 4px');
  });

  test('HR component should render with custom styles', () => {
    const { container } = render(<HR styles={{ backgroundColor: 'red' }} />);
    expect(container.firstChild).toHaveStyle('background-color: red');
  });
});
