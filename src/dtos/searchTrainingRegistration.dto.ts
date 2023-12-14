import SearchParams from "dtos/searchParams.dto";

export default interface SearchTrainingRegistrationParamsDto extends SearchParams {
    id?: number,
    certificateName?: string,
    isActive?: boolean
}