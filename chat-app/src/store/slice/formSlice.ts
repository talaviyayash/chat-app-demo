import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface FormState {
  formData: {
    [key: string]: {
      [key: string]: unknown
    }
  }
  formError: {
    [key: string]: {
      [key: string]: unknown
    }
  }
}

const initialState: FormState = {
  formData: {},
  formError: {}
}

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    formChange: (
      state,
      action: PayloadAction<{
        name: string
        data: {
          [key: string]: unknown
        }
      }>
    ) => {
      const { name, data } = action.payload

      state.formData[name] = data
    },
    initialFormState: () => initialState
  }
})

export const { formChange, initialFormState } = formSlice.actions

export default formSlice.reducer
