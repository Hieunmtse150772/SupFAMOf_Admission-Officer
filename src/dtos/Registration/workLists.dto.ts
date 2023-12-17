import WorkLists from "models/worklist.model";

export default interface WorkListDto {
    data: Array<WorkLists>;
    metadata?: {
        page: number,
        size: number,
        total: number
    },
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}
