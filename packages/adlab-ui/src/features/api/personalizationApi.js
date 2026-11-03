import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { oktaAuth } from '../../helpers/authN';
import constants from '../../lib/constants';
import { selectAppConfig } from '../session/sessionSlice';

import { templates } from '../../../../adlab-shared/src/mocks';
import { files, folders } from '../../../../adlab-shared/src/mocks/folders';

export const personalizationApi = createApi({
  reducerPath: 'personalizationApi',
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
  tagTypes: ['PersonaConfig'],
  endpoints: (builder) => ({
    getPersonaConfig: builder.query({
      query: ({ campaignId, includeCombinations = true }) => ({
        url: `campaigns/${campaignId}/personaconfig`,
        params: {
          includeCombinations: includeCombinations.toString(),
        },
      }),
    }),
    createPersonaConfig: builder.mutation({
      query: ({ campaignId, ...personaConfigData }) => ({
        url: `campaigns/${campaignId}/personaconfig`,
        method: 'POST',
        body: personaConfigData,
      }),
    }),
    updatePersonaConfig: builder.mutation({
      query: ({ campaignId, ...personaConfigData }) => ({
        url: `campaigns/${campaignId}/personaconfig`,
        method: 'PATCH',
        body: personaConfigData,
      }),
    }),
    uploadMatrixData: builder.mutation({
      query: ({ campaignId, personaConfigId, file }) => ({
        url: `campaigns/${campaignId}/personaconfig/${personaConfigId}/matrixdata`,
        method: 'POST',
        body: file,
      }),
    }),
    getTemplateDetails: builder.query({
      query: ({ orgId, templateGuid }) => ({
        url: `advportal/assets/template/${orgId}/${templateGuid}`,
      }),
      providesTags: ['Templates'],
    }),
    getTemplates: builder.query({
      query: ({ folderId }) => `advportal/assets/templates/${folderId}`,
      providesTags: ['Templates'],
      transformErrorResponse: (response) => {
        return templates;
      },
    }),
    getFolders: builder.query({
      query: () => `advportal/assets/folders`,
      providesTags: ['Templates'],
      transformErrorResponse: (response) => {
        return folders;
      },
    }),
    getFiles: builder.query({
      query: ({ folderId }) => `advportal/assets/images/${folderId}`,
      providesTags: ['Templates'],
      transformErrorResponse: (response) => {
        return files;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPersonaConfigQuery,
  useCreatePersonaConfigMutation,
  useUpdatePersonaConfigMutation,
  useUploadMatrixDataMutation,
  useGetTemplateDetailsQuery,
  useGetTemplatesQuery,
  useGetFoldersQuery,
  useGetFilesQuery,
} = personalizationApi;
