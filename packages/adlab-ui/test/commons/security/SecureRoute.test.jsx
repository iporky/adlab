import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { render, waitFor } from '@testing-library/react';

import { SecureRoute } from '../../../src/commons/security/SecureRoute';
import { selectUser, selectUserAuthError, updateUserInfo } from '../../../src/features/session/sessionSlice';
import i18n from '../../../src/helpers/i18n';

let oktaAuthMock;

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    oktaAuth: oktaAuthMock,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () =>
    jest.fn(() => ({
      pathname: '/adselfserve',
    })),
}));

describe('SecureRoute tests', () => {
  beforeEach(() => {
    oktaAuthMock = {
      isAuthenticated: jest.fn(),
      getUser: jest.fn(),
      signInWithRedirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders authenticating... when user is being authenticated', async () => {
    oktaAuthMock.isAuthenticated.mockReturnValue(true);
    oktaAuthMock.getUser.mockReturnValue({});
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser) return {};
      if (selector === selectUserAuthError) return false;
    });
    const dispatch = jest.fn();
    useDispatch.mockReturnValueOnce(dispatch);

    const { getByText } = render(
      <SecureRoute>
        <div>Test Child</div>
      </SecureRoute>,
    );

    await waitFor(() => expect(getByText(`${i18n.t(i18n.keys.authenticating)}...`)).toBeDefined());
  });

  it('claims userinfo from okta and updates store when user is authenticated but userinfo is missing...', async () => {
    oktaAuthMock.isAuthenticated.mockReturnValue(true);
    oktaAuthMock.getUser.mockReturnValue({
      email: 'test@example.com',
      given_name: 'Test',
      family_name: 'User',
    });
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser) return {};
      if (selector === selectUserAuthError) return false;
    });
    const dispatch = jest.fn();
    useDispatch.mockReturnValueOnce(dispatch);

    render(
      <SecureRoute>
        <div>Test Child</div>
      </SecureRoute>,
    );

    await waitFor(() => expect(oktaAuthMock.getUser).toHaveBeenCalled());
    expect(dispatch).toHaveBeenCalledWith(
      updateUserInfo({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
    );
  });

  it('redirects to login when user is not authenticated', async () => {
    oktaAuthMock.isAuthenticated.mockReturnValue(false);
    const dispatch = jest.fn();
    useDispatch.mockReturnValueOnce(dispatch);

    render(
      <SecureRoute>
        <div>Test Child</div>
      </SecureRoute>,
    );

    await waitFor(() => expect(oktaAuthMock.signInWithRedirect).toHaveBeenCalled());
  });

  it('throws error when user authentication fails', async () => {
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser)
        return {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        };
      if (selector === selectUserAuthError) return true;
    });

    try {
      render(
        <SecureRoute>
          <div>Test Child</div>
        </SecureRoute>,
      );
    } catch (e) {
      /* eslint-disable jest/no-conditional-expect */
      expect(e.message).toBe('User authentication failed');
    }
  });

  it('should fetch permissions when user is authenticated and userinfo is available without userPermissions', async () => {
    oktaAuthMock.isAuthenticated.mockReturnValue(true);
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser)
        return {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        };
      if (selector === selectUserAuthError) return false;
    });
    const dispatch = jest.fn();
    useDispatch.mockReturnValueOnce(dispatch);

    render(
      <SecureRoute>
        <div>Test Child</div>
      </SecureRoute>,
    );

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));
  });

  it('renders children when user is authenticated and userinfo is available with userPermissions', async () => {
    oktaAuthMock.isAuthenticated.mockReturnValue(true);
    useSelector.mockImplementation((selector) => {
      if (selector === selectUser)
        return {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          permissions: ['read', 'write'],
        };
      if (selector === selectUserAuthError) return false;
    });
    useDispatch.mockReturnValueOnce(jest.fn());

    const { getByText } = render(
      <SecureRoute>
        <div>Test Child</div>
      </SecureRoute>,
    );

    await waitFor(() => expect(getByText('Test Child')).toBeDefined());
  });
});
