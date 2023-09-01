import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import PostCreated from 'models/post.model';
import { postService } from 'services/post.service';

interface PostState {
    loading: boolean,
    error: string | null,
}

const initialState: PostState = {
    loading: false,
    error: ''
}
export const createPost = createAsyncThunk(
    'auth/create-post',
    async (payload: PostCreated, { rejectWithValue }) => {
        try {
            const result = await postService.createPost(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(createPost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default postSlice.reducer;
