import { createSlice } from '@reduxjs/toolkit';

import constants from '../../lib/constants';
const { DIALOG } = constants;
export { DIALOG };

const initialState = {
  /*
      title: string | node,
      content: string | node,
      footer: string | node,
      showHeader: true,
      showFooter: true,
      showRejectionButton: true,
      rejectionButtonLabel: 'Close',
      onRejection: () => {},
      rejectionButtonDisabled: false,
      showAffirmationButton: true,
      affirmationButtonLabel: 'Done',
      onAffirmation: () => {},
      affirmationButtonDisabled: false,
    */
};
export const dialogSlice = createSlice({
  name: DIALOG,
  initialState,
  reducers: {
    openDialog: (state, action) => {
      return { ...state, ...action.payload };
    },
    closeDialog: () => {
      return initialState;
    },
  },
});
export const { openDialog, closeDialog } = dialogSlice.actions;

export const selectDialogContents = (state) => state[DIALOG];
