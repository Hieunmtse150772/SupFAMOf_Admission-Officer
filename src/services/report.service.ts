// AuthService.ts
import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';

export const reportService = {
    getReportAccountExcel: (): Promise<AxiosResponse<Blob>> => {
        const url = '/admission/admission-financial-report/get-account-identity-excel';
        return axiosClient.post(url, {
            responseType: 'blob',
            headers: {
                Accept: '*/*',
            },
        })
    },
};
