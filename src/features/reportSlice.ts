import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { ParamsExportI } from 'models/paramsExport.model';
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
            return response;

        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const handleDownloadMonthLyReportOpenDay = createAsyncThunk(
    'reports/download-monthly-excel-openday',
    async (parmas: ParamsExportI) => {
        try {
            const response = await reportService.getMonthlyReportExcelOpenDay(parmas); // Gọi service để nhận dữ liệu từ server
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
            return response;
        } catch (error) {
            // Xử lý lỗi nếu cần
        }
    }
);
export const handleDownloadMonthLyReportTuyenSinh = createAsyncThunk(
    'reports/download-monthly-excel-tuyensinh',
    async (params: ParamsExportI) => {
        try {
            const response = await reportService.getMonthlyReportExcelTuyenSinh(params); // Gọi service để nhận dữ liệu từ server
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
            return response;

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
            return response;
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
            .addMatcher(isAnyOf(
                handleDownloadAccountReport.pending,
                handleDownloadMonthLyReportTuyenSinh.pending,
                handleDownloadMonthLyReportOpenDay.pending
            ), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(
                handleDownloadAccountReport.fulfilled,
                handleDownloadMonthLyReportTuyenSinh.fulfilled,
                handleDownloadMonthLyReportOpenDay.fulfilled
            ), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(handleDownloadAccountReport.rejected,
                handleDownloadMonthLyReportTuyenSinh.rejected,
                handleDownloadMonthLyReportOpenDay.rejected
            ), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default collabSlice.reducer;
