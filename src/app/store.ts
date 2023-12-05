// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import addressReducer from '../features/addressSlice';
import attendenceReducer from '../features/attendenceSlice';
import authReducer from '../features/authSlice';
import certificateReducer from '../features/certificateSlice';
import classReducer from '../features/classSlice';
import collabReducer from '../features/collabSlice';
import contractReducer from '../features/contractSlice';
import documentReducer from '../features/documentSlice';
import rgoogleApiReducer from '../features/googleAPISlice';
import leafLetReducer from '../features/leafLetAPISlice';
import dashboardReducer from '../features/manageDashboardSlice';
import postReducer from '../features/postSlice';
import postTitleReducer from '../features/postTitleSlice';
import registrationReducer from '../features/registrationSlice';
import reportReducer from '../features/reportSlice';
import requestReducer from '../features/requestSlice';


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
    contract: contractReducer,
    location: rgoogleApiReducer,
    locationLeafLet: leafLetReducer,
    request: requestReducer,
    report: reportReducer,
    class: classReducer,
    attendence: attendenceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
