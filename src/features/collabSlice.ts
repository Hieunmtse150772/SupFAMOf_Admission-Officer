import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchCollabParamDto from 'dtos/Collab/searchCollab.dto';
import { CollabDto } from 'dtos/collab.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { BanParamsI, UnBanParamsI } from 'models/banParamsI.model';
import CollabInfo from 'models/collab.model';
import CollabListInfo from 'models/collabListInfo.model';
import { GiveCertificateParamsI } from 'models/giveCertificate.model';
import { RemoveCertificateParamsI } from 'models/removeCertificate.model';
import { collabService } from 'services/collab.service';

interface CollabState {
    loading: boolean,
    error: string | null,
    collabs: CollabDto | null,
    collabList: CollabListDto,
    isDeleted: boolean,
}

const initialState: CollabState = {
    loading: false,
    error: '',
    collabs: {
        data: [] as CollabInfo[]
    },
    isDeleted: false,
    collabList: {
        data: [] as CollabListInfo[]
    },
}
export const getCollabList = createAsyncThunk('collabs/get-collab-list',
    async (params: SearchCollabParamDto, { rejectWithValue }) => {
        try {
            const result = await collabService.getCollabList(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const searchCollabListByEmail = createAsyncThunk('collabs/search-collab-list',
    async (params: SearchCollabParamDto, { rejectWithValue }) => {
        try {
            const result = await collabService.searchCollabListByEmail(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })

export const getCollabByPositionId = createAsyncThunk('collabs/get-collab-byPositionId',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await collabService.getCollabByPositionId(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const banCollaboratorById = createAsyncThunk('collabs/ban-collab-accountId',
    async (params: BanParamsI, { rejectWithValue }) => {
        try {
            const result = await collabService.banCollaboratorById(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const updateBanCollaboratorById = createAsyncThunk('collabs/unban-collab-accountId',
    async (params: UnBanParamsI, { rejectWithValue }) => {
        try {
            const result = await collabService.updateBanCollaboratorById(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const giveCertificateByAccountId = createAsyncThunk('collabs/give-certificate-by-accoutnId',
    async (params: GiveCertificateParamsI, { rejectWithValue }) => {
        try {
            const result = await collabService.giveCertificateByAccountId(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const removeCertificateByAccountId = createAsyncThunk('collabs/remove-certificate-by-accoutnId',
    async (params: RemoveCertificateParamsI, { rejectWithValue }) => {
        try {
            const result = await collabService.removeCertificateByAccountId(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })

export const updateCollaboratorToPremium = createAsyncThunk('collabs/update-collaborator-premium',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await collabService.updateCollaboratorToPremium(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const removeCollaboratorPremium = createAsyncThunk('collabs/remove-collaborator-premium',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await collabService.removeCollaboratorPremium(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const collabSlice = createSlice({
    name: 'collabs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCollabByPositionId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCollabByPositionId.fulfilled, (state, action) => {
                state.loading = false;
                state.collabs = action.payload.data
            })
            .addCase(getCollabByPositionId.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(
                banCollaboratorById.pending,
                updateBanCollaboratorById.pending,
                updateCollaboratorToPremium.pending,
                removeCollaboratorPremium.pending
            ), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(
                banCollaboratorById.fulfilled,
                updateBanCollaboratorById.fulfilled,
                updateCollaboratorToPremium.fulfilled,
                removeCollaboratorPremium.fulfilled
            ), (state, action) => {
                state.loading = false;
            })
            .addMatcher(isAnyOf(
                banCollaboratorById.rejected,
                updateBanCollaboratorById.rejected,
                updateCollaboratorToPremium.rejected,
                removeCollaboratorPremium.rejected
            ), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addMatcher(isAnyOf(getCollabList.pending, getCollabList.pending), (state) => {
                state.loading = true;
                state.error = "";
            })
            .addMatcher(isAnyOf(getCollabList.fulfilled, searchCollabListByEmail.fulfilled), (state, action) => {
                state.loading = false;
                state.collabList = action.payload.data
            })
            .addMatcher(isAnyOf(getCollabList.rejected, searchCollabListByEmail.rejected), (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default collabSlice.reducer;
