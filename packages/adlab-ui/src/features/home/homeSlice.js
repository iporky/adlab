import { createSlice } from '@reduxjs/toolkit';

import constants from '../../lib/constants';

const { HOME } = constants;
export { HOME };

const initialState = {
  lang: undefined,
  locale: undefined,
};

export const homeSlice = createSlice({
  name: HOME,
  initialState,
  reducers: {
    updateLocale: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const localeSelector = (state) => state[HOME].locale;

export const { updateLocale } = homeSlice.actions;
