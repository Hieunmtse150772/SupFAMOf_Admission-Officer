// AuthService.ts
import { AxiosResponse } from 'axios';

import SearchCollabParamDto from 'dtos/Collab/searchCollab.dto';
import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { BanParamsI, UnBanParamsI } from 'models/banParamsI.model';
import axiosClient from './axiosClient';

export const collabService = {
    getCollabList: (params: SearchCollabParamDto): Promise<AxiosResponse<CollabListDto>> => {
        const url = '/admission/admission-manage-collaborator/get-all-collab-accounts';
        return axiosClient.get(url, { params })
    },
    getCollabByPositionId: (id: string): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admission/admission-post/getAccountByPostPositionId';
        return axiosClient.get(url, {
            params: {
                positionId: id,
            },
        })
    },
    banCollaboratorById: (params: BanParamsI): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admin/admission-ban-account/create';
        return axiosClient.post(url, params)
    },
    updateBanCollaboratorById: (params: UnBanParamsI): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admin/admission-ban-account/update';
        return axiosClient.put(url, params)
    },

};
