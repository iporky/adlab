import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';

import withLocaleContext from '../../src/hocs/withLocaleContext.jsx';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('withLocaleContext tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('passes locale prop to wrapped component', () => {
    useSelector.mockReturnValue('en-US');

    const TestComponent = (props) => <div>{props.locale}</div>;
    TestComponent.propTypes = { locale: PropTypes.string.isRequired };
    const TestComponentWithLocaleContext = withLocaleContext(TestComponent);

    render(<TestComponentWithLocaleContext />);
    expect(screen.getByText('en-US')).toBeInTheDocument();
  });

  test('preserves display name of wrapped component', () => {
    const TestComponent = () => null;
    TestComponent.displayName = 'TestComponent';
    const TestComponentWithLocaleContext = withLocaleContext(TestComponent);

    expect(TestComponentWithLocaleContext.displayName).toBe('withLocaleContext(TestComponent)');
  });
});
