import CollabInfo from "models/collab.model";

export interface CollabDto {
    data: CollabInfo[];
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}