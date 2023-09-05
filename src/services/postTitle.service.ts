// AuthService.ts
import { AxiosResponse } from 'axios';

import PostTitleOption from 'dtos/postTitleOption.dto';
import PostTitleCreated from 'models/postTitle.model';
import axiosClient from './axiosClient';

export const postTitleService = {
    getPostTitle: (): Promise<AxiosResponse<PostTitleOption>> => {
        const url = '/admission/admission-post-title/getAll?pagesize=100';
        return axiosClient.get(url);
    },
    createPostTitle: (payload: PostTitleCreated): Promise<AxiosResponse<PostTitleOption>> => {
        const url = '/admission/admission-post-title/create';
        return axiosClient.post(url, payload);
    }
};
