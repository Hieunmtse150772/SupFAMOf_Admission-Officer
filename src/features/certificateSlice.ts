import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
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
export const updateCertificate = createAsyncThunk(
    'auth/update-certificate',
    async (payload: CertificateCreated, { rejectWithValue }) => {
        try {
            const result = await certificateService.updateCertificate(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const deleteCertificate = createAsyncThunk(
    'auth/delete-certificate',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await certificateService.deleteCertificate(id)
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
            .addMatcher(isAnyOf(createCertificate.pending, updateCertificate.pending, deleteCertificate.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(createCertificate.fulfilled, updateCertificate.fulfilled, deleteCertificate.fulfilled), (state) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(createCertificate.rejected, updateCertificate.rejected, deleteCertificate.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })

    },
});

export default certificateSlice.reducer;
