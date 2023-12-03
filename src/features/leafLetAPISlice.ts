import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import geocodingLeafLetI from 'models/geocodingLeafLet.model';
import { paramLeafLetI } from 'models/geocodingParam.model';
import { leafLetApiService } from 'services/leafLetAPI.service';

interface LeafLetApiState {
    loading: boolean,
    error: string | null,
    location: geocodingLeafLetI[],

}

const initialState: LeafLetApiState = {
    loading: false,
    error: null,
    location: []
}

export const geocodingLeafLetApi = createAsyncThunk(
    'geocodingLeafLet/get-location-leaflet',
    async (params: paramLeafLetI, { rejectWithValue }) => {
        try {
            const result = await leafLetApiService.geocodingLeafLetAPI(params)
            console.log('result: ', result)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const leafLetApiSlice = createSlice({
    name: 'geocodingLeafLet',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(geocodingLeafLetApi.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(geocodingLeafLetApi.fulfilled, (state, action) => {
                state.location = action.payload.data;
                state.loading = false;
            })
            .addCase(geocodingLeafLetApi.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default leafLetApiSlice.reducer;
