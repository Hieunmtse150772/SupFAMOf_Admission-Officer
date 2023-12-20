// AuthService.ts
import { AxiosResponse } from 'axios';

import AttendenceDto from 'dtos/Attendence/attendence.dto';
import WorkListDto from 'dtos/Registration/workLists.dto';
import SearchAttendanceParamsDto from 'dtos/searchAttendance.dto';
import SearchWorkListParamsDto from 'dtos/searchWorkList.dto';
import axiosClient from './axiosClient';
type paramI = {
    positionId: string,
}

type paramsConfirmAttendance = {
    positionId: string,
    data:
    {
        id: number,
        status: number
    }[]


}
export const attendenceService = {
    getAttendenceByPositionId: (params: SearchAttendanceParamsDto): Promise<AxiosResponse<AttendenceDto>> => {
        const url = '/admission/admission-attendance/getByPositionId';
        return axiosClient.get(url, { params });
    },
    confirmAttendance: (params: paramsConfirmAttendance): Promise<AxiosResponse<AttendenceDto>> => {
        const url = `/admission/admission-attendance/confirm-attendance/${params.positionId}`;
        return axiosClient.put(url, params.data);
    },
    getWorkListByPositionId: (params: SearchWorkListParamsDto): Promise<AxiosResponse<WorkListDto>> => {
        const url = '/admission/admission-post-registration/get-work-list-position';
        return axiosClient.get(url, { params });
    },
};
