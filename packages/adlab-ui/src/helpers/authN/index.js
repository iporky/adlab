/**
 * This utility is used to authenticate the user using Okta.
 */
import { OktaAuth } from '@okta/okta-auth-js';

export const oktaAuth = new OktaAuth({
  issuer: process.env.PUBLIC_OKTA_ISSUER,
  clientId: process.env.PUBLIC_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + '/login/callback',
  postLogoutRedirectUri: `${window.location.origin}/${process.env.PUBLIC_APP_CONTEXT}`,
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
});
