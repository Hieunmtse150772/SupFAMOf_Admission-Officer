// AuthService.ts
import { AxiosResponse } from 'axios';

import PostCreated from 'models/post.model';
import LoginUserToken from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const postService = {
    createPost: (payload: PostCreated): Promise<AxiosResponse<LoginUserToken>> => {
        const url = '/admission/admission-post/create';
        return axiosClient.post(url, { ...payload });
    }
};
