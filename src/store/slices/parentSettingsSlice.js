import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  settings: null,
  loading: false,
  error: null
}

const parentSettingsSlice = createSlice({
  name: "parentSettings",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setSettings: (state, action) => {
      state.settings = action.payload
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    }
  }
})

export const { 
  setLoading, 
  setError, 
  setSettings, 
  updateSettings 
} = parentSettingsSlice.actions

export default parentSettingsSlice.reducer