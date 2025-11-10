import { configureStore } from "@reduxjs/toolkit"
import childProfileReducer from "@/store/slices/childProfileSlice"
import gameProgressReducer from "@/store/slices/gameProgressSlice"
import parentSettingsReducer from "@/store/slices/parentSettingsSlice"
import achievementReducer from "@/store/slices/achievementSlice"

export const store = configureStore({
  reducer: {
    childProfile: childProfileReducer,
    gameProgress: gameProgressReducer,
    parentSettings: parentSettingsReducer,
    achievements: achievementReducer,
  },
})