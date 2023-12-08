// AuthService.ts
import { AxiosResponse } from 'axios';

import ClassTrainingDto from 'dtos/class.dto';
import AllClassTrainingDto from 'dtos/classList.dto';
import SearchParamsDto from 'dtos/searchParams.dto';
import { ConfirmAdtendanceRoom } from 'models/ConfirmAdtendanceRoom.model';
import ClassCreated from 'models/classCreated.model';
import axiosClient from './axiosClient';

export const classTrainingService = {
    getClassTraining: (): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url);
    },
    getAllClassTraining: (params: SearchParamsDto): Promise<AxiosResponse<AllClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url, { params });
    },
    confirmAttendance: (params: ConfirmAdtendanceRoom): Promise<AxiosResponse<AllClassTrainingDto>> => {
        const url = `/admission/admission-training-certificate/confirm-registration-in-event-day?eventDayId=${params.eventDayId}`;
        return axiosClient.put(url, params.data);
    },
    createClass: (payload: ClassCreated): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/create-class-interview';
        return axiosClient.post(url, payload);
    }
};
