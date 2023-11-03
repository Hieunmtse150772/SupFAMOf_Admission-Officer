import CollabListInfo from "models/collabListInfo.model";

export interface CollabList {
    data: CollabListInfo[]
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}