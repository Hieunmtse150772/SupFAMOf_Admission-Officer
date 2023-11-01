// AuthService.ts
import { AxiosResponse } from 'axios';

import LoginUser from 'dtos/Auth/login.user.dto';
import updateAccountDto from 'dtos/Auth/update.account.dto';
import GetUserInfo from 'dtos/getUserInfo.dto';
import LoginGoogleDto from 'dtos/loginGoogle.dto';
import LoginDto from '../dtos/Auth/loginPayload.dto';
import LoginUserToken from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const authService = {
  login: (payload: LoginDto): Promise<AxiosResponse<LoginUserToken>> => {
    const url = '/admin/administration-account/login';
    return axiosClient.post(url, { ...payload });
  },
  loginGoogle: (payload: LoginGoogleDto): Promise<AxiosResponse<LoginUser>> => {
    const url = '/admission/admission-account/login';
    return axiosClient.post(url, { ...payload });
  },
  getUserProfile: (): Promise<AxiosResponse<GetUserInfo>> => {
    const url = '/admission/admission-account/getAccountByToken/authorization';
    return axiosClient.get(url);
  },
  updateUserProfile: (payload: updateAccountDto): Promise<AxiosResponse<GetUserInfo>> => {
    const url = `/admission/admission-account/update?accountId=${payload.accountId}`;
    return axiosClient.put(url, payload);
  },

  logout: () => {
    // Xử lý đăng xuất ở đây (nếu cần)
    // Gọi action `logout` để cập nhật trạng thái đăng nhập
  },
};
