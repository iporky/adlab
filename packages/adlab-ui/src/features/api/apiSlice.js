import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { oktaAuth } from '../../helpers/authN';
import constants from '../../lib/constants';
import { adsTag, publishAdsToPlatform } from '../campaign/campaignSlice';
import { selectAppConfig } from '../session/sessionSlice';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.API_BASE_URL}/v1`,
    prepareHeaders: async (headers, { getState }) => {
      const { selectedClientId, selectedAccountId } = selectAppConfig(getState());
      const accessToken = oktaAuth.getAccessToken();
      headers.set('Authorization', `Bearer ${accessToken}`);
      if (selectedClientId && selectedAccountId) {
        headers.set(constants.X_TFS_CLIENT_ID, selectedClientId);
        headers.set(constants.X_TFS_ACCOUNT_ID, selectedAccountId);
      }
      return headers;
    },
  }),
  tagTypes: [adsTag],
  endpoints: (builder) => ({
    ...publishAdsToPlatform(builder),
  }),
});

export const { usePublishAdsToPlatformMutation, reducer, reducerPath, middleware } = apiSlice;
