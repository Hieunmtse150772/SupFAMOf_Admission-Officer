// AuthService.ts
import { AxiosResponse } from 'axios';

import SearchCollabContractParamDto from 'dtos/Contract/searchCollabContract.dto';
import SearchContractDto from 'dtos/Contract/searchContract.dto';
import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { ContractDto } from 'dtos/contract.dto';
import { ContractListDto } from 'dtos/contractList.dto';
import CompleteContractParams from 'models/completeContractParams.model';
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
    getCollabByContractId: (params: SearchCollabContractParamDto): Promise<AxiosResponse<CollabListDto>> => {
        const url = `/admission/admission-contract/getCollaboratorContract?contractId=${params.contractId}`;
        return axiosClient.get(url, { params })
    },
    sendContractEmail: (params: SendContractParams): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/sendContractEmail?contractId=${params.contractId}`;
        return axiosClient.post(url, params.accountIds)
    },
    completeContractByAccountContractId: (params: CompleteContractParams): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/complete?accountContractId=${params.accountContractId}`;
        return axiosClient.put(url)
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
