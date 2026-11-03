import React from 'react';
import { render } from '@testing-library/react';

import { FlexDiv } from '../../../src/components/styled';

describe('FlexDiv Component tests', () => {
  test('FlexDiv component should render correctly', () => {
    const { getByText, container } = render(<FlexDiv>Test Text</FlexDiv>);
    expect(getByText('Test Text')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('display: flex');
    expect(container.firstChild).toHaveStyle('align-items: center');
    expect(container.firstChild).toHaveStyle('justify-content: initial');
    expect(container.firstChild).toHaveStyle('flex-direction: initial');
  });

  test('column prop should render with flex direction column', () => {
    const { container } = render(
      <FlexDiv column justifyCenter>
        Test Text
      </FlexDiv>,
    );
    expect(container.firstChild).toHaveStyle('flex-direction: column');
  });

  test('gap prop render with with the given gap', () => {
    const { container } = render(<FlexDiv gap={'5px'}>Test Text</FlexDiv>);
    expect(container.firstChild).toHaveStyle('gap: 5px');
  });

  test('justifyCenter prop render with justify content center', () => {
    const { container } = render(<FlexDiv justifyCenter>Test Text</FlexDiv>);
    expect(container.firstChild).toHaveStyle('justify-content: center');
  });
});
