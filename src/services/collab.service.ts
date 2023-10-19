// AuthService.ts
import { AxiosResponse } from 'axios';

import { Collab } from 'dtos/collab.dto';
import axiosClient from './axiosClient';

export const collabService = {
    getCollabByPositionId: (id: string): Promise<AxiosResponse<Collab>> => {
        const url = '/admission/admission-post/getAccountByPostPositionId';
        return axiosClient.get(url, {
            params: {
                positionId: id,
            },
        })
    },

};
