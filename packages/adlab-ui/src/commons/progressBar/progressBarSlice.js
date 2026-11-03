import { createSelector, createSlice } from '@reduxjs/toolkit';

import constants from '../../lib/constants';

const { PROGRESS_BAR } = constants;
export { PROGRESS_BAR };

const initialState = {
  isOpen: false,
  progress: 0,
  message: '',
  options: {
    autoHide: true,
  },
};

export const progressBarSlice = createSlice({
  name: PROGRESS_BAR,
  initialState,
  reducers: {
    /* Open progress bar without progress starts at indeterminate state and becomes determinate
       on update progress event.
    */
    openProgressBar: (state, action) => {
      state.isOpen = true;
      state.options = { ...state.options, ...action.payload?.options };
      state.message = action.payload?.message;
      state.progress = action.payload?.progress;
    },
    updateProgressBarMeter: (state, action) => {
      state.progress = action.payload.progress;
    },
    updateProgressBarMessage: (state, action) => {
      state.message = action.payload.message;
    },
    updateProgressBarOptions: (state, action) => {
      state.options = action.payload;
    },
    closeProgressBar: () => {
      return initialState;
    },
  },
});

export const {
  updateProgressBarMeter,
  updateProgressBarMessage,
  updateProgressBarOptions,
  closeProgressBar,
  openProgressBar,
} = progressBarSlice.actions;

const progressBarSelector = (state) => state[PROGRESS_BAR];

export const isProgressBarOpenSelector = createSelector(progressBarSelector, (progressBar) => progressBar?.isOpen);
export const progressSelector = createSelector(progressBarSelector, (progressBar) => progressBar?.progress);
export const messageSelector = createSelector(progressBarSelector, (progressBar) => progressBar?.message);
export const optionsSelector = createSelector(progressBarSelector, (progressBar) => progressBar?.options);
