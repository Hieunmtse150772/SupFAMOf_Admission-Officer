import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AttendenceDto from 'dtos/Attendence/attendence.dto';
import ErrorDto from 'dtos/error.dto';
import AttendenceI from 'models/attendence.model';
import { attendenceService } from 'services/attendence.service';
import { registrationService } from 'services/registration.service';

interface AttendenceState {
    attendenceList: AttendenceDto,
    loading: boolean,
    error: ErrorDto | null,
}
type paramI = {
    positionId: string,
}
type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
type paramCancel = {
    ids: number[],
}
const initialState: AttendenceState = {
    attendenceList: {
        data: [] as AttendenceI[]
    },
    loading: false,
    error: null
}
export const getAttendenceByPositionId = createAsyncThunk(
    'attendence/get-attendence',
    async (params: paramI, { rejectWithValue }) => {
        try {
            const result = await attendenceService.getAttendenceByPositionId(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const confirmPositionByCollabList = createAsyncThunk(
    'attendence/update-attendence',
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
export const attendenceSlice = createSlice({
    name: 'attendence',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAttendenceByPositionId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAttendenceByPositionId.fulfilled, (state, action) => {
                state.attendenceList = action.payload
                state.loading = false;
            })
            .addCase(getAttendenceByPositionId.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
    },
});

export default attendenceSlice.reducer;
