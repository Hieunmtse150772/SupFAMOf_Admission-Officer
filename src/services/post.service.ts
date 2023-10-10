// AuthService.ts
import { AxiosResponse } from 'axios';

import PostI from 'dtos/Post/Post View/post.dto';
import SearchPostParams from 'dtos/Post/Post View/searchPost.dto';
import { PostCreatedV2, PostUpdated } from 'models/postCreated.model';
import { PostInfo } from 'models/postInfo.model';
import LoginUserToken from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const postService = {
    createPost: (payload: PostCreatedV2): Promise<AxiosResponse<LoginUserToken>> => {
        const url = '/admission/admission-post/create';
        return axiosClient.post(url, { ...payload });
    },
    getPostByAccountId: (params: SearchPostParams): Promise<AxiosResponse<PostI>> => {
        const url = '/admission/admission-post/getByAccountId';
        return axiosClient.get(url, { params })
    },
    getPostByPostId: (id: string): Promise<AxiosResponse<PostInfo>> => {
        const url = '/admission/admission-post/getByPostCode';
        return axiosClient.get(url, {
            params: {
                postCode: id,
            },
        })
    },
    updatePostById: (params: PostUpdated): Promise<AxiosResponse<PostInfo>> => {
        const url = `/admission/admission-post/update?postId=${params.postId}`;
        return axiosClient.put(url, params)
    },
    deletePostById: (id: string): Promise<AxiosResponse<PostInfo>> => {
        const url = '/admission/admission-post/post/delete';
        return axiosClient.delete(url, {
            params: {
                postId: id,
            },
        })
    }
};
