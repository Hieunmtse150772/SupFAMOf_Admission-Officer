import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AttendenceDto from 'dtos/Attendence/attendence.dto';
import WorkListDto from 'dtos/Registration/workLists.dto';
import ErrorDto from 'dtos/error.dto';
import SearchAttendanceParamsDto from 'dtos/searchAttendance.dto';
import SearchWorkListParamsDto from 'dtos/searchWorkList.dto';
import AttendenceI from 'models/attendence.model';
import WorkLists from 'models/worklist.model';
import { attendenceService } from 'services/attendence.service';
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
    }[],
}
interface AttendenceState {
    attendanceList: AttendenceDto,
    loading: boolean,
    error: ErrorDto | null,
    workLists: WorkListDto
}

const initialState: AttendenceState = {
    attendanceList: {
        data: [] as AttendenceI[]
    },
    loading: false,
    error: null,
    workLists: {
        data: [] as WorkLists[]
    }
}
export const getAttendenceByPositionId = createAsyncThunk(
    'attendence/get-attendence',
    async (params: SearchAttendanceParamsDto, { rejectWithValue }) => {
        try {
            const result = await attendenceService.getAttendenceByPositionId(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const getWorkListsByPositionId = createAsyncThunk(
    'attendence/get-workLists',
    async (params: SearchWorkListParamsDto, { rejectWithValue }) => {
        try {
            const result = await attendenceService.getWorkListByPositionId(params)
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
                state.attendanceList = action.payload
                state.loading = false;
            })
            .addCase(getAttendenceByPositionId.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
            .addCase(getWorkListsByPositionId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWorkListsByPositionId.fulfilled, (state, action) => {
                state.workLists = action.payload
                state.loading = false;
            })
            .addCase(getWorkListsByPositionId.rejected, (state, action) => {
                state.error = action.payload as ErrorDto;
                state.loading = false;
            })
    },
});

export default attendenceSlice.reducer;
