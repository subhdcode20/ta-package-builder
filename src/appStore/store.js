import { configureStore } from '@reduxjs/toolkit'
import packBuilderReducer from '../PackageBuilder/packBuilderSlice.js';

export const store = configureStore({
  reducer: {
    packBuilderData: packBuilderReducer
  },
})