import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProForm } from "@ant-design/pro-components";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, UploadFile, message } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadProps } from "antd/lib/upload";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { AxiosResponse } from "axios";
import { getCertificate } from "features/certificateSlice";
import { getDocument } from "features/documentSlice";
import { getGeoApiFi } from "features/googleAPISlice";
import { geocodingLeafLetApi } from "features/leafLetAPISlice";
import { getPostByPostId, updatePostById } from "features/postSlice";
import { getPostTitle } from "features/postTitleSlice";
import geocodingLeafLetI from "models/geocodingLeafLet.model";
import { paramLeafLetI } from "models/geocodingParam.model";
import { PositionUpdated, PostUpdated } from "models/postCreated.model";
import { useEffect, useState } from "react";
import { uploadImage } from "../../../../firebase";

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
    trainingCertificateId: number,
    isBusService: boolean,
    documentId: number
}
const useEditPostModal = () => {
    const dispatch = useAppDispatch();
    const { confirm } = Modal;
    const [form] = ProForm.useForm();

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
    const [error, setError] = useState<string>('');
    const [fileImage, setFileImage] = useState<any>('');
    const [paramsCreatePost, setParamsCreatePost] = useState<PostUpdated>()

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
            setTimeout(() => {
                setFileImage(file);
                onSuccess();
            }, 2000);
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
        setFileList([]);
        setFileImage('');
    }
    const handleCancel = () => setPreviewOpen(false);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (fileImage !== '') setErrorUrl('');
    }
    const handleEdit = () => {
        setIsEdited(true);
    }
    const handlePostPosition = async (postPosition: PositionUpdated) => {
        const geocodingParams: paramLeafLetI = {
            q: postPosition.location,
            format: 'json',
            limit: 1
        }
        const response = await dispatch(geocodingLeafLetApi(geocodingParams))
        const result: AxiosResponse<geocodingLeafLetI[], any> = unwrapResult(response)
        if (result.data.length !== 0) {
            const repsonse = {
                id: postPosition.id,
                trainingCertificateId: postPosition.trainingCertificateId,
                positionDescription: postPosition.positionDescription,
                documentId: postPosition.documentId,
                positionName: postPosition.positionName,
                amount: postPosition.amount,
                salary: postPosition.salary,
                isBusService: postPosition.isBusService,
                schoolName: postPosition.schoolName,
                location: postPosition.location,
                latitude: result.data[0].lat,
                longitude: result.data[0].lon,
            }
            return repsonse;
        } else {
            message.warning('Your address enter was not found, please enter the right address!');
            setLoading(false);
            return false;
        }
    }
    const handleUpdatePost = async (value: any, setOpenEditPostModal: (value: boolean) => void) => {
        if (description !== '') {
            setError('');
        }
        if (fileList !== [] && description !== '') {
            setError('');
            confirm({
                title: 'Do you want to create post?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                onOk: async () => {
                    setLoading(true)
                    const postPositionPromises = value?.postPositions?.map(async (postPosition: PositionUpdated) => handlePostPosition(postPosition));
                    try {
                        const postPositionsResults: PositionUpdated[] = await Promise.all(postPositionPromises);
                        const photoUrl = fileImage ? await uploadImage(fileImage, setLoading) : postInfo?.data?.postImg; // Gọi hàm upload của bạn
                        const params: PostUpdated = {
                            postId: postInfo?.data.id ? postInfo?.data.id : 0,
                            postCategoryId: value?.postCategory,
                            postDescription: description,
                            priority: value?.piority,
                            isPremium: value?.isPremium,
                            postPositions: postPositionsResults,
                            postImg: photoUrl ? photoUrl : 'https://fptcameraiq.vn/storage/festftel25.jpg',
                        }
                        setParamsCreatePost(params);
                        setOpenEditPostModal(false);
                    } catch (error) {
                        console.error('Error in handlePostPosition:', error);
                        // Handle error appropriately
                    }
                },
                onCancel() {
                },
            });
        } else {
            if (description === '') {
                setError('Description is required!')
            }
            if (fileList === []) {
                setErrorUrl('Image is required!')
            }
        }
    }
    const handleSearchAddressGeoapifi = async (keyWords: string) => {
        try {
            // Thực hiện gọi API Google ở đây
            const response = await dispatch(getGeoApiFi({ address: keyWords, key: '6f44e55eb27841738cbd3be2852d936c' }));
            unwrapResult(response)
            if (getGeoApiFi.fulfilled.match(response)) {
                const optionsFromAPI = response.payload.data?.features?.map((feature) => {
                    return {
                        label: feature.properties.formatted,
                        value: feature.properties.formatted
                    }
                });
                return optionsFromAPI;
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };
    const handleUpdatePostApi = async (params: PostUpdated) => {
        await dispatch(updatePostById(params)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                setLoading(false)
                message.success('Update post success!')
            }
        }).catch((error) => {
            message.error('Intenal server error!')
            setLoading(false)
            console.error(error)
        })
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
    useEffect(() => {
        if (paramsCreatePost) {
            handleUpdatePostApi(paramsCreatePost)
        }
    }, [paramsCreatePost])

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
        handleSearchAddressGeoapifi
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
        isloading,
        error,
        errorUrl,
        form
    }
    return { handler, props }
}

export default useEditPostModal;
