// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/authSlice';
import postReducer from '../features/postSlice';
import postTitleReducer from '../features/postTitleSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    postTitle: postTitleReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
