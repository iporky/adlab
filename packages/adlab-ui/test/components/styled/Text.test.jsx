import React from 'react';
import { render } from '@testing-library/react';

import { Text } from '../../../src/components/styled';

describe('Text Component tests', () => {
  test('Text component should render correctly with fluentui typography style body2', () => {
    const { container, getByText } = render(<Text>Test Text</Text>);
    expect(getByText('Test Text')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle(`
      font-family: var(--fontFamilyBase);
      font-size: var(--fontSizeBase400);
      font-weight: var(--fontWeightRegular);
      line-height: var(--lineHeightBase400);
    `);
  });

  test('fluentui typography name as prop should render text with the style', () => {
    const { container, getByText } = render(<Text subtitle2>Test Text</Text>);
    expect(getByText('Test Text')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle(`
      font-family: var(--fontFamilyBase);
      font-size: var(--fontSizeBase400);
      font-weight: var(--fontWeightSemibold);
      line-height: var(--lineHeightBase400);
    `);
  });

  test('Text component should render as a paragraph', () => {
    const { container } = render(<Text as="p">Test Text</Text>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  test('Text component should render as a span', () => {
    const { container } = render(<Text as="span">Test Text</Text>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  test('Text component should render as a block', () => {
    const { container } = render(<Text block>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('display: block');
  });

  test('Text component should render as inline', () => {
    const { container } = render(<Text inline>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('display: inline');
  });

  test('Text component should render as disabled', () => {
    const { container } = render(<Text disabled>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('cursor: not-allowed');
  });

  test('Text component should render in italics', () => {
    const { container } = render(<Text it>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('font-style: italic');
  });

  test('Text component should render in bold', () => {
    const { container } = render(<Text bd>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('font-weight: 600');
  });

  test('Text component should render with underline', () => {
    const { container } = render(<Text ul>Test Text</Text>);
    expect(container.firstChild).toHaveStyle('text-decoration: underline');
  });
});
