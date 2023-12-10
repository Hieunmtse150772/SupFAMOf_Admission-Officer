// AuthService.ts
import { AxiosResponse } from 'axios';

import { ApplicationListDto } from 'dtos/Application/applicationList.dto';
import SearchApplicationParams from 'dtos/Application/searchApplication.dto';
import axiosClient from './axiosClient';

type paramUpdate = {
    reportId: number,
    replyNote: string
}
export const applicationService = {
    getApplication: (params: SearchApplicationParams): Promise<AxiosResponse<ApplicationListDto>> => {
        const url = '/admission/admission-manage-collaborator/admission-replied-application';
        return axiosClient.get(url, { params })
    },
    approveApplication: (params: paramUpdate): Promise<AxiosResponse<ApplicationListDto>> => {
        const url = `/admission/admission-manage-collaborator/approve-request?reportId=${params.reportId}`;
        return axiosClient.put(url, { replyNote: params.replyNote }
        )
    },
    rejectApplication: (params: paramUpdate): Promise<AxiosResponse<ApplicationListDto>> => {
        const url = `/admission/admission-manage-collaborator/reject-request?reportId=${params.reportId}`;
        return axiosClient.put(url, { replyNote: params.replyNote }
        )
    }
};
