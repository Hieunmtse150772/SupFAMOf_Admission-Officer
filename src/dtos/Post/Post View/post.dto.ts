import PostInfo from "models/post.model";


export default interface PostI {
    data: Array<PostInfo>;
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}
