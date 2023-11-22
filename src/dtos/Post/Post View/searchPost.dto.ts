import SearchParams from "dtos/searchParams.dto";

export default interface SearchPostParamsDto extends SearchParams {
    params?: {
        postName?: string,
        postCode?: string,
        dateFrom?: Date,
        dateTo?: Date,
        status?: string
    }

}