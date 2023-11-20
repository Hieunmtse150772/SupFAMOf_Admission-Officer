import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import PostIDto from 'dtos/Post/Post View/post.dto';
import PostInfoDto from 'dtos/Post/Post View/postInfo.dto';
import SearchPostParams from 'dtos/Post/Post View/searchPost.dto';
import PostInfo from 'models/post.model';
import { PostCreatedV2, PostUpdated } from 'models/postCreated.model';
import { postService } from 'services/post.service';

interface PostState {
    loading: boolean,
    error: string | null,
    posts: PostIDto;
    postInfo: PostInfoDto | null,
    isDeleted: boolean,
}

const initialState: PostState = {
    loading: false,
    error: '',
    posts: {
        data: [] as PostInfo[]
    },
    postInfo: null,
    isDeleted: false
}
export const createPost = createAsyncThunk(
    'post/create-post',
    async (payload: PostCreatedV2, { rejectWithValue }) => {
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
    async (params: SearchPostParams, { rejectWithValue }) => {
        try {
            const result = await postService.getPostByAccountId(params);
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
    async (params: PostUpdated, { rejectWithValue }) => {
        try {
            const result = await postService.updatePostById(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const deletePostById = createAsyncThunk('post/delete-post-by-PostId',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await postService.deletePostById(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const confirmColabborator = createAsyncThunk('post/confirm-post-collabList',
    async (id: number[], { rejectWithValue }) => {
        try {
            const result = await postService.confirmPostByCollabList(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const confirmRunningPost = createAsyncThunk('post/confirm-running-post',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await postService.confirmRunningPost(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const confirmEndPost = createAsyncThunk('post/confirm-end-post',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await postService.confirmEndPost(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const confirmReopenPost = createAsyncThunk('post/confirm-reopen-post',
    async (id: number, { rejectWithValue }) => {
        try {
            const result = await postService.confirmReopen(id);
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
            .addCase(deletePostById.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.isDeleted = false;
            })
            .addCase(deletePostById.fulfilled, (state, action) => {
                state.loading = false;
                state.isDeleted = true;
            })
            .addCase(deletePostById.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(confirmRunningPost.pending, confirmEndPost.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(confirmRunningPost.fulfilled, confirmEndPost.fulfilled), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(confirmRunningPost.rejected, confirmEndPost.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default postSlice.reducer;
