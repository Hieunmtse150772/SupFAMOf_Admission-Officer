import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ClassTrainingDto from 'dtos/class.dto';
import AllClassTrainingDto from 'dtos/classList.dto';
import SearchParamsDto from 'dtos/searchParams.dto';
import { ConfirmAdtendanceRoom } from 'models/ConfirmAdtendanceRoom.model';
import ClassCreated from 'models/classCreated.model';
import { ClassTrainingI, ClassTrainingViewI } from 'models/classTraining.model';
import { classTrainingService } from 'services/classTraining.service';

interface ClassState {
    classList: ClassTrainingDto,
    allClassList: AllClassTrainingDto
    loading: boolean,
    error: string | null,
}

const initialState: ClassState = {
    classList: {
        data: [] as ClassTrainingViewI[],
    }
    ,
    allClassList: {
        data: [] as ClassTrainingI[]
    },
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
export const getAllClassTraining = createAsyncThunk(
    'class/get-all-class',
    async (params: SearchParamsDto, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.getAllClassTraining(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const confirmAttendanceByEvenDayId = createAsyncThunk(
    'class/confirm-attendance',
    async (params: ConfirmAdtendanceRoom, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.confirmAttendance(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const createClass = createAsyncThunk(
    'class/create-class',
    async (payload: ClassCreated, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.createClass(payload)
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
            .addCase(getAllClassTraining.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getAllClassTraining.fulfilled, (state, action) => {
                state.allClassList = action.payload
                state.loading = false;
            })
            .addCase(getAllClassTraining.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(createClass.pending, confirmAttendanceByEvenDayId.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(createClass.fulfilled, confirmAttendanceByEvenDayId.fulfilled), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(createClass.rejected, confirmAttendanceByEvenDayId.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default classSlice.reducer;
