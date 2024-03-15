import ContractInfo from "models/contract.model";

export interface ContractListDto {
    data: ContractInfo[],
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