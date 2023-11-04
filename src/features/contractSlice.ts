import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { ContractDto } from 'dtos/contract.dto';
import ContractInfo from 'models/contract.model';
import { contractService } from 'services/contract.service';

interface ContractState {
    loading: boolean,
    error: string | null,
    contractList: ContractDto,
    isDeleted: boolean,
}

const initialState: ContractState = {
    loading: false,
    error: '',
    isDeleted: false,
    contractList: {
        data: [] as ContractInfo[]
    },
}
export const getContractList = createAsyncThunk('collabs/get-collab-list',
    async (_, { rejectWithValue }) => {
        try {
            const result = await contractService.getContractList();
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })

export const contractSlice = createSlice({
    name: 'collabs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getContractList.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getContractList.fulfilled, (state, action) => {
                state.loading = false;
                state.contractList = action.payload.data
            })
            .addCase(getContractList.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default contractSlice.reducer;
