import PostInfo from "../models/post.model";

export interface PostDto {
    data?: PostInfo,
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}