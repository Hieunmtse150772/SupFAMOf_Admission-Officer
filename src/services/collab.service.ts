// AuthService.ts
import { AxiosResponse } from 'axios';

import SearchCollabParamDto from 'dtos/Collab/searchCollab.dto';
import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { BanParamsI, UnBanParamsI } from 'models/banParamsI.model';
import { GiveCertificateParamsI } from 'models/giveCertificate.model';
import { RemoveCertificateParamsI } from 'models/removeCertificate.model';
import axiosClient from './axiosClient';

export const collabService = {
    getCollabList: (params: SearchCollabParamDto): Promise<AxiosResponse<CollabListDto>> => {
        const url = '/admission/admission-manage-collaborator/get-all-collab-accounts';
        return axiosClient.get(url, { params })
    },
    searchCollabListByEmail: (params: SearchCollabParamDto): Promise<AxiosResponse<CollabListDto>> => {
        const url = '/admission/admission-manage-collaborator/search';
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
        const url = '/admission/admission-ban-account/create';
        return axiosClient.post(url, params)
    },
    updateBanCollaboratorById: (params: UnBanParamsI): Promise<AxiosResponse<CollabDto>> => {
        const url = `/admission/admission-ban-account/update?accountBannedId=${params.accountBannedId}`;
        return axiosClient.put(url, params)
    },
    giveCertificateByAccountId: (params: GiveCertificateParamsI): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admission/admission-account-certificate/create';
        return axiosClient.post(url, params)
    },
    removeCertificateByAccountId: (params: RemoveCertificateParamsI): Promise<AxiosResponse<CollabDto>> => {
        const url = '/admission/admission-account-certificate/update';
        return axiosClient.put(url, params)
    },
    updateCollaboratorToPremium: (collaboratorAccountId: string): Promise<AxiosResponse<CollabDto>> => {
        const url = `/admission/admission-manage-collaborator/update-collab-credential?collaboratorAccountId=${collaboratorAccountId}`;
        return axiosClient.put(url)
    },
    removeCollaboratorPremium: (collaboratorAccountId: string): Promise<AxiosResponse<CollabDto>> => {
        const url = `/admission/admission-manage-collaborator/disbale-collab-credential?collaboratorAccountId=${collaboratorAccountId}`;
        return axiosClient.put(url)
    },


};
