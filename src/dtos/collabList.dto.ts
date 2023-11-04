import CollabListInfo from "models/collabListInfo.model";

export interface CollabListDto {
    data: CollabListInfo[]
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}