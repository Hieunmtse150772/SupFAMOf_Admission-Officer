// AuthService.ts
import { AxiosResponse } from 'axios';

import PostIDto from 'dtos/Post/Post View/post.dto';
import PostInfoDto from 'dtos/Post/Post View/postInfo.dto';
import SearchPostParams from 'dtos/Post/Post View/searchPost.dto';
import { PostDto } from 'dtos/postInfo.dto';
import { PostCreatedV2, PostUpdated } from 'models/postCreated.model';
import LoginUserTokenDto from '../dtos/login.userToken.model';
import axiosClient from './axiosClient';

export const postService = {
    createPost: (payload: PostCreatedV2): Promise<AxiosResponse<LoginUserTokenDto>> => {
        const url = '/admission/admission-post/create';
        return axiosClient.post(url, { ...payload });
    },
    getPostByAccountId: (params: SearchPostParams): Promise<AxiosResponse<PostIDto>> => {
        const url = '/admission/admission-post/getByAccountId';
        return axiosClient.get(url, { params })
    },
    getPostByPostId: (id: string): Promise<AxiosResponse<PostInfoDto>> => {
        const url = '/admission/admission-post/getByPostCode';
        return axiosClient.get(url, {
            params: {
                postCode: id,
            },
        })
    },
    updatePostById: (params: PostUpdated): Promise<AxiosResponse<PostDto>> => {
        const url = `/admission/admission-post/update?postId=${params.postId}`;
        return axiosClient.put(url, params)
    },
    deletePostById: (id: string): Promise<AxiosResponse<PostDto>> => {
        const url = '/admission/admission-post/post/delete';
        return axiosClient.delete(url, {
            params: {
                postId: id,
            },
        })
    },
    confirmPostByCollabList: (id: number[]): Promise<AxiosResponse<PostDto>> => {
        const url = 'api/admission/admission-post-registration/review-updateRequest';
        return axiosClient.put(url, {
            params: {
                postId: id,
            },
        })
    },
    confirmRunningPost: (postId: number): Promise<AxiosResponse<PostDto>> => {
        const url = `/admission/admission-post/confirmRunningPost?postId=${postId}`;
        return axiosClient.put(url)
    },
    confirmEndPost: (postId: number): Promise<AxiosResponse<PostDto>> => {
        const url = `/admission/admission-post/confirmEndPost?postId=${postId}`;
        return axiosClient.put(url)
    },
    confirmReopen: (postId: number): Promise<AxiosResponse<PostDto>> => {
        const url = `/admission/admission-post/confirmEndPost?postId=${postId}`;
        return axiosClient.put(url)
    }
};
