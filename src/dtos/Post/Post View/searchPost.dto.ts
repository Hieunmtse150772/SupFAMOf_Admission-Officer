import SearchParams from "dtos/searchParams.dto";

export default interface SearchPostParams extends SearchParams {
    postName?: string
}