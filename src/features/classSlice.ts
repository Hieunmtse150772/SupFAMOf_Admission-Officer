import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchRoomParamsDto from 'dtos/SearchRoomParams.dto';
import ClassTrainingDto from 'dtos/class.dto';
import AllClassTrainingDto from 'dtos/classList.dto';
import SearchParamsDto from 'dtos/searchParams.dto';
import { ConfirmAdtendanceRoom } from 'models/ConfirmAdtendanceRoom.model';
import ClassCreated from 'models/classCreated.model';
import { ClassTrainingI, ClassTrainingViewI } from 'models/classTraining.model';
import ClassUpdated from 'models/classUpdated.model';
import { classTrainingService } from 'services/classTraining.service';

interface ClassState {
    classList: ClassTrainingDto,
    allClassList: AllClassTrainingDto,
    loading: boolean,
    error: string | null,
    classInfo: ClassTrainingI | null
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
    error: '',
    classInfo: null
}
export const getClassTraining = createAsyncThunk(
    'class/get-class',
    async (params: SearchRoomParamsDto, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.getClassTraining(params)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const getClassById = createAsyncThunk(
    'class/get-class-by-id',
    async (params: SearchRoomParamsDto, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.getClassById(params)
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
export const updateClass = createAsyncThunk(
    'class/update-class',
    async (payload: ClassUpdated, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.updateClass(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const deleteClassById = createAsyncThunk(
    'class/delete-class',
    async (trainingEventDay: string, { rejectWithValue }) => {
        try {
            const result = await classTrainingService.deleteClassById(trainingEventDay)
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
            .addCase(getClassById.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getClassById.fulfilled, (state, action) => {
                state.classInfo = action.payload.data[0]
                state.loading = false;
            })
            .addCase(getClassById.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(createClass.pending, confirmAttendanceByEvenDayId.pending, deleteClassById.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(createClass.fulfilled, confirmAttendanceByEvenDayId.fulfilled, deleteClassById.fulfilled), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(createClass.rejected, confirmAttendanceByEvenDayId.rejected, deleteClassById.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default classSlice.reducer;
