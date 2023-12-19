import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AdmissionDto } from 'dtos/Admission/admission.dto';
import SearchAdmissionParamsDto from 'dtos/Admission/searchAdmission.dto';
import AdmissionInfo from 'models/admission.model';
import { admissionService } from 'services/admission.service';

interface AdmissionState {
    loading: boolean,
    error: string | null,
    admissionList: AdmissionDto,
}

const initialState: AdmissionState = {
    loading: false,
    error: '',
    admissionList: {
        data: [] as AdmissionInfo[]
    },
}
export const getAdmission = createAsyncThunk('admissions/get-admission-list',
    async (params: SearchAdmissionParamsDto, { rejectWithValue }) => {
        try {
            const result = await admissionService.getAdmission(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const updatePermission = createAsyncThunk('admissions/update-permission-post',
    async (params: number, { rejectWithValue }) => {
        try {
            const result = await admissionService.updatePermission(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const disablePermission = createAsyncThunk('admissions/disable-permission-post',
    async (params: number, { rejectWithValue }) => {
        try {
            const result = await admissionService.disablePermission(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const admissionSlice = createSlice({
    name: 'admissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdmission.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getAdmission.fulfilled, (state, action) => {
                state.loading = false;
                state.admissionList = action.payload.data
            })
            .addCase(getAdmission.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default admissionSlice.reducer;
