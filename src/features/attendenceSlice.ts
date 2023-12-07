import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AttendenceDto from 'dtos/Attendence/attendence.dto';
import ErrorDto from 'dtos/error.dto';
import AttendenceI from 'models/attendence.model';
import { attendenceService } from 'services/attendence.service';

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
export type paramsConfirmAttendance = {
    positionId: string,
    data:
    {
        id: number,
        status: number
    }[]


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

export const confirmAttendanceByPositionId = createAsyncThunk(
    'attendence/confirm-attendence',
    async (params: paramsConfirmAttendance, { rejectWithValue }) => {
        try {
            const result = await attendenceService.confirmAttendance(params)
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
