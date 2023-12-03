import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import TrainingRegistrationDto from 'dtos/trainingRegistration.dto';
import CertificateCreated from 'models/certificate.model';
import CertificateOptionI from 'models/certificateOption.model';
import TrainingRegistrationI from 'models/trainingRegistrationI.model';
import { certificateService } from 'services/certificate.service';

interface CertificateState {
    certificateOption: CertificateOptionI[],
    trainingRegistration: TrainingRegistrationDto,
    loading: boolean,
    error: string | null,
}

const initialState: CertificateState = {
    certificateOption: [],
    trainingRegistration: {
        data: [] as TrainingRegistrationI[],
    }
    ,
    loading: false,
    error: ''
}
export const getCertificate = createAsyncThunk(
    'certificates/get-certificate',
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
export const getCertificateRegistration = createAsyncThunk(
    'certificates/get-certificate-registration',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await certificateService.getCertificateRegistration(id)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const createCertificate = createAsyncThunk(
    'certificates/create-certificate',
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
    'certificates/update-certificate',
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
    'certificates/delete-certificate',
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
    name: 'certificates',
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
            .addCase(getCertificateRegistration.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCertificateRegistration.fulfilled, (state, action) => {
                state.trainingRegistration = action.payload;
                state.loading = false;
            })
            .addCase(getCertificateRegistration.rejected, (state, action) => {
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
