import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Collab } from 'dtos/collab.dto';
import CollabInfo from 'models/collab.model';
import { collabService } from 'services/collab.service';

interface CollabState {
    loading: boolean,
    error: string | null,
    collabs: Collab | null,
    isDeleted: boolean,
}

const initialState: CollabState = {
    loading: false,
    error: '',
    collabs: {
        data: [] as CollabInfo[]
    },
    isDeleted: false
}

export const getCollabByPositionId = createAsyncThunk('collabs/get-collab-byPositionId',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await collabService.getCollabByPositionId(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const collabSlice = createSlice({
    name: 'collabs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCollabByPositionId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCollabByPositionId.fulfilled, (state, action) => {
                state.loading = false;
                state.collabs = action.payload.data
            })
            .addCase(getCollabByPositionId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default collabSlice.reducer;
