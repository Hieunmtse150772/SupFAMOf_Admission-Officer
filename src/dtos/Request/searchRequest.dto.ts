import SearchParams from "dtos/searchParams.dto";

export default interface SearchRequestParamsDto extends SearchParams {
    postId?: number
}