import PostInfo from "models/post.model";

export default interface PostInfoDto {
    data: PostInfo,
    status?: {
        success: boolean,
        message: string,
        errorCode: number
    }
}