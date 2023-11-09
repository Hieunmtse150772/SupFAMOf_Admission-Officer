// AuthService.ts
import axios, { AxiosResponse } from 'axios';
import geocodingLeafLetI from 'models/geocodingLeafLet.model';
import { paramLeafLetI } from 'models/geocodingParam.model';


const URL = 'https://nominatim.openstreetmap.org/search'
export const leafLetApiService = {
    geocodingLeafLetAPI: (params: paramLeafLetI): Promise<AxiosResponse<geocodingLeafLetI[]>> => {
        const url = URL;
        return axios.get(url, { params });
    }
};
