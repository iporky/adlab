import { createSlice } from '@reduxjs/toolkit';
import pako from 'pako';

import {
  openProgressBar,
  updateProgressBarMessage,
  updateProgressBarMeter,
  updateProgressBarOptions,
} from '../../commons/progressBar/progressBarSlice';
import constants from '../../lib/constants';

const { CAMPAIGN } = constants;
export { CAMPAIGN };

const initialState = {};

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {},
});

export const adsTag = 'Ads';
export const publishAdsToPlatform = (builder) => ({
  publishAdsToPlatform: builder.mutation({
    query: (adsPayload) => {
      const utf8ArrayPayload = new TextEncoder().encode(JSON.stringify(adsPayload));
      const compressedAdSet = pako.gzip(utf8ArrayPayload);

      return {
        url: '/ads',
        method: 'POST',
        body: compressedAdSet,
        headers: {
          'Content-Encoding': 'gzip',
          'Content-Type': 'application/json',
          'Content-Length': compressedAdSet.length.toString(),
        },
      };
    },
    onCacheEntryAdded: (args) => {
      if (args.callback) {
        args.callback();
      }
    },
    onQueryStarted: (arg, { dispatch, queryFulfilled }) => {
      const eventSource = new EventSource(`${constants.API_BASE_URL}/v1/events?action=pub-ads-progress`);

      try {
        dispatch(
          openProgressBar({
            message: `Uploading ads to ${arg.platform}...`,
          }),
        );

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          dispatch(updateProgressBarMeter({ progress: data.progress }));
          if (data.message) {
            dispatch(updateProgressBarMessage({ message: data.message }));
          }
        };

        queryFulfilled.then(() => {
          eventSource.close();
        });
      } catch (error) {
        eventSource.close();
        dispatch(updateProgressBarMeter({ progress: undefined }));
        dispatch(updateProgressBarMessage({ message: 'Unable to determine progress' }));
        dispatch(updateProgressBarOptions({ autoHide: false }));
      }
    },
  }),
});
