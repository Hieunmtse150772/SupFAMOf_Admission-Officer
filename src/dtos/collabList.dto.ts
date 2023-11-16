import CollabListInfo from "models/collabListInfo.model";

export interface CollabListDto {
    data: CollabListInfo[]
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    };
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}