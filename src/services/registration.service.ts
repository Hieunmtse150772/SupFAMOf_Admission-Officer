// AuthService.ts
import { AxiosResponse } from 'axios';

import RegistrationsDTO from 'dtos/Registration/registration.dto';
import axiosClient from './axiosClient';

export const registrationService = {
    getRegistrationByPositionId: (id: number): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = `/admission/admission-post-registration/getAccountByPostPositionId?positionId=${id}`;
        return axiosClient.get(url);
    },
    updateRequest: (ids: number[]): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = `/admission/admission-post-registration/review-joinRequest?IsApproved=true`;
        return axiosClient.put(url, ids
        )
    }
};
