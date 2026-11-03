import { homeSlice, localeSelector } from '../../../src/features/home/homeSlice';

describe('homeSlice tests', () => {
  const { updateLocale } = homeSlice.actions;
  const homeReducer = homeSlice.reducer;
  const initialState = { lang: undefined, locale: undefined };

  it('should handle initial state', () => {
    expect(homeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('updateLocale action updates state correctly', () => {
    const payload = { lang: 'en-US', locale: 'en-US' };
    const newState = homeReducer(initialState, updateLocale(payload));
    expect(newState).toEqual({ ...initialState, ...payload });
  });

  it('localeSelector selector returns correct part of state', () => {
    const state = {
      home: { lang: 'en-US', locale: 'en-US' },
    };
    const selectedState = localeSelector(state);
    expect(selectedState).toEqual(state.home.locale);
  });
});
