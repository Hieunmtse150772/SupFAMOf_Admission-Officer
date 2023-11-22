import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { addressGeoApiDto } from 'dtos/GeoAPIFi/address.dto';
import { addressDto } from 'dtos/GoogleAPI/address.dto';
import { geocodingDto } from 'dtos/GoogleAPI/geocoding.dto';
import addressI from 'models/address.model';
import addressGeoApiI from 'models/addressGeoApi.model';
import geocodingI from 'models/geocoding.model';
import { paramI } from 'models/geocodingParam.model';
import { geoApiService } from 'services/geoAPI.service';
import { googleApiService } from 'services/googleAPI.service';

interface GoogleApiState {
    loading: boolean,
    error: string | null,
    location: geocodingDto,
    address: addressDto,
    addressGeoAPI: addressGeoApiDto,

}

const initialState: GoogleApiState = {
    loading: false,
    error: null,
    location: {
        results: [] as geocodingI[],
        status: ''
    },
    address: {
        predictions: [] as addressI[],
        status: ''
    },
    addressGeoAPI: {
        features: [] as addressGeoApiI[],
    }
}

export const geocodingApi = createAsyncThunk(
    'address/get-location',
    async (params: paramI, { rejectWithValue }) => {
        try {
            const result = await googleApiService.geocodingAPI(params)
            console.log('result: ', result)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const getGoogleAddress = createAsyncThunk(
    'address/get-address',
    async (params: paramI, { rejectWithValue }) => {
        try {
            const result = await googleApiService.addressAPI(params)
            console.log('result: ', result)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const getGeoApiFi = createAsyncThunk(
    'address/get-address-geoAPIfi',
    async (params: paramI, { rejectWithValue }) => {
        try {
            const result = await geoApiService.addressAPI(params)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
const googleApiSlice = createSlice({
    name: 'geocoding',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(geocodingApi.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(geocodingApi.fulfilled, (state, action) => {
                state.location = action.payload.data;
                state.loading = false;
            })
            .addCase(geocodingApi.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getGoogleAddress.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getGoogleAddress.fulfilled, (state, action) => {
                state.address = action.payload.data;
                state.loading = false;
            })
            .addCase(getGoogleAddress.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getGeoApiFi.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getGeoApiFi.fulfilled, (state, action) => {
                state.addressGeoAPI = action.payload.data;
                state.loading = false;
            })
            .addCase(getGeoApiFi.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default googleApiSlice.reducer;
