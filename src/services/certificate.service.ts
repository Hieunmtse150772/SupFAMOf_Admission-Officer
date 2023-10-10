// AuthService.ts
import { AxiosResponse } from 'axios';

import CertificateOption from 'dtos/certificateOption.dto';
import CertificateCreated from 'models/certificate.model';
import axiosClient from './axiosClient';

export const certificateService = {
    getCertificate: (): Promise<AxiosResponse<CertificateOption>> => {
        const url = '/admission/admission-training-certificate/getAll?pagesize=100';
        return axiosClient.get(url);
    },
    createCertificate: (payload: CertificateCreated): Promise<AxiosResponse<CertificateOption>> => {
        const url = '/admission/admission-training-certificate/create';
        return axiosClient.post(url, payload);
    }
};
