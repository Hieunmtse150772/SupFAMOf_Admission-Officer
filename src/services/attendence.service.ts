// AuthService.ts
import { AxiosResponse } from 'axios';

import AttendenceDto from 'dtos/Attendence/attendence.dto';
import RegistrationsDTO from 'dtos/Registration/registration.dto';
import axiosClient from './axiosClient';
type paramI = {
    positionId: string,
}
type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
type paramCancel = {
    ids: number[],
}
export const attendenceService = {
    getAttendenceByPositionId: (params: paramI): Promise<AxiosResponse<AttendenceDto>> => {
        const url = '/admission/admission-attendance/getByPositionId';
        return axiosClient.get(url, { params });
    },
    updateRequest: (params: paramUpdate): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = `/admission/admission-post-registration/review-joinRequest?IsApproved=${params.IsApproved}`;
        return axiosClient.put(url, params.ids
        )
    },
    cancelRegistration: (params: paramCancel): Promise<AxiosResponse<RegistrationsDTO>> => {
        const url = `/admission/admission-post-registration/cancel-post-registration`;
        return axiosClient.delete(url, { data: params.ids }
        )
    }
};
