import Post from "models/post.model";


export default interface PostI {
    data: Array<Post>;
    metadata?: {
        page?: number;
        size?: number;
        total?: number
    }
}
