import React from 'react';
import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useOktaAuth } from '@okta/okta-react';
import { isEmpty } from 'lodash';

import { LoadingIndicator } from '../../components';
import {
  fetchUserPermissions,
  selectUser,
  selectUserAuthError,
  updateUserInfo,
} from '../../features/session/sessionSlice';
import i18n from '../../helpers/i18n';

/**
 * SecureRoute checks if the user is authenticated.
 * If the user is authenticated, it renders the children.
 * If the user is not authenticated, it redirects to the login page.
 * @param children
 * @param rest
 * @returns {*|JSX.Element}
 * @constructor
 */
export const SecureRoute = ({ children }) => {
  const { oktaAuth } = useOktaAuth();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isUserAuthFailed = useSelector(selectUserAuthError);
  const [canRender, setCanRender] = useState(false);

  if (isUserAuthFailed) {
    throw new Error('User authentication failed');
  }

  /**
   * Check if the user is authenticated.
   * If the user is authenticated, check if the user info is available.
   * If the user info is not available, fetch the user info.
   * If the user info is available, check if the user permissions are available.
   * If the user permissions are not available, fetch the user permissions.
   * If the user permissions are available, set canRender to true.
   */
  useLayoutEffect(() => {
    (async () => {
      const isAuthenticated = await oktaAuth.isAuthenticated();

      if (isAuthenticated) {
        if (isEmpty(user)) {
          const userInfo = await oktaAuth.getUser();
          dispatch(
            updateUserInfo({
              email: userInfo.email,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
            }),
          );
        } else if (!user.permissions) {
          dispatch(fetchUserPermissions());
        } else {
          setCanRender(true);
        }
      } else {
        await oktaAuth.signInWithRedirect({ originalUri: pathname });
      }
    })();
  }, [oktaAuth, pathname, user, dispatch]);

  return canRender ? (
    children
  ) : (
    <LoadingIndicator label={`${i18n.t(i18n.keys.authenticating, null, { capitalize: true })}...`} />
  );
};
SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
