// AuthService.ts
import axios, { AxiosResponse } from 'axios';
import { geocodingDto } from 'dtos/GoogleAPI/geocoding.dto';
import { paramI } from 'models/geocodingParam.model';


const URL = 'https://maps.googleapis.com/maps/api/geocode/'
export const googleApiService = {
    geocodingAPI: (params: paramI): Promise<AxiosResponse<geocodingDto>> => {
        const url = URL + `json?address=${encodeURIComponent(params?.address)}&key=${params?.key}`;
        return axios.get(url);
    }
};
