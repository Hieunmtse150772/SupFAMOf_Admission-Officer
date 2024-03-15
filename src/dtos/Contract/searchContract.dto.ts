import SearchParams from "dtos/searchParams.dto";

export default interface SearchContractDto extends SearchParams {
    contractName?: string,
    endDate?: Date,
    startDate?: Date,
    status?: string,
    createAt?: Date,
    totalSalary?: number,
}