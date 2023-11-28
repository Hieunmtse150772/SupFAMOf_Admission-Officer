// AuthService.ts
import { AxiosResponse } from 'axios';

import RequestDto from 'dtos/Request/request.dto';
import SearchRequestParamsDto from 'dtos/Request/searchRequest.dto';
import axiosClient from './axiosClient';

type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
export const requestService = {
    getRequestByAccountId: (params: SearchRequestParamsDto): Promise<AxiosResponse<RequestDto>> => {
        const url = '/admission/admission-post-registration/get-postRegistrationUpdateRequest-by-Admission-AccountId';
        return axiosClient.get(url, { params })
    },
    updateRequest: (params: paramUpdate): Promise<AxiosResponse<RequestDto>> => {
        const url = `/admission/admission-post-registration/review-updateRequest?IsApproved=${params.IsApproved}`;
        return axiosClient.put(url, { ids: params.ids }
        )
    }
};
