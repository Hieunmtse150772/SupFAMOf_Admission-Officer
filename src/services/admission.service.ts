// AuthService.ts
import { AxiosResponse } from 'axios';

import { AdmissionDto } from 'dtos/Admission/admission.dto';
import SearchAdmissionParamsDto from 'dtos/Admission/searchAdmission.dto';
import { CollabDto } from 'dtos/collab.dto';
import axiosClient from './axiosClient';

export const admissionService = {
    getAdmission: (params: SearchAdmissionParamsDto): Promise<AxiosResponse<AdmissionDto>> => {
        const url = '/admin/administration-manage-admission/getAll';
        return axiosClient.get(url)
    },
    updatePermission: (admissionAccountId: number): Promise<AxiosResponse<CollabDto>> => {
        const url = `/admin/administration-manage-admission/upgradeCredential?admissionAccountId=${admissionAccountId}`;
        return axiosClient.put(url)
    },
    disablePermission: (admissionAccountId: number): Promise<AxiosResponse<CollabDto>> => {
        const url = `/admin/administration-manage-admission/disableCredential?admissionAccountId=${admissionAccountId}`;
        return axiosClient.put(url)
    },

};
