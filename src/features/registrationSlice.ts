import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RegistrationsDTO from 'dtos/Registration/registration.dto';
import Registrations from 'models/registration.model';
import { registrationService } from 'services/registration.service';

interface RegistrationState {
    registrationList: RegistrationsDTO,
    loading: boolean,
    error: string | null,
}

const initialState: RegistrationState = {
    registrationList: {
        data: [] as Registrations[]
    },
    loading: false,
    error: ''
}
export const getRegistrationByPositionId = createAsyncThunk(
    'auth/get-registration',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await registrationService.getRegistrationByPositionId(id)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const confirmPositionByCollabList = createAsyncThunk(
    'auth/update-registration',
    async (id: number[], { rejectWithValue }) => {
        try {
            const result = await registrationService.updateRequest(id)
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
                state.error = "";
            })
            .addCase(getRegistrationByPositionId.fulfilled, (state, action) => {
                state.registrationList = action.payload.data
                state.loading = false;
            })
            .addCase(getRegistrationByPositionId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(confirmPositionByCollabList.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(confirmPositionByCollabList.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(confirmPositionByCollabList.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default registrationSlice.reducer;
