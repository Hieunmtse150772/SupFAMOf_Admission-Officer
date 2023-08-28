// AuthService.ts
import { AxiosResponse } from 'axios';

import PostTitleOption from 'dtos/postTitleOption.dto';
import axiosClient from './axiosClient';

export const postTitleService = {
    getPostTitle: (): Promise<AxiosResponse<PostTitleOption>> => {
        const url = '/admission/admission-post-title/getAll';
        return axiosClient.get(url);
    }
};
