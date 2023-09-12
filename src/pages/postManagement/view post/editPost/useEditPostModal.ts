import { unwrapResult } from "@reduxjs/toolkit";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getPostByPostId } from "features/postSlice";
import { getPostTitle } from "features/postTitleSlice";
import { useEffect } from "react";

const useEditPostModal = () => {
    const dispatch = useAppDispatch();
    const optionsAPI = useAppSelector(state => state.postTitle.postTitleOption);
    const postInfo = useAppSelector(state => state.post.postInfo)

    const options = optionsAPI?.map((title) => ({
        value: title.id,
        label: title.postTitleDescription
    }));
    const fetchPostTitleOption = async () => {
        const result = await dispatch(getPostTitle());
        unwrapResult(result)
    }
    useEffect(() => {
        fetchPostTitleOption()
    }, [])
    const fetchPost = async (postId: string) => {
        await dispatch(getPostByPostId(postId))
    }

    const handler = {
        fetchPost
    }
    const props = {
        options,
        postInfo
    }
    return { handler, props }
}

export default useEditPostModal;
