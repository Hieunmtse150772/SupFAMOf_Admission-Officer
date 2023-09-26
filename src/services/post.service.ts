// AuthService.ts
import { AxiosResponse } from 'axios';

import PostI from 'dtos/Post/Post View/post.dto';
import PostCreated from 'models/postCreated.model';
import { PostInfo } from 'models/postInfo.model';
import LoginUserToken from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const postService = {
    createPost: (payload: PostCreated): Promise<AxiosResponse<LoginUserToken>> => {
        const url = '/admission/admission-post/create';
        return axiosClient.post(url, { ...payload });
    },
    getPostByAccountId: (): Promise<AxiosResponse<PostI>> => {
        const url = '/admission/admission-post/getByAccountId';
        return axiosClient.get(url)
    },
    getPostByPostId: (id: string): Promise<AxiosResponse<PostInfo>> => {
        const url = '/admission/admission-post/getByPostCode';
        return axiosClient.get(url, {
            params: {
                postCode: id,
            },
        })
    },
    updatePostById: (params: PostCreated): Promise<AxiosResponse<PostInfo>> => {
        const url = '/admission/admission-post/updatePost';
        return axiosClient.put(url, params)
    }
};
