import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
export const handleDownloadAccountReport = createAsyncThunk(
    'reports/download-excel',
    async () => {
        try {

            const response = await reportService.getReportAccountExcel(); // Gọi service để nhận dữ liệu từ server
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // Tạo một URL tạm thời cho blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'account_report.xlsx');
            document.body.appendChild(link);
            link.click();

            // Xóa đường link và URL tạm thời
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const handleDownloadMonthLyReport = createAsyncThunk(
    'reports/download-monthly-excel',
    async () => {
        try {

            const response = await reportService.getMonthlyReportExcel(); // Gọi service để nhận dữ liệu từ server
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // Tạo một URL tạm thời cho blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'monthly_report.xlsx');
            document.body.appendChild(link);
            link.click();

            // Xóa đường link và URL tạm thời
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const handleDownloadMonthLyReportTuyenSinh = createAsyncThunk(
    'reports/download-monthly-excel-tuyensinh',
    async () => {
        try {

            const response = await reportService.getMonthlyReportExcel(); // Gọi service để nhận dữ liệu từ server
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // Tạo một URL tạm thời cho blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'monthly_report.xlsx');
            document.body.appendChild(link);
            link.click();

            // Xóa đường link và URL tạm thời
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const handleDownloadReport = createAsyncThunk(
    'reports/download-excel',
    async () => {
        try {

            const response = await reportService.getReportAccountExcel(); // Gọi service để nhận dữ liệu từ server
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // Tạo một URL tạm thời cho blob
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'account_report.xlsx');
            document.body.appendChild(link);
            link.click();

            // Xóa đường link và URL tạm thời
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
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
            .addCase(handleDownloadAccountReport.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(handleDownloadAccountReport.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(handleDownloadAccountReport.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default collabSlice.reducer;
