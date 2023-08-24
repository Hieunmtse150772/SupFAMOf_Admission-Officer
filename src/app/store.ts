// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/authSlice';
// import accountReducer from '../features/accountSlice'
// import dashboardReducer from '../features/dashboardSlice'
// import userReducer from '../features/userSlice'
// import requestReducer from '../features/requestSlice'
// import voucherReducer from '../features/voucherSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // account: accountReducer,
    // dashboard: dashboardReducer,
    // user: userReducer,
    // request: requestReducer,
    // voucher: voucherReducer
    // Thêm reducers khác nếu cần thiết
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
