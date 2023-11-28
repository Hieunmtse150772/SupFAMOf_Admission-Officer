import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RegistrationsDTO from 'dtos/Registration/registration.dto';
import ErrorDto from 'dtos/error.dto';
import Registrations from 'models/registration.model';
import { registrationService } from 'services/registration.service';

interface RegistrationState {
    registrationList: RegistrationsDTO,
    loading: boolean,
    error: ErrorDto | null,
}
type paramI = {
    positionId: string,
    searchEmail?: string,
    Status?: number
}
type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
type paramCancel = {
    ids: number[],
}
const initialState: RegistrationState = {
    registrationList: {
        data: [] as Registrations[]
    },
    loading: false,
    error: null
}
export const getRegistrationByPositionId = createAsyncThunk(
    'registration/get-registration',
    async (params: paramI, { rejectWithValue }) => {
        try {
            const result = await registrationService.getRegistrationByPositionId(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const confirmPositionByCollabList = createAsyncThunk(
    'registration/update-registration',
    async (params: paramUpdate, { rejectWithValue }) => {
        try {
            const result = await registrationService.updateRequest(params)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const cancelRegistration = createAsyncThunk(
    'registration/cancel-registration',
    async (params: paramCancel, { rejectWithValue }) => {
        try {
            const result = await registrationService.cancelRegistration(params)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRegistrationByPositionId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRegistrationByPositionId.fulfilled, (state, action) => {
                state.registrationList = action.payload
                state.loading = false;
            })
            .addCase(getRegistrationByPositionId.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
            .addCase(confirmPositionByCollabList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmPositionByCollabList.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(confirmPositionByCollabList.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
            .addCase(cancelRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelRegistration.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(cancelRegistration.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
    },
});

export default registrationSlice.reducer;
