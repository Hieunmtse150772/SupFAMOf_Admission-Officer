// AuthService.ts
import { AxiosResponse } from 'axios';

import { CollabDto } from 'dtos/collab.dto';
import { ContractDto } from 'dtos/contract.dto';
import axiosClient from './axiosClient';

export const contractService = {
    getContractList: (): Promise<AxiosResponse<ContractDto>> => {
        const url = '/admin/admission-contract/getAll';
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
