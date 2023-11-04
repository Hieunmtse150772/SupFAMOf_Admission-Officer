// AuthService.ts
import { AxiosResponse } from 'axios';

import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import axiosClient from './axiosClient';

export const collabService = {
    getCollabList: (): Promise<AxiosResponse<CollabListDto>> => {
        const url = '/admission/admission-manage-collaborator/get-all-collab-accounts';
        return axiosClient.get(url)
    },
    getCollabByPositionId: (id: string): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admission/admission-post/getAccountByPostPositionId';
        return axiosClient.get(url, {
            params: {
                positionId: id,
            },
        })
    },

};
