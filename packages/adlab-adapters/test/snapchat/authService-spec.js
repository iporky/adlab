/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import { stringify } from 'querystring';
import RequestHelper from '../../src/snapchat/helpers/requestHelper.js';
import { getNewAccessToken, refreshAccessToken } from '../../src/snapchat/services/authServices.js';

jest.mock('../../src/snapchat/helpers/requestHelper.js');
jest.mock('../../src/snapchat/utils/errorHandler.js');

const { initialize, getInstance } = RequestHelper;

describe('authService', () => {
  beforeEach(() => {
    initialize.mockClear();
    getInstance.mockClear();
  });

  describe('getNewAccessToken', () => {
    it('should retrieve a new access token', async () => {
      const postData = stringify({
        code: 'authCode',
        client_id: 'clientId',
        client_secret: 'clientSecret',
        redirect_uri: 'redirectUri',
        grant_type: 'authorization_code',
      });

      const mockResponse = { access_token: 'newAccessToken' };
      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      getInstance.mockReturnValue({ post: mockPost });

      const result = await getNewAccessToken({
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'redirectUri',
        authorizationCode: 'authCode',
        tokenUrl: 'https://accounts.snapchat.com',
      });

      expect(initialize).toHaveBeenCalledWith({
        accessToken: 'dummyAccessToken',
        tokenUrl: 'https://accounts.snapchat.com',
        accountId: null,
      });
      expect(mockPost).toHaveBeenCalledWith('/login/oauth2/access_token', postData, true);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token', async () => {
      const postData = stringify({
        refresh_token: 'refreshToken',
        client_id: 'clientId',
        client_secret: 'clientSecret',
        grant_type: 'refresh_token',
      });

      const mockResponse = { access_token: 'newAccessToken' };
      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      getInstance.mockReturnValue({ post: mockPost });

      const result = await refreshAccessToken({
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        refreshToken: 'refreshToken',
        tokenUrl: 'https://accounts.snapchat.com',
      });

      expect(initialize).toHaveBeenCalledWith({
        accessToken: 'dummyAccessToken',
        tokenUrl: 'https://accounts.snapchat.com',
        accountId: null,
      });
      expect(mockPost).toHaveBeenCalledWith('/login/oauth2/access_token', postData, true);
      expect(result).toEqual(mockResponse);
    });
  });
});
