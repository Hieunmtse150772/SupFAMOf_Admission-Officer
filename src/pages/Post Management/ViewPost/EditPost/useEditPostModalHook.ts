import { unwrapResult } from "@reduxjs/toolkit";
import { UploadFile, message } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadProps } from "antd/lib/upload";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCertificate } from "features/certificateSlice";
import { getDocument } from "features/documentSlice";
import { getPostByPostId, updatePostById } from "features/postSlice";
import { getPostTitle } from "features/postTitleSlice";
import { PostUpdated } from "models/postCreated.model";
import { useEffect, useState } from "react";
import { upload } from "../../../../firebase";

interface PostPosition {
    id: number;
    positionDescription: string,
    positionName: string,
    schoolName: string,
    location: string,
    latitude: number,
    longitude: number,
    amount: number,
    salary: number,
    date: Date
}
const useEditPostModal = () => {
    const dispatch = useAppDispatch();
    const optionsAPI = useAppSelector(state => state.postTitle.postTitleOption);
    const postInfo = useAppSelector(state => state.post.postInfo)
    const documentOptionsAPI = useAppSelector(state => state.document.documentOption)
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption)
    const [isloading, setLoading] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>(postInfo?.data?.postImg ? postInfo?.data.postImg : '');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: postInfo?.data.postImg,
        },
    ]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(postInfo?.data?.postDescription ? postInfo?.data?.postDescription : '');
    const [errorUrl, setErrorUrl] = useState<string>('');

    const documentOptions = documentOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.docName
    }));


    const certificateOptions = certificateOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.certificateName
    }));
    const options = optionsAPI?.map((title) => ({
        value: title.id,
        label: title.postCategoryDescription
    }));
    const fetchPostTitleOption = async () => {
        const result = await dispatch(getPostTitle());
        unwrapResult(result)
    }
    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            await upload(file, setLoading, setPhotoUrl); // Gọi hàm upload của bạn
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    const removeImage = () => {
        setPhotoUrl('')
    }
    const handleCancel = () => setPreviewOpen(false);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (photoUrl !== '') setErrorUrl('');
    }
    const handleEdit = () => {
        setIsEdited(true);
    }
    const handleDeltePosition = () => {

    }
    const handleUpdatePost = async (value: any, setOpenEditPostModal: (value: boolean) => void) => {
        console.log('value: ', value)
        setLoading(true);
        if (!isEdited) {
            message.warning('Nothing was change!')
        } else {
            const params: PostUpdated = {
                postId: postInfo?.data.id ? postInfo?.data.id : 0,
                postCategoryId: value?.postCategory,
                postDescription: description,
                postImg: photoUrl,
                postPositions: value?.postPositions?.map((postPosition: PostPosition) => {
                    return {
                        id: postPosition?.id,
                        positionDescription: postPosition.positionDescription,
                        positionName: postPosition?.positionName,
                        schoolName: postPosition?.schoolName,
                        location: postPosition?.location,
                        latitude: postPosition?.latitude,
                        longitude: postPosition?.longitude,
                        amount: postPosition?.amount,
                        salary: postPosition?.salary,
                        date: postPosition?.date
                    }
                }),
            }
            await dispatch(updatePostById(params)).then((response) => {
                const result2 = unwrapResult(response);
                if (result2.status === 200) {
                    message.success('Create post success!');
                    setLoading(false);
                    setOpenEditPostModal(false);
                }
            }).catch((error) => {
                console.error(error)
                message.error('Create post Fail!');

            })
        }
        console.log(value)
    }
    const fetchDocumentOption = async () => {
        const result = await dispatch(getDocument());
    }
    const fetchCertificateOption = async () => {
        const result = await dispatch(getCertificate());
    }
    useEffect(() => {
        fetchPostTitleOption()
        fetchDocumentOption();
        fetchCertificateOption();
    }, [])
    const fetchPost = async (postId: string) => {
        await dispatch(getPostByPostId(postId))
    }

    const handler = {
        fetchPost,
        customRequest,
        handlePreview,
        handleChange,
        removeImage,
        handleCancel,
        handleEdit,
        handleUpdatePost,
        setDescription,
        handleDeltePosition
    }
    const props = {
        options,
        postInfo,
        documentOptions,
        certificateOptions,
        fileList,
        previewOpen,
        previewTitle,
        previewImage,
        isloading
    }
    return { handler, props }
}

export default useEditPostModal;
