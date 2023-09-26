import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import District from 'models/district.model';
import Province from 'models/province.model';
import Ward from 'models/ward.model';
import { addressService } from 'services/address.service';

interface AddressState {
    loading: boolean,
    error: string | null,
    province: Province[],
    ward: Ward[],
    district: District[]

}

const initialState: AddressState = {
    loading: false,
    error: null,
    province: [],
    ward: [],
    district: []
}

export const getProvince = createAsyncThunk(
    'address/get-province',
    async (_, { rejectWithValue }) => {
        try {
            const result = await addressService.getProvince()
            console.log('result: ', result)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const getDistrict = createAsyncThunk(
    'address/get-district',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await addressService.getDistrict(id)
            console.log('result: ', result)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const getWard = createAsyncThunk(
    'address/get-ward',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await addressService.getWard(id)
            console.log('result: ', result)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProvince.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getProvince.fulfilled, (state, action) => {
                state.province = action.payload.results;
                state.loading = false;
            })
            .addCase(getProvince.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getDistrict.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getDistrict.fulfilled, (state, action) => {
                state.district = action.payload.results;
                state.loading = false;
            })
            .addCase(getDistrict.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getWard.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getWard.fulfilled, (state, action) => {
                state.ward = action.payload.results;
                state.loading = false;
            })
            .addCase(getWard.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })

    },
});

export default addressSlice.reducer;
