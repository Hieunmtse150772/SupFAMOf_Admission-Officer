import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RequestDto from 'dtos/Request/request.dto';
import SearchRequestParamsDto from 'dtos/Request/searchRequest.dto';
import RequestInfo from 'models/request.model';
import { requestService } from 'services/request.service';

interface RequestState {
    loading: boolean,
    error: string | null,
    requests: RequestDto;
}
type paramUpdate = {
    ids: number[],
    IsApproved: boolean
}
const initialState: RequestState = {
    loading: false,
    error: '',
    requests: {
        data: [] as RequestInfo[]
    },
}

export const getRequestByAccountId = createAsyncThunk('request/get-request-by-AccountId',
    async (params: SearchRequestParamsDto, { rejectWithValue }) => {
        try {
            const result = await requestService.getRequestByAccountId(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const updateRequest = createAsyncThunk('request/update-request-by-requestId',
    async (params: paramUpdate, { rejectWithValue }) => {
        try {
            const result = await requestService.updateRequest(params);
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })

export const postSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRequestByAccountId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getRequestByAccountId.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload.data;
            })
            .addCase(getRequestByAccountId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(updateRequest.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(updateRequest.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateRequest.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })

    },
});

export default postSlice.reducer;
