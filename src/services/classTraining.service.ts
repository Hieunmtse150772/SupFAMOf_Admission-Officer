// AuthService.ts
import { AxiosResponse } from 'axios';

import ClassTrainingDto from 'dtos/class.dto';
import ClassCreated from 'models/classCreated.model';
import axiosClient from './axiosClient';

export const classTrainingService = {
    getClassTraining: (): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url);
    },
    createClass: (payload: ClassCreated): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/create-class-interview';
        return axiosClient.post(url, payload);
    }
};
