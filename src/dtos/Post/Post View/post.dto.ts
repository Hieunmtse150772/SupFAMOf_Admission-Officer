import PostInfo from "models/post.model";


export default interface PostIDto {
    data: Array<PostInfo>;
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}
