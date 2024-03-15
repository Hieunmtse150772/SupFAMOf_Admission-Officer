import RequestInfo from "models/request.model";

export default interface RequestDto {
    data: Array<RequestInfo>,
    isError?: boolean,
    message?: string,
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}