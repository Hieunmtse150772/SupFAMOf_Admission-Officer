import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { useState } from "react";
import { upload } from "../../../firebase";

const useAddContractModalHook = () => {
    const dispatch = useAppDispatch();
    const postInfo = useAppSelector(state => state.post.postInfo)
    const [url, setUrl] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);



    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            await upload(file, setLoading, setUrl); // Gọi hàm upload của bạn
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };




    const handler = {
        customRequest,
    }
    const props = {

    }
    return { handler, props }
}

export default useAddContractModalHook;
