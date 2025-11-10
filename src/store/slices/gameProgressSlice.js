import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  progress: [],
  loading: false,
  error: null
}

const gameProgressSlice = createSlice({
  name: "gameProgress",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setProgress: (state, action) => {
      state.progress = action.payload
    },
    addProgress: (state, action) => {
      state.progress.push(action.payload)
    },
    updateProgress: (state, action) => {
      const index = state.progress.findIndex(p => 
        p.profileId === action.payload.profileId && 
        p.gameId === action.payload.gameId
      )
      if (index !== -1) {
        state.progress[index] = action.payload
      } else {
        state.progress.push(action.payload)
      }
    }
  }
})

export const { 
  setLoading, 
  setError, 
  setProgress, 
  addProgress, 
  updateProgress 
} = gameProgressSlice.actions

export default gameProgressSlice.reducer