// AuthService.ts
import { AxiosResponse } from 'axios';

import CertificateOption from 'dtos/certificateOption.dto';
import ClassTrainingDto from 'dtos/class.dto';
import CertificateCreated from 'models/certificate.model';
import axiosClient from './axiosClient';

export const classTrainingService = {
    getClassTraining: (): Promise<AxiosResponse<ClassTrainingDto>> => {
        const url = '/admission/admission-training-certificate/view-collaborator-class';
        return axiosClient.get(url);
    },
    createCertificate: (payload: CertificateCreated): Promise<AxiosResponse<CertificateOption>> => {
        const url = '/admission/admission-training-certificate/create';
        return axiosClient.post(url, payload);
    }
};
