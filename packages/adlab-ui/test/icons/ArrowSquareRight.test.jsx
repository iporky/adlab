import React from 'react';
import { render } from '@testing-library/react';

import ArrowSquareRight from '../../src/icons/ArrowSquareRight.jsx';

describe('ArrowSquareRight', () => {
  test('renders without crashing', () => {
    const { container } = render(<ArrowSquareRight />);
    expect(container).toMatchSnapshot();
  });

  test('applies width, height, and color props correctly', () => {
    const { container } = render(<ArrowSquareRight width="50px" height="50px" color="#ffffff" />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '50px');
    expect(svgElement).toHaveAttribute('height', '50px');
    const pathElement = svgElement.firstChild;
    expect(pathElement).toHaveAttribute('stroke', '#ffffff');
  });

  test('uses default prop values when no props are provided', () => {
    const { container } = render(<ArrowSquareRight />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '100px');
    expect(svgElement).toHaveAttribute('height', '100px');
    const pathElement = svgElement.firstChild;
    expect(pathElement).toHaveAttribute('stroke', '#00000');
  });
});
