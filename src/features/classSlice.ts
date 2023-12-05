import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ClassTrainingDto from 'dtos/class.dto';
import ClassCreated from 'models/classCreated.model';
import { ClassTrainingViewI } from 'models/classTraining.model';
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
            .addCase(createClass.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createClass.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default classSlice.reducer;
