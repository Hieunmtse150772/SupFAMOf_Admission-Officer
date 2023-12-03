import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ClassTrainingDto from 'dtos/class.dto';
import CertificateCreated from 'models/certificate.model';
import { ClassTrainingViewI } from 'models/classTraining.model';
import { certificateService } from 'services/certificate.service';
import { classTrainingService } from 'services/classTraining.service';

interface ClassState {
    classList: ClassTrainingDto,
    loading: boolean,
    error: string | null,
}

const initialState: ClassState = {
    classList: {
        data: [] as ClassTrainingViewI[],
    }
    ,
    loading: false,
    error: ''
}
export const getClassTraining = createAsyncThunk(
    'class/get-class',
    async (_, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.getClassTraining()
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const createCertificate = createAsyncThunk(
    'class/create-certificate',
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

export const classSlice = createSlice({
    name: 'class',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClassTraining.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getClassTraining.fulfilled, (state, action) => {
                state.classList = action.payload
                state.loading = false;
            })
            .addCase(getClassTraining.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default classSlice.reducer;
