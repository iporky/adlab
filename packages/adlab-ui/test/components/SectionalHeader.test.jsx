import React from 'react';
import { render, screen } from '@testing-library/react';

import { SectionalHeader } from '../../src/components';

// eslint-disable-next-line react/display-name
jest.mock('../../src/components/LocaleSwitcher', () => () => <hr data-testid="locale-switcher" />);

jest.mock('../../src/components/styled', () => ({
  ...jest.requireActual('../../src/components/styled'),
  HR: () => <hr data-testid="hr" />,
}));

describe('SectionalHeader tests', () => {
  test('renders without crashing', () => {
    render(<SectionalHeader sectionTitle="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders LocaleSwitcher component', () => {
    render(<SectionalHeader sectionTitle="Test Title" />);
    expect(screen.getByTestId('locale-switcher')).toBeInTheDocument();
  });

  test('renders HR component', () => {
    render(<SectionalHeader sectionTitle="Test Title" />);
    expect(screen.getByTestId('hr')).toBeInTheDocument();
  });
});
