// AuthService.ts
import axios, { AxiosResponse } from 'axios';
import { addressDto } from 'dtos/GoogleAPI/address.dto';
import { geocodingDto } from 'dtos/GoogleAPI/geocoding.dto';
import { paramI } from 'models/geocodingParam.model';


const URL = 'https://maps.googleapis.com/maps/api'
export const googleApiService = {
    geocodingAPI: (params: paramI): Promise<AxiosResponse<geocodingDto>> => {
        const url = URL + `/geocode/json?address=${encodeURIComponent(params?.address)}&key=${params?.key}`;
        return axios.get(url);
    },
    addressAPI: (params: paramI): Promise<AxiosResponse<addressDto>> => {
        const url = URL + `/place/autocomplete/json?input=${params.address}&key=${params?.key}`;
        return axios.get(url);
    }
};
