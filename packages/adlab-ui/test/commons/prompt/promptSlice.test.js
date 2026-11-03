import { promptSlice, selectPromptContents } from '../../../src/commons/prompt/promptSlice';

describe('promptSlice tests', () => {
  const { openPrompt, closePrompt } = promptSlice.actions;
  const promptReducer = promptSlice.reducer;
  const initialState = {};

  it('should handle initial state', () => {
    expect(promptReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('openPrompt action updates state correctly', () => {
    const payload = {
      title: 'Test Prompt',
      content: 'This is a test prompt.',
      actions: [
        {
          label: 'OK',
          appearance: 'primary',
          onClick: () => {},
        },
      ],
    };
    const newState = promptReducer(initialState, openPrompt(payload));
    expect(newState).toEqual({ ...initialState, ...payload });
  });

  it('closePrompt action resets state to initial value', () => {
    const newState = promptReducer(initialState, closePrompt());
    expect(newState).toEqual({});
  });

  it('selectPromptContents selector returns correct part of state', () => {
    const state = {
      prompt: { title: 'Test Prompt', content: 'This is a test prompt.' },
    };
    const selectedState = selectPromptContents(state);
    expect(selectedState).toEqual(state.prompt);
  });
});
