import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface ModalState {
  [key: string]: boolean
}

const initialState: ModalState = {}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload

      state[name] = !state[name]
    },
    changeModal: (state, action: PayloadAction<{ name: string; value: boolean }>) => {
      const { name, value } = action.payload

      state[name] = value
    },
    initialModalState: () => initialState
  }
})

export const { toggleModal, changeModal, initialModalState } = modalSlice.actions

export default modalSlice.reducer
