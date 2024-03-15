import ContractInfo from "models/contract.model";

export default interface ContractInfoDto {
    data: ContractInfo,
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}