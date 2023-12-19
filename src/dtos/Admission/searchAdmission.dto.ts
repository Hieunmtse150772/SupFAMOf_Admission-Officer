import SearchParams from "dtos/searchParams.dto";

export default interface SearchAdmissionParamsDto extends SearchParams {
    name?: string,
    email?: string
}