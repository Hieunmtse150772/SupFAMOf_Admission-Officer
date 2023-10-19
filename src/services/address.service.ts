// AuthService.ts
import axios, { AxiosResponse } from 'axios';

import DistrictI from 'dtos/Address/district.dto';
import ProvinceI from 'dtos/Address/province.dto';
import WardI from 'dtos/Address/ward.dto';

const URL = 'https://vapi.vnappmob.com'
const ULRCoordinates = ''
export const addressService = {
    getProvince: (): Promise<AxiosResponse<ProvinceI>> => {
        const url = URL + '/api/province/';
        return axios.get(url);
    },
    getDistrict: (id: string): Promise<AxiosResponse<DistrictI>> => {
        const url = URL + `/api/province/district/${id}`;
        return axios.get(url)
    },
    getWard: (id: string): Promise<AxiosResponse<WardI>> => {
        const url = URL + `/api/province/ward/${id}`;
        return axios.get(url)
    },
    getCoordinates: (id: string): Promise<AxiosResponse<WardI>> => {
        const url = URL + `/api/province/ward/${id}`;
        return axios.get(url)
    }
};
