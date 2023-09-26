import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import PostI from 'dtos/Post/Post View/post.dto';
import Post from 'models/post.model';
import PostCreated from 'models/postCreated.model';
import { PostInfo } from 'models/postInfo.model';
import { postService } from 'services/post.service';

interface PostState {
    loading: boolean,
    error: string | null,
    posts: PostI;
    postInfo: PostInfo | null,
}

const initialState: PostState = {
    loading: false,
    error: '',
    posts: {
        data: [] as Post[]
    },
    postInfo: null
}
export const createPost = createAsyncThunk(
    'post/create-post',
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
export const getPostByAccountId = createAsyncThunk('post/get-post-by-AccountId',
    async (_, { rejectWithValue }) => {
        try {
            const result = await postService.getPostByAccountId();
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const getPostByPostId = createAsyncThunk('post/get-post-by-PostId',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await postService.getPostByPostId(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const updatePostById = createAsyncThunk('post/update-post-by-PostId',
    async (params: PostCreated, { rejectWithValue }) => {
        try {
            const result = await postService.updatePostById(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
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
            .addCase(getPostByAccountId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getPostByAccountId.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.data
            })
            .addCase(getPostByAccountId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getPostByPostId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getPostByPostId.fulfilled, (state, action) => {
                state.loading = false;
                state.postInfo = action.payload.data
            })
            .addCase(getPostByPostId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default postSlice.reducer;
