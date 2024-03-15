import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ContractInfoDto from 'dtos/Contract/contractInfo.dto';
import SearchCollabContractParamDto from 'dtos/Contract/searchCollabContract.dto';
import SearchContractDto from 'dtos/Contract/searchContract.dto';
import { CollabListDto } from 'dtos/collabList.dto';
import { ContractDto } from 'dtos/contract.dto';
import { ContractListDto } from 'dtos/contractList.dto';
import CollabListInfo from 'models/collabListInfo.model';
import CompleteContractParams from 'models/completeContractParams.model';
import ContractInfo from 'models/contract.model';
import ContractCreated from 'models/contractCreated.model';
import ContractUpdated from 'models/contractUpdated.model';
import SendContractParams from 'models/sendContractParams.model';
import { contractService } from 'services/contract.service';

interface ContractState {
    loading: boolean,
    error: string | null,
    contractList: ContractListDto,
    contract: ContractDto,
    isDeleted: boolean,
    collabList: CollabListDto,
    contractInfo: ContractInfoDto | null
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
    collabList: {
        data: [] as CollabListInfo[]
    },
    contractInfo: null
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
export const getContractById = createAsyncThunk('contracts/get-contract-by-id',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await contractService.getContracById(id);
            return result
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data)
        }
    })
export const getCollabByContractId = createAsyncThunk('contracts/get-collab-by-contractId',
    async (params: SearchCollabContractParamDto, { rejectWithValue }) => {
        try {
            const result = await contractService.getCollabByContractId(params);
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
export const updateContract = createAsyncThunk('contracts/update-contract',
    async (params: ContractUpdated, { rejectWithValue }) => {
        try {
            const result = await contractService.updateContract(params);
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
export const deleteContract = createAsyncThunk('contracts/delete-contract-by-id',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await contractService.deleteContract(id);
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
            .addCase(updateContract.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
            .addCase(getCollabByContractId.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCollabByContractId.fulfilled, (state, action) => {
                state.loading = false;
                state.collabList = action.payload.data
            })
            .addCase(getCollabByContractId.rejected, (state, action) => {
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
            .addCase(getContractById.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getContractById.fulfilled, (state, action) => {
                state.loading = false;
                state.contractInfo = action.payload.data
            })
            .addCase(getContractById.rejected, (state, action) => {
                state.error = String(action.payload);
                state.loading = false;
            })
    },
});

export default contractSlice.reducer;
