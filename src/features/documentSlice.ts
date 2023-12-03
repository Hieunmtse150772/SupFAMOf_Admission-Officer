import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import DocumentCreated from 'models/document.model';
import DocumentOptionI from 'models/documentOption.model';
import { documentService } from 'services/document.service';

interface DocumentState {
    documentOption: DocumentOptionI[],
    loading: boolean,
    error: string | null,
}

const initialState: DocumentState = {
    documentOption: [],
    loading: false,
    error: ''
}
export const getDocument = createAsyncThunk(
    'documents/get-document',
    async (_, { rejectWithValue }) => {
        try {
            const result = await documentService.getDocument()
            return result.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const createDocument = createAsyncThunk(
    'documents/create-document',
    async (payload: DocumentCreated, { rejectWithValue }) => {
        try {
            const result = await documentService.createDocument(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const updateDocument = createAsyncThunk(
    'documents/update-document',
    async (payload: DocumentCreated, { rejectWithValue }) => {
        try {
            const result = await documentService.updateDocument(payload)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const deleteDocument = createAsyncThunk(
    'documents/delete-document',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await documentService.deleteDocument(id)
            return result;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data);
        }
    },
);
export const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDocument.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getDocument.fulfilled, (state, action) => {
                state.documentOption = action.payload.data
                state.loading = false;
            })
            .addCase(getDocument.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(deleteDocument.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(deleteDocument.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(createDocument.pending, updateDocument.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(createDocument.fulfilled, updateDocument.fulfilled), (state) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(createDocument.rejected, updateDocument.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })

    },
});

export default documentSlice.reducer;
