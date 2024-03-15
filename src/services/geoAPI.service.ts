// AuthService.ts
import axios, { AxiosResponse } from 'axios';
import { addressGeoApiDto } from 'dtos/GeoAPIFi/address.dto';
import { paramI } from 'models/geocodingParam.model';


const URL = 'https://api.geoapify.com/v1/geocode/'
export const geoApiService = {
    addressAPI: (params: paramI): Promise<AxiosResponse<addressGeoApiDto>> => {
        const url = URL + `autocomplete?text=${params.address}&apiKey=${params.key}`;
        return axios.get(url);
    }
};
