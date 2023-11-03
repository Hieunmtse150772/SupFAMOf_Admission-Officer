// AuthService.ts
import { AxiosResponse } from 'axios';

import { Collab } from 'dtos/collab.dto';
import { CollabList } from 'dtos/collabList.dto';
import axiosClient from './axiosClient';

export const collabService = {
    getCollabList: (): Promise<AxiosResponse<CollabList>> => {
        const url = '/admission/admission-financial-report/get-account-report';
        return axiosClient.get(url)
    },
    getCollabByPositionId: (id: string): Promise<AxiosResponse<Collab>> => {
        const url = '/admission/admission-post/getAccountByPostPositionId';
        return axiosClient.get(url, {
            params: {
                positionId: id,
            },
        })
    },

};
