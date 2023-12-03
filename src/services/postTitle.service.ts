// AuthService.ts
import { AxiosResponse } from 'axios';

import PostTitleOption from 'dtos/postTitleOption.dto';
import PostTitleCreated from 'models/postTitle.model';
import axiosClient from './axiosClient';

export const postTitleService = {
    getPostTitle: (): Promise<AxiosResponse<PostTitleOption>> => {
        const url = '/admission/admission-post-category/getAll?pagesize=100';
        return axiosClient.get(url);
    },
    createPostTitle: (payload: PostTitleCreated): Promise<AxiosResponse<PostTitleOption>> => {
        const url = '/admission/admission-post-category/create';
        return axiosClient.post(url, payload);
    }
    ,
    updatePostTitle: (payload: PostTitleCreated): Promise<AxiosResponse<PostTitleOption>> => {
        const url = `/admission/admission-post-category/update?postCategoryId=${payload.postCategoryId}`;
        return axiosClient.put(url, payload);
    }
    ,
    deletePostTitle: (postCategoryId: number): Promise<AxiosResponse<PostTitleOption>> => {
        const url = `/admission/admission-post-category/disable?postCategoryId=${postCategoryId}`;
        return axiosClient.put(url);
    }
};
