import SearchParams from "dtos/searchParams.dto";

export default interface SearchCollabContractParamDto extends SearchParams {
    contractId: number | null,
    search?: string
}