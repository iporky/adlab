import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import { mocks } from 'adlab-shared';

import Navbar from '../../../src/commons/navbar';
import { selectAppConfig, selectUser } from '../../../src/features/session/sessionSlice';

jest.mock('react-redux', () => ({
  useStore: jest.fn(),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  NavLink: jest.fn(({ children }) => <div data-testid="nav-link">{children}</div>),
}));

describe('Navbar component', () => {
  it('renders correctly', () => {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser)
        return {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          permissions: mocks.userPermissions,
        };
      if (selector === selectAppConfig)
        return {
          selectedClientId: 'testclientone',
          selectedAccountId: 'testclientone',
        };
    });

    const { container } = render(<Navbar />);
    expect(container).toMatchSnapshot();
  });
});
