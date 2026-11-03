import { createSlice } from '@reduxjs/toolkit';

import constants from '../../lib/constants';

const { PROMPT } = constants;
export { PROMPT };

const initialState = {
  /*
    title = string | node,
    content = string | node,
    actions = [{
      label: string,
      appearance: 'primary' | 'secondary',
      onClick: (e) => e,
    }]
  */
};

export const promptSlice = createSlice({
  name: PROMPT,
  initialState,
  reducers: {
    openPrompt: (state, action) => {
      return { ...state, ...action.payload };
    },
    closePrompt: () => {
      return initialState;
    },
  },
});

export const { openPrompt, closePrompt } = promptSlice.actions;

export const selectPromptContents = (state) => state[PROMPT];
