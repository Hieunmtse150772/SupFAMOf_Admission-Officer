import { AxiosResponse } from 'axios';
import ExportDto from 'dtos/export.dto';
import { ParamsExportI } from 'models/paramsExport.model';
import axiosClient from './axiosClient';


export const reportService = {
    getReportAccountExcel: (): Promise<AxiosResponse<ExportDto | any>> => {
        const url = 'https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-account-excel';
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            }
        );
    },
    getMonthlyReportExcelOpenDay: (params: ParamsExportI): Promise<AxiosResponse<ExportDto | any>> => {
        const url = `https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-od-monthly-excel?Month=${params.Month}&Year=${params.Year}`;
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            },
        );
    },
    getMonthlyReportExcelTuyenSinh: (params: ParamsExportI): Promise<AxiosResponse<ExportDto | any>> => {
        const url = `https://dev.supfamof.id.vn/api/admission/admission-financial-report/get-tuyen-sinh-monthly-excel?Month=${params.Month}&Year=${params.Year}`;
        return axiosClient.post(
            url,
            '',
            {
                responseType: 'blob',
            }
        );
    },
};
