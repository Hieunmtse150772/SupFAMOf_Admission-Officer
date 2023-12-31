import ContractInfo from "models/contract.model";

export interface ContractDto {
    data: ContractInfo,
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}