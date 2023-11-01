import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import { dashboardService } from 'services/dashboard.service';

interface DashboardState {
    collabOverview: CollabOverView,
    loading: boolean,
    error: string | null,
}

const initialState: DashboardState = {
    loading: false,
    error: '',
    collabOverview: {
        data: {
            totalCollaborator: 0,
            newCollaborators: [
                {
                    imgUrl: ''
                }
            ]
        }
    }
}
export const getCollabOverview = createAsyncThunk(
    'auth/get-document',
    async (_, { rejectWithValue }) => {
        try {
            const result = await dashboardService.getCollabOverview()
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);

export const manageDashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCollabOverview.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCollabOverview.fulfilled, (state, action) => {
                state.collabOverview = action.payload
                state.loading = false;
            })
            .addCase(getCollabOverview.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default manageDashboardSlice.reducer;
