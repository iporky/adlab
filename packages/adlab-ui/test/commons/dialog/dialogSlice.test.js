import { dialogSlice, selectDialogContents } from '../../../src/commons/dialog/dialogSlice';

describe('dialogSlice tests', () => {
  const { openDialog, closeDialog } = dialogSlice.actions;
  const dialogReducer = dialogSlice.reducer;
  const initialState = {};

  it('should handle initial state', () => {
    expect(dialogReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
  describe('actions test', function () {
    it('openDialog action updates state correctly', () => {
      const payload = {
        title: 'Test Dialog',
        content: 'This is a test dialog.',
      };
      const newState = dialogReducer(initialState, openDialog(payload));
      expect(newState).toEqual({ ...initialState, ...payload });
    });

    it('closeDialog action resets state to initial value', () => {
      const newState = dialogReducer(initialState, closeDialog());
      expect(newState).toEqual({});
    });
  });
  describe('selectors tests', function () {
    it('selectDialogContents selector returns correct part of state', () => {
      const state = {
        dialog: { title: 'Test Dialog', content: 'This is a test dialog.' },
      };
      const selectedState = selectDialogContents(state);
      expect(selectedState).toEqual(state.dialog);
    });
  });
});
