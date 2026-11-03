import { configureStore } from '@reduxjs/toolkit';

import { DIALOG, dialogSlice } from '../commons/dialog/dialogSlice';
import { NOTIFICATIONS, notificationsSlice } from '../commons/notifications/notificationSlice';
import { PROGRESS_BAR, progressBarSlice } from '../commons/progressBar/progressBarSlice';
import { PROMPT, promptSlice } from '../commons/prompt/promptSlice';
import {
  middleware as apiMiddleware,
  reducer as apiReducer,
  reducerPath as apiReducerPath,
} from '../features/api/apiSlice';
import { campaignApi } from '../features/api/campaignApi';
import { personalizationApi } from '../features/api/personalizationApi';
import { CAMPAIGN } from '../features/campaign/campaignSlice';
import { HOME, homeSlice } from '../features/home/homeSlice';
import { SESSION, sessionSlice } from '../features/session/sessionSlice';

import campaignReducer from './slices/campaignSlice';

export const store = configureStore({
  reducer: {
    [HOME]: homeSlice.reducer,
    [SESSION]: sessionSlice.reducer,
    [DIALOG]: dialogSlice.reducer,
    [NOTIFICATIONS]: notificationsSlice.reducer,
    [PROGRESS_BAR]: progressBarSlice.reducer,
    [PROMPT]: promptSlice.reducer,
    [apiReducerPath]: apiReducer,
    [CAMPAIGN]: campaignReducer,
    [campaignApi.reducerPath]: campaignApi.reducer,
    [personalizationApi.reducerPath]: personalizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /* Added to ignore serializable check for notifications and campaign dates */
      serializableCheck: {
        ignoredActions: [
          `${NOTIFICATIONS}/addNotification`,
          `${NOTIFICATIONS}/removeNotification`,
          `${DIALOG}/openDialog`,
          `${PROMPT}/openPrompt`,
          `${PROGRESS_BAR}/openProgressBar`,
          `${PROGRESS_BAR}/updateProgressBarOptions`,
          `${CAMPAIGN}/updateBasicDetails`, // Added campaign actions
        ],
        ignoredPaths: [
          NOTIFICATIONS,
          DIALOG,
          PROMPT,
          PROGRESS_BAR,
          `${CAMPAIGN}.formData.basicDetails.startDate`,
          `${CAMPAIGN}.formData.basicDetails.endDate`,
        ],
      },
    }).concat(apiMiddleware, campaignApi.middleware, personalizationApi.middleware),
});
