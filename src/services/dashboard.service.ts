// AuthService.ts
import { AxiosResponse } from 'axios';

import AnalyticsDto from 'dtos/Dashboard/analyticsDto.dto';
import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import MoneyYearReportDto from 'dtos/Dashboard/moneyYearReport.dto';
import RegistrationOverViewDto from 'dtos/Dashboard/registrationOverView.dto';
import axiosClient from './axiosClient';

export const dashboardService = {
    getCollabOverview: (): Promise<AxiosResponse<CollabOverView>> => {
        const url = '/admission/admission-manage-collaborator/viewNumber';
        return axiosClient.get(url);
    },
    getAnalyticsOverview: (params: { month: number, year: number }): Promise<AxiosResponse<AnalyticsDto>> => {
        const url = '/admission/admission-manage-collaborator/viewAnalytics';
        return axiosClient.get(url, { params });
    },
    getRegistrationOverView: (): Promise<AxiosResponse<RegistrationOverViewDto>> => {
        const url = '/admission/admission-manage-collaborator/viewCompleteRegistration';
        return axiosClient.get(url);
    },
    getMoneyYearReport: (params: { year: number }): Promise<AxiosResponse<MoneyYearReportDto>> => {
        const url = '/admission/admission-financial-report/get-money-year-report';
        return axiosClient.get(url, { params });
    }
};
