import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { addressDto } from 'dtos/GoogleAPI/address.dto';
import { geocodingDto } from 'dtos/GoogleAPI/geocoding.dto';
import addressI from 'models/address.model';
import geocodingI from 'models/geocoding.model';
import { paramI } from 'models/geocodingParam.model';
import { googleApiService } from 'services/googleAPI.service';

interface GoogleApiState {
    loading: boolean,
    error: string | null,
    location: geocodingDto,
    address: addressDto,

}

const initialState: GoogleApiState = {
    loading: false,
    error: null,
    location: {
        results: [] as geocodingI[],
        status: ''
    },
    address: {
        results: [] as addressI[],
        status: ''
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

export const googleApiSlice = createSlice({
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
    },
});

export default googleApiSlice.reducer;
