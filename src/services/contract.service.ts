// AuthService.ts
import { AxiosResponse } from 'axios';

import SearchContractDto from 'dtos/Contract/searchContract.dto';
import { CollabDto } from 'dtos/collab.dto';
import { ContractDto } from 'dtos/contract.dto';
import { ContractListDto } from 'dtos/contractList.dto';
import ContractCreated from 'models/contractCreated.model';
import SendContractParams from 'models/sendContractParams.model';
import axiosClient from './axiosClient';

export const contractService = {
    createContract: (params: ContractCreated): Promise<AxiosResponse<ContractDto>> => {
        const url = '/admission/admission-contract/create';
        return axiosClient.post(url, { ...params })
    },
    getContractList: (params: SearchContractDto): Promise<AxiosResponse<ContractListDto>> => {
        const url = '/admission/admission-contract/getAll';
        return axiosClient.get(url, { params })
    },
    sendContractEmail: (params: SendContractParams): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/sendContractEmail?contractId=${params.contractId}`;
        return axiosClient.post(url, params.accountIds)
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
