// AuthService.ts
import { AxiosResponse } from 'axios';

import SearchRoomParamsDto from 'dtos/SearchRoomParams.dto';
import ClassTrainingDto from 'dtos/class.dto';
import AllClassTrainingDto from 'dtos/classList.dto';
import SearchParamsDto from 'dtos/searchParams.dto';
import { ConfirmAdtendanceRoom } from 'models/ConfirmAdtendanceRoom.model';
import ClassCreated from 'models/classCreated.model';
import ClassUpdated from 'models/classUpdated.model';
import axiosClient from './axiosClient';

export const classTrainingService = {
    getClassTraining: (params: SearchRoomParamsDto): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url, { params });
    },
    getClassById: (params: SearchRoomParamsDto): Promise<AxiosResponse<AllClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url, { params });
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
    ,
    updateClass: (payload: ClassUpdated): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = `/admission/admission-training-certificate/update-event-day?eventDayId=${payload.id}`;
        return axiosClient.put(url, payload);
    }
    ,
    deleteClassById: (trainingEventDay: string): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = `/admission/admission-training-certificate/cancel-event-day?trainingEventDay=${trainingEventDay}`;
        return axiosClient.delete(url);
    }
};
