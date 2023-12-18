import SearchParams from "dtos/searchParams.dto";

export default interface SearchApplicationParams extends SearchParams {
    Id?: number,
    ReportDate?: Date,
    ReplyDate?: Date,
}