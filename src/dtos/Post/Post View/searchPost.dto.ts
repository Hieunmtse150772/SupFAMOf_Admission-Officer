import SearchParams from "dtos/searchParams.dto";

export default interface SearchPostParamsDto extends SearchParams {
    postName?: string,
    postCode?: string,
    dateFrom?: Date,
    dateTo?: Date,
    status?: string,
    postCategoryId?: number,
    createAt?: Date

}