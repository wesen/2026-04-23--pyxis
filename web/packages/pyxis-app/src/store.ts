import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { appApi } from './api/appApi';

export function makeStore() {
  return configureStore({ reducer: { [appApi.reducerPath]: appApi.reducer }, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApi.middleware) });
}
export const store = makeStore();
setupListeners(store.dispatch);
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
