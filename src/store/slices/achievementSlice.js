import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  achievements: [],
  loading: false,
  error: null
}

const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setAchievements: (state, action) => {
      state.achievements = action.payload
    },
    addAchievement: (state, action) => {
      state.achievements.push(action.payload)
    }
  }
})

export const { 
  setLoading, 
  setError, 
  setAchievements, 
  addAchievement 
} = achievementSlice.actions

export default achievementSlice.reducer