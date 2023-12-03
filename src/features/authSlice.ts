import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import LoginDto from 'dtos/Auth/loginPayload.dto';
import updateAccountDto from 'dtos/Auth/update.account.dto';
import LoginAdminDto from 'dtos/login.admin.dto';
import { signInWithPopup } from 'firebase/auth';
import UserInfo from 'models/userInfor.model';
import UserInfoLogin from 'models/userInforLogin.model';
import AppConstants from '../enums/app';
import { auth, provider } from '../firebase';
import { authService } from '../services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfoLogin | null;
  userInfo: UserInfo;
  loading: boolean,
  error: string | null,
  adminInfo: LoginAdminDto | null
  // Thêm các trường khác liên quan đến người dùng nếu cần thiết
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: '',
  userInfo: {
    id: 0,
    roleId: 0,
    accountInformationId: 0,
    name: '',
    email: '',
    phone: '',
    imgUrl: '',
    postPermission: false,
    isPremium: false,
    isActive: false,
    createAt: '',
    updateAt: '',
    accountMonthlyReport: {
      totalPost: 0,
      totalSalary: 0
    },
    accountInformations: [],
    dateOfBirth: new Date()
  },
  adminInfo: null
}
export const loginGoogle = createAsyncThunk(
  'auth/login-google',
  async (_, { rejectWithValue }) => {
    try {
      const response = await signInWithPopup(auth, provider);
      const accessToken = await response.user.getIdToken(true);
      const result = await authService.loginGoogle({ idToken: accessToken, fcmToken: "" })
      localStorage.setItem(AppConstants.ACCESS_TOKEN, result.data.data.access_token);
      localStorage.setItem(AppConstants.USER, JSON.stringify(result.data.data.account));
      return result.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const getUserProfile = createAsyncThunk(
  'auth/get-user_profile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getUserProfile()
      return result.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const updateAvatar = createAsyncThunk(
  'auth/update-avatar',
  async (payload: string, { rejectWithValue }) => {
    try {

      const result = await authService.updateAvatar(payload)
      return result.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const updateUserProfile = createAsyncThunk(
  'auth/update-user_profile',
  async (payload: updateAccountDto, { rejectWithValue }) => {
    try {

      const result = await authService.updateUserProfile(payload)
      return result.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const loginAdministrator = createAsyncThunk('auth/login_admin',
  async (payload: LoginDto, { rejectWithValue }) => {
    try {
      const result = await authService.login(payload);
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  })
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginAdministrator.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.adminInfo = action.payload.data
      })
      .addMatcher(
        isAnyOf(getUserProfile.fulfilled, updateUserProfile.fulfilled, updateAvatar.fulfilled),
        (state, action) => {
          state.userInfo = action.payload.data;
          state.error = '';
          state.loading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          loginAdministrator.pending,
          loginGoogle.pending,
          getUserProfile.pending,
          updateUserProfile.pending,
          updateAvatar.pending
        ),
        state => {
          state.loading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          loginAdministrator.rejected,
          loginGoogle.rejected,
          getUserProfile.rejected,
          updateUserProfile.rejected,
          updateAvatar.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = String(action.payload);
        },
      )

  },
});

export default authSlice.reducer;
