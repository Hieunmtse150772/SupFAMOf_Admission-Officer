import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchContractDto from 'dtos/Contract/searchContract.dto';
import { ContractDto } from 'dtos/contract.dto';
import { ContractListDto } from 'dtos/contractList.dto';
import CompleteContractParams from 'models/completeContractParams.model';
import ContractInfo from 'models/contract.model';
import ContractCreated from 'models/contractCreated.model';
import SendContractParams from 'models/sendContractParams.model';
import { contractService } from 'services/contract.service';

interface ContractState {
    loading: boolean,
    error: string | null,
    contractList: ContractListDto,
    contract: ContractDto,
    isDeleted: boolean,
}

const initialState: ContractState = {
    loading: false,
    error: '',
    isDeleted: false,
    contractList: {
        data: [] as ContractInfo[]
    },
    contract: {
        data: {} as ContractInfo
    },
}
export const getContractList = createAsyncThunk('contracts/get-contract-list',
    async (params: SearchContractDto, { rejectWithValue }) => {
        try {
            const result = await contractService.getContractList(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const createContract = createAsyncThunk('contracts/create-contract',
    async (params: ContractCreated, { rejectWithValue }) => {
        try {
            const result = await contractService.createContract(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const sendContractEmail = createAsyncThunk('contracts/send-contract-email',
    async (params: SendContractParams, { rejectWithValue }) => {
        try {
            const result = await contractService.sendContractEmail(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const completeContractByAccountContractId = createAsyncThunk('contracts/complete-contract-AccountContractId',
    async (params: CompleteContractParams, { rejectWithValue }) => {
        try {
            const result = await contractService.completeContractByAccountContractId(params);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const contractSlice = createSlice({
    name: 'contracts',
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
            .addCase(createContract.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(createContract.fulfilled, (state, action) => {
                state.loading = false;
                state.contract = action.payload.data
            })
            .addCase(createContract.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(sendContractEmail.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(sendContractEmail.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendContractEmail.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default contractSlice.reducer;
