// AuthService.ts
import { AxiosResponse } from 'axios';

import RegistrationsDTO from 'dtos/Registration/registration.dto';
import axiosClient from './axiosClient';
type paramI = {
    positionId: string,
    searchEmail?: string,
    Status?: number
}
type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
export const registrationService = {
    getRegistrationByPositionId: (params: paramI): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = '/admission/admission-post-registration/getAccountByPostPositionId';
        return axiosClient.get(url, { params });
    },
    updateRequest: (params: paramUpdate): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = `/admission/admission-post-registration/review-joinRequest?IsApproved=${params.IsApproved}`;
        return axiosClient.put(url, params.ids
        )
    }
};
