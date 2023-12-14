// AuthService.ts
import { AxiosResponse } from 'axios';

import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import MoneyYearReportDto from 'dtos/Dashboard/moneyYearReport.dto';
import axiosClient from './axiosClient';

export const dashboardService = {
    getCollabOverview: (): Promise<AxiosResponse<CollabOverView>> => {
        const url = '/admission/admission-manage-collaborator/viewNumber';
        return axiosClient.get(url);
    },
    getMoneyYearReport: (params: { year: number }): Promise<AxiosResponse<MoneyYearReportDto>> => {
        const url = '/admission/admission-financial-report/get-money-year-report';
        return axiosClient.get(url, { params });
    }
};
