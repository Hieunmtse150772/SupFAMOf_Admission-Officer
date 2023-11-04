import SearchParams from "dtos/searchParams.dto";

export default interface SearchPostParamsDto extends SearchParams {
    postName?: string
}