// AuthService.ts
import { AxiosResponse } from 'axios';

import ContractInfoDto from 'dtos/Contract/contractInfo.dto';
import SearchCollabContractParamDto from 'dtos/Contract/searchCollabContract.dto';
import SearchContractDto from 'dtos/Contract/searchContract.dto';
import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { ContractDto } from 'dtos/contract.dto';
import { ContractListDto } from 'dtos/contractList.dto';
import CompleteContractParams from 'models/completeContractParams.model';
import ContractCreated from 'models/contractCreated.model';
import ContractUpdated from 'models/contractUpdated.model';
import SendContractParams from 'models/sendContractParams.model';
import axiosClient from './axiosClient';

export const contractService = {
    createContract: (params: ContractCreated): Promise<AxiosResponse<ContractDto>> => {
        const url = '/admission/admission-contract/create';
        return axiosClient.post(url, { ...params })
    },
    updateContract: (params: ContractUpdated): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/update?contractId=${params.contractId}`;
        return axiosClient.put(url, params)
    },
    getContractList: (params: SearchContractDto): Promise<AxiosResponse<ContractListDto>> => {
        const url = '/admission/admission-contract/getAll';
        return axiosClient.get(url, { params })
    },
    getContracById: (id: string): Promise<AxiosResponse<ContractInfoDto>> => {
        const url = `/admission/admission-contract/getById?contractId=${id}`;
        return axiosClient.get(url)
    },
    getCollabByContractId: (params: SearchCollabContractParamDto): Promise<AxiosResponse<CollabListDto>> => {
        const url = `/admission/admission-contract/getCollaboratorContract?contractId=${params.contractId}`;
        return axiosClient.get(url, {
            params: {
                search: params.search
            }
        })
    },
    sendContractEmail: (params: SendContractParams): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/sendContractEmail?contractId=${params.contractId}`;
        return axiosClient.post(url, params.accountIds)
    },
    deleteContract: (contractId: string): Promise<AxiosResponse<ContractDto>> => {
        const url = `/admission/admission-contract/disable?contractId=${contractId}`;
        return axiosClient.put(url)
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
