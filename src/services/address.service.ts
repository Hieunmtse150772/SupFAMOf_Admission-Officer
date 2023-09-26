// AuthService.ts
import axios, { AxiosResponse } from 'axios';

import DistrictI from 'dtos/Address/district.dto';
import ProvinceI from 'dtos/Address/province.dto';
import WardI from 'dtos/Address/ward.dto';

const URL = 'https://vapi.vnappmob.com'

export const addressService = {
    getProvince: (): Promise<AxiosResponse<ProvinceI>> => {
        const url = URL + '/api/province/';
        return axios.get(url);
    },
    getDistrict: (id: number): Promise<AxiosResponse<DistrictI>> => {
        const url = URL + '/api/distprict/';
        return axios.get(url, {
            params: {
                province_id: id,
            },
        })
    },
    getWard: (id: number): Promise<AxiosResponse<WardI>> => {
        const url = URL + '/api/ward/';
        return axios.get(url, {
            params: {
                district_id: id,
            },
        })
    }
};
