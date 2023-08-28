import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import PostOptionI from 'models/postOption.model';
import { postTitleService } from 'services/postTitle.service';

interface PostTitleState {
    postTitleOption: PostOptionI[],
    loading: boolean,
    error: string | null,
}

const initialState: PostTitleState = {
    postTitleOption: [],
    loading: false,
    error: ''
}
export const getPostTitle = createAsyncThunk(
    'auth/get-post-title',
    async (_, { rejectWithValue }) => {
        try {
            const result = await postTitleService.getPostTitle()
            console.log("ressult: ", result)
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const postTitleSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPostTitle.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getPostTitle.fulfilled, (state, action) => {
                state.postTitleOption = action.payload.data
                state.loading = false;
            })
            .addCase(getPostTitle.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default postTitleSlice.reducer;
