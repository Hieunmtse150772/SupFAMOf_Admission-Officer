import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import MoneyYearReportDto from 'dtos/Dashboard/moneyYearReport.dto';
import { dashboardService } from 'services/dashboard.service';

interface DashboardState {
    collabOverview: CollabOverView,
    loading: boolean,
    error: string | null,
    moneyReport: MoneyYearReportDto
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
    },
    moneyReport: {
        data: [] as number[],
    }

}
export const getCollabOverview = createAsyncThunk(
    'dashboard/get-collab-overview',
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
export const getMoneyYearReport = createAsyncThunk(
    'dashboard/get-money-year-report',
    async (params: { year: number }, { rejectWithValue }) => {
        try {
            const result = await dashboardService.getMoneyYearReport(params)
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
            .addCase(getMoneyYearReport.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getMoneyYearReport.fulfilled, (state, action) => {
                state.moneyReport = action.payload
                state.loading = false;
            })
            .addCase(getMoneyYearReport.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default manageDashboardSlice.reducer;
