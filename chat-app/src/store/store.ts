import { configureStore } from "@reduxjs/toolkit";

import type { AppState } from "./slice/appSlice";
import appReducer from "./slice/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = {
  app: AppState;
};

export default store;

export type AppDispatch = typeof store.dispatch;
