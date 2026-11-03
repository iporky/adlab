import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { oktaAuth } from '../../helpers/authN';
import constants from '../../lib/constants';
import { selectAppConfig } from '../session/sessionSlice';

const FB_GRAPH_API_BASE_URL = process.env.PUBLIC_FB_GRAPH_API_BASE_URL;
const FB_ACCESS_TOKEN = process.env.PUBLIC_FB_ACCESS_TOKEN;
export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.API_BASE_URL}/v2/`,
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
  tagTypes: ['Campaign', 'ObjectiveTypes', 'ObjectiveGoals', 'Currencies', 'Targeting'],
  endpoints: (builder) => ({
    getObjectiveTypes: builder.query({
      query: () => 'campaigns/types/objectives',
      providesTags: ['ObjectiveTypes'],
    }),
    getObjectiveGoals: builder.query({
      query: () => 'campaigns/types/goals',
      providesTags: ['ObjectiveGoals'],
    }),
    getCurrencies: builder.query({
      query: () => 'campaigns/types/currency',
      providesTags: ['Currencies'],
    }),
    getCampaignTypes: builder.query({
      query: () => 'campaigns/types/campaignType',
      providesTags: ['Campaign Types'],
    }),
    getCampaignFormats: builder.query({
      query: () => 'campaigns/types/campaignFormat',
      providesTags: ['Campaign Formats'],
    }),
    getAudienceTypes: builder.query({
      query: () => 'campaigns/targetings/types/audience',
      providesTags: ['Targeting'],
    }),
    getAgeTypes: builder.query({
      query: () => 'campaigns/targetings/types/age',
      providesTags: ['Targeting']
    }),
    getDeviceData: builder.query({
      query: () => 'campaigns/targetings/types/device',
      providesTags: ['Targeting'],
    }),
    getLanguageTypes: builder.query({
      query: () => 'campaigns/targetings/types/language',
      providesTags: ['Targeting'],
    }),
    // Keep searchLocations separate as it uses Facebook's API
    searchLocations: builder.query({
      query: ({ query, locationTypes }) => ({
        url: `${FB_GRAPH_API_BASE_URL}/search`,
        params: {
          type: 'adgeolocation',
          location_types: `["${locationTypes.join('","')}"]`,
          q: query,
          access_token: FB_ACCESS_TOKEN,
        },
      }),
      // No caching for search queries as they depend on user input
    }),
    createCampaign: builder.mutation({
      query: (campaignData) => ({
        url: 'campaigns',
        method: 'POST',
        body: campaignData,
      }),
      invalidatesTags: ['Campaign'],
    }),
    updateCampaign: builder.mutation({
      query: ({ campaignId, ...campaignData }) => ({
        url: `campaigns/${campaignId}`,
        method: 'PUT',
        body: campaignData,
      }),
      invalidatesTags: ['Campaign'],
    }),
    getCampaigns: builder.query({
      query: ({ page = 1, pageSize = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        if (search) {
          params.append('search', search);
        }
        return {
          url: `campaigns?${params.toString()}`,
        };
      },
      invalidatesTags: ['Campaign'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCampaignTypesQuery,
  useGetCampaignFormatsQuery,
  useGetObjectiveTypesQuery,
  useGetObjectiveGoalsQuery,
  useGetCurrenciesQuery,
  useGetAgeTypesQuery,
  useGetLanguageTypesQuery,
  useSearchLocationsQuery,
  useGetAudienceTypesQuery,
  useGetDeviceDataQuery,
  useGetAdTemplatesQuery,
  useGetFoldersQuery,
  useGetFilesQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useGetCampaignsQuery,
} = campaignApi;
