import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface DataState {
  [key: string]: unknown;
}

const initialState: DataState = {};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addPayloadData: (
      state,
      action: PayloadAction<{ name: string; data: unknown }>
    ) => {
      const { name, data } = action.payload;

      state[name] = data;
    },
    initialDataState: () => initialState,
  },
});

export const { addPayloadData, initialDataState } = dataSlice.actions;

export default dataSlice.reducer;
