import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import PostOptionI from 'models/postOption.model';
import PostTitleCreated from 'models/postTitle.model';
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
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const createPostTitle = createAsyncThunk(
    'auth/create-post-title',
    async (payload: PostTitleCreated, { rejectWithValue }) => {
        try {
            const result = await postTitleService.createPostTitle(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const updatePostTitle = createAsyncThunk(
    'auth/update-post-title',
    async (payload: PostTitleCreated, { rejectWithValue }) => {
        try {
            const result = await postTitleService.updatePostTitle(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const deletePostTitle = createAsyncThunk(
    'auth/delete-post-title',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await postTitleService.deletePostTitle(id)
            return result;
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
            .addMatcher(isAnyOf(createPostTitle.pending, updatePostTitle.pending, deletePostTitle.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(createPostTitle.fulfilled, updatePostTitle.fulfilled, deletePostTitle.fulfilled), (state) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(createPostTitle.rejected, updatePostTitle.rejected, deletePostTitle.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default postTitleSlice.reducer;
