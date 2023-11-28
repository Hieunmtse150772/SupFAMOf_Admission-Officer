import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { reportService } from 'services/report.service';

interface ReportState {
    loading: boolean,
    error: string | null,
    excelFile: Blob | null;
}

const initialState: ReportState = {
    excelFile: null,
    loading: false,
    error: '',
}

export const getReportAccountExcel = createAsyncThunk('reports/get-collab-list',
    async (_, { rejectWithValue }) => {
        try {
            const result = await reportService.getReportAccountExcel();
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const handleDownloadReport = createAsyncThunk(
    'reports/download-excel',
    async () => {
        try {
            const response = await reportService.getReportAccountExcel();
            const href = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'config.json'); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const collabSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReportAccountExcel.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getReportAccountExcel.fulfilled, (state, action) => {
                state.loading = false;
                state.excelFile = action.payload.data;
            })
            .addCase(getReportAccountExcel.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default collabSlice.reducer;
