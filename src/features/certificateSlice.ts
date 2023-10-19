import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import CertificateCreated from 'models/certificate.model';
import CertificateOptionI from 'models/certificateOption.model';
import { certificateService } from 'services/certificate.service';

interface CertificateState {
    certificateOption: CertificateOptionI[],
    loading: boolean,
    error: string | null,
}

const initialState: CertificateState = {
    certificateOption: [],
    loading: false,
    error: ''
}
export const getCertificate = createAsyncThunk(
    'auth/get-certificate',
    async (_, { rejectWithValue }) => {
        try {
            const result = await certificateService.getCertificate()
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const createCertificate = createAsyncThunk(
    'auth/create-certificate',
    async (payload: CertificateCreated, { rejectWithValue }) => {
        try {
            const result = await certificateService.createCertificate(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const certificateSlice = createSlice({
    name: 'certificate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCertificate.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCertificate.fulfilled, (state, action) => {
                state.certificateOption = action.payload.data
                state.loading = false;
            })
            .addCase(getCertificate.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(createCertificate.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(createCertificate.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCertificate.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default certificateSlice.reducer;
