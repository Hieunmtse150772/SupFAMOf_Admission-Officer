// AuthService.ts
import { AxiosResponse } from 'axios';

import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import axiosClient from './axiosClient';

export const dashboardService = {
    getCollabOverview: (): Promise<AxiosResponse<CollabOverView>> => {
        const url = '/admission/admission-manage-collaborator';
        return axiosClient.get(url);
    }
};
