import { configureStore } from '@reduxjs/toolkit'
import useReducer from './counterSlice.js'
export const store = configureStore({
    reducer: {
        user: useReducer
    },
})