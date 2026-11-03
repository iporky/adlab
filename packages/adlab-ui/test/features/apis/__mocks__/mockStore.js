import { combineReducers, configureStore } from '@reduxjs/toolkit';

export const setupApiStore = (api, extraReducers) => {
  const getStore = () =>
    configureStore({
      reducer: combineReducers({
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      }),
      middleware: (gdm) => gdm({}).concat(api.middleware),
    });

  const initialStore = getStore();
  const refObj = {
    api,
    store: initialStore,
  };
  refObj.store = getStore();

  return refObj;
};
