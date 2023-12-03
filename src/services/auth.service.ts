// AuthService.ts
import axios, { AxiosResponse } from 'axios';

import LoginUser from 'dtos/Auth/login.user.dto';
import updateAccountDto from 'dtos/Auth/update.account.dto';
import GetUserInfo from 'dtos/getUserInfo.dto';
import LoginAdminDto from 'dtos/login.admin.dto';
import LoginGoogleDto from 'dtos/loginGoogle.dto';
import LoginDto from '../dtos/Auth/loginPayload.dto';
import axiosClient from './axiosClient';

export const authService = {

  login: (payload: LoginDto): Promise<AxiosResponse<LoginAdminDto>> => {
    const url = 'https://dev.supfamof.id.vn/api/admin/administration-account/login';
    return axios.post(url, { ...payload });
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
  updateAvatar: (imgUrl: string): Promise<AxiosResponse<GetUserInfo>> => {
    const url = `/admission/admission-account/updateAvatar`;
    return axiosClient.put(url, { imgUrl });
  },

  logout: () => {
    // Xử lý đăng xuất ở đây (nếu cần)
    // Gọi action `logout` để cập nhật trạng thái đăng nhập
  },
};
