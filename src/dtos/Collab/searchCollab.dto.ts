import SearchParams from "dtos/searchParams.dto";

export default interface SearchCollabParamDto extends SearchParams {
    name?: string,
    email?: string
}