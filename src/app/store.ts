// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import addressReducer from '../features/addressSlice';
import authReducer from '../features/authSlice';
import certificateReducer from '../features/certificateSlice';
import collabReducer from '../features/collabSlice';
import contractReducer from '../features/contractSlice';
import documentReducer from '../features/documentSlice';
import dashboardReducer from '../features/manageDashboardSlice';
import postReducer from '../features/postSlice';
import postTitleReducer from '../features/postTitleSlice';
import registrationReducer from '../features/registrationSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    postTitle: postTitleReducer,
    address: addressReducer,
    document: documentReducer,
    certificate: certificateReducer,
    collab: collabReducer,
    registration: registrationReducer,
    dashboard: dashboardReducer,
    contract: contractReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
