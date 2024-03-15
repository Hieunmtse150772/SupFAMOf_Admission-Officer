import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AnalyticsDto from 'dtos/Dashboard/analyticsDto.dto';
import CollabOverView from 'dtos/Dashboard/collabOverView.dto';
import MoneyYearReportDto from 'dtos/Dashboard/moneyYearReport.dto';
import RegistrationOverViewDto from 'dtos/Dashboard/registrationOverView.dto';
import { dashboardService } from 'services/dashboard.service';

interface DashboardState {
    collabOverview: CollabOverView,
    loading: boolean,
    error: string | null,
    moneyReport: MoneyYearReportDto,
    totalRegistration: RegistrationOverViewDto,
    analytics: AnalyticsDto
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
            ],
            totalPost: 0
        }
    },
    totalRegistration: {
        data: {
            totalRegistration: 0
        }
    },
    moneyReport: {
        data: [] as number[],
    },
    analytics: {
        data: {
            collaboratorCompleteJob: 0,
            collaboratorNeeded: 0
        }
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
export const getRegistrationComplete = createAsyncThunk(
    'dashboard/get-registration-complete',
    async (_, { rejectWithValue }) => {
        try {
            const result = await dashboardService.getRegistrationOverView()
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const getAnalytics = createAsyncThunk(
    'dashboard/get-analytics-overview',
    async (params: { month: number, year: number }, { rejectWithValue }) => {
        try {
            const result = await dashboardService.getAnalyticsOverview(params)
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
            .addCase(getRegistrationComplete.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getRegistrationComplete.fulfilled, (state, action) => {
                state.totalRegistration = action.payload
                state.loading = false;
            })
            .addCase(getRegistrationComplete.rejected, (state, action) => {
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
            .addCase(getAnalytics.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload
                state.loading = false;
            })
            .addCase(getAnalytics.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default manageDashboardSlice.reducer;
