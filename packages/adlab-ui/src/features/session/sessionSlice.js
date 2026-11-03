/**
 * @module userSlice
 * General slice structure:
 * * Import and then export the slice name constant. Easier to import in index (Optional)
 * * Define the initial state.
 * * Define the slice using create slice functions.
 * * Define and export the async thunk actions.
 * * Export the actions and selectors.
 */
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import fetch from 'isomorphic-fetch';

import { oktaAuth } from '../../helpers/authN';
import constants from '../../lib/constants';

const { SESSION, WORKSPACE_CONFIG_LOCAL_STORAGE_KEY, API_BASE_URL } = constants;
export { SESSION };

const initialState = {
  user: {},
  app: {
    selectedClientId: undefined,
    selectedAccountId: undefined,
  },
  error: undefined,
  isLoading: false,
};

export const sessionSlice = createSlice({
  name: SESSION,
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.user = action.payload;
    },
    updateAppWorkspaceConfig: (state, action) => {
      state.app = action.payload;
      localStorage.setItem(`${WORKSPACE_CONFIG_LOCAL_STORAGE_KEY}-${state.user.email}`, JSON.stringify(state.app));
    },
    logout: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.user.permissions = action.payload;

        const savedApp = localStorage.getItem(`${WORKSPACE_CONFIG_LOCAL_STORAGE_KEY}-${state.user.email}`);

        if (savedApp) {
          state.app = JSON.parse(savedApp);
        } else if (state.app.selectedClientId === undefined) {
          const firstClient = Object.entries(action.payload.clients)[0];
          if (firstClient) {
            const [clientId, clientData] = firstClient;
            state.app.selectedClientId = clientId;
            const firstAccount = Object.entries(clientData.accounts)[0];
            if (firstAccount) {
              const [accountId] = firstAccount;
              state.app.selectedAccountId = accountId;
            }
          }
        }
        state.isLoading = false;
      })
      .addCase(fetchUserPermissions.rejected, (state) => {
        state.error = `Something went wrong. Try again later...`;
        state.isLoading = false;
      });
  },
});

export const fetchUserPermissions = createAsyncThunk(`${SESSION}/fetchUserPermissions`, async () => {
  const accessToken = oktaAuth.getAccessToken();
  const response = await fetch(`${API_BASE_URL}/v1/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
});

const selectSession = (state) => state[SESSION];
export const selectUser = createSelector(selectSession, (session) => session?.user);
export const selectAppConfig = createSelector(selectSession, (session) => session?.app);
export const selectUserAuthError = createSelector(selectSession, (session) => session?.error);
export const { logout, updateUserInfo, updateAppWorkspaceConfig } = sessionSlice.actions;
