import { configureStore } from "@reduxjs/toolkit";

import type { AppState } from "./slice/appSlice";
import appReducer from "./slice/appSlice";
import type { ApiState } from "./slice/apiSlice";
import apiReducer from "./slice/apiSlice";
import type { FormState } from "./slice/formSlice";
import formReducer from "./slice/formSlice";
import type { ModalState } from "./slice/modalSlice";
import modalReducer from "./slice/modalSlice";
import type { DataState } from "./slice/dataSlice";
import dataReducer from "./slice/dataSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    api: apiReducer,
    form: formReducer,
    modal: modalReducer,
    data: dataReducer,
  },
});

export type RootState = {
  api: ApiState;
  app: AppState;
  form: FormState;
  modal: ModalState;
  data: DataState;
};

export default store;

export type AppDispatch = typeof store.dispatch;
