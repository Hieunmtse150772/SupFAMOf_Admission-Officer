import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ApplicationListDto } from 'dtos/Application/applicationList.dto';
import SearchApplicationParams from 'dtos/Application/searchApplication.dto';
import { ApplicationI } from 'models/application.model';
import { applicationService } from 'services/application.service';

interface ApplicationState {
    loading: boolean,
    error: string | null,
    applications: ApplicationListDto;
}
type paramUpdate = {
    reportId: number,
    replyNote: string
}
const initialState: ApplicationState = {
    loading: false,
    error: '',
    applications: {
        data: [] as ApplicationI[]
    },
}

export const getApplicationList = createAsyncThunk('application/get-application-by-AccountId',
    async (params: SearchApplicationParams, { rejectWithValue }) => {
        try {
            const result = await applicationService.getApplication(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const approveApplication = createAsyncThunk('application/approve-application-by-reportId',
    async (params: paramUpdate, { rejectWithValue }) => {
        try {
            const result = await applicationService.approveApplication(params);
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const rejectApplication = createAsyncThunk('application/reject-application-by-reportId',
    async (params: paramUpdate, { rejectWithValue }) => {
        try {
            const result = await applicationService.rejectApplication(params);
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getApplicationList.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getApplicationList.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
            })
            .addCase(getApplicationList.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(approveApplication.pending, rejectApplication.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(approveApplication.fulfilled, rejectApplication.fulfilled), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(approveApplication.rejected, rejectApplication.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })

    },
});

export default applicationSlice.reducer;
