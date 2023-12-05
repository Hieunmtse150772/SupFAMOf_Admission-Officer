import SearchParams from "dtos/searchParams.dto";

export default interface SearchTrainingRegistrationParamsDto extends SearchParams {
    id?: number,
    isActive?: boolean
}