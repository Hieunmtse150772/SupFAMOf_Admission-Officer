import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';


export const reportService = {
    getReportAccountExcel: (): Promise<AxiosResponse> => {
        const url = 'https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-account-excel';
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            }
        );
    },
    getMonthlyReportExcel: (): Promise<AxiosResponse> => {
        const url = 'https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-tuyen-sinh-monthly-excel';
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            }
        );
    },
    getMonthlyReportExcelTuyenSinh: (): Promise<AxiosResponse> => {
        const url = 'https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-tuyen-sinh-monthly-excel';
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            }
        );
    },
};
