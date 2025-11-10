import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null
}

const childProfileSlice = createSlice({
  name: "childProfile",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setProfiles: (state, action) => {
      state.profiles = action.payload
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload
    },
    addProfile: (state, action) => {
      state.profiles.push(action.payload)
    },
    updateProfile: (state, action) => {
      const index = state.profiles.findIndex(p => p.Id === action.payload.Id)
      if (index !== -1) {
        state.profiles[index] = action.payload
      }
      if (state.currentProfile && state.currentProfile.Id === action.payload.Id) {
        state.currentProfile = action.payload
      }
    }
  }
})

export const { 
  setLoading, 
  setError, 
  setProfiles, 
  setCurrentProfile, 
  addProfile, 
  updateProfile 
} = childProfileSlice.actions

export default childProfileSlice.reducer