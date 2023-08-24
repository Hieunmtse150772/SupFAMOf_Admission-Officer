// AuthService.ts
import { AxiosResponse } from 'axios';

import LoginUser from 'dtos/login.user.dto';
import LoginGoogleDto from 'dtos/loginGoogle.dto';
import LoginDto from '../dtos/login.dto';
import LoginUserToken from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const authService = {
  login: (payload: LoginDto): Promise<AxiosResponse<LoginUserToken>> => {
    const url = '/auth/admin/login';
    return axiosClient.post(url, { ...payload });
  },
  loginGoogle: (payload: LoginGoogleDto): Promise<AxiosResponse<LoginUser>> => {
    const url = '/admission/admission-account/login';
    return axiosClient.post(url, { ...payload });
  },
  getUserProfile: (): Promise<AxiosResponse<LoginUser>> => {
    const url = '/admission/admission-account/getAccountByToken/authorization';
    return axiosClient.get(url);
  },
  updateUserProfile: (): Promise<AxiosResponse<LoginUser>> => {
    const url = '/admission/admission-account/update';
    return axiosClient.put(url);
  },

  logout: () => {
    // Xử lý đăng xuất ở đây (nếu cần)
    // Gọi action `logout` để cập nhật trạng thái đăng nhập
  },
};
