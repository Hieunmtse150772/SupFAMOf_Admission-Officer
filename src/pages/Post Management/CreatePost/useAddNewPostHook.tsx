import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Modal, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { AxiosResponse } from 'axios';
import { Dayjs } from 'dayjs';
import { geocodingDto } from 'dtos/GoogleAPI/geocoding.dto';
import { getCertificate } from 'features/certificateSlice';
import { getDocument } from 'features/documentSlice';
import { geocodingApi } from 'features/googleAPISlice';
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import { paramI } from 'models/geocodingParam.model';
import { PostCreatedV2 } from 'models/postCreated.model';
import PostOptionI from 'models/postOption.model';
import { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { uploadImage } from '../../../firebase';

interface AdditionalPosition {
    positionName: string;
    amount: number | null;
    salary: number | null;
}
interface AdditionalTrainingPosition {
    namePosition: string,
    number: number | null;
    salary: number | null;
}
interface PostPosition {
    positionName: string;
    positionDescription: string;
    documentOption: number;
    certificateOption: number;
    timeFrom_timeTo: Moment[];
    schoolName: string;
    location: string;
    amount: number;
    salary: number;
    isBusService: boolean;
    date: Date;
}
type RangeType = 'start' | 'end';

type RangeDisabledTime = (
    now: Dayjs | null,
    type: RangeType,
) => {
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
const useAddNewPostHook = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue, reset
    } = useForm();
    const Formater = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    const { confirm } = Modal;
    const [form] = ProForm.useForm();

    useTitle("Add New Post");

    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption)
    const documentOptionsAPI = useAppSelector(state => state.document.documentOption)
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption)

    const province = useAppSelector(state => state.address.province)
    const district = useAppSelector(state => state.address.district)
    const ward = useAppSelector(state => state.address.ward)

    const [error, setError] = useState<string>('');
    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [additionalPositions, setAdditionalPositions] = useState<AdditionalPosition[]>([{
        positionName: '',
        amount: 0,
        salary: 0,
    }]);
    const [additionalTrainingPositions, setAdditionalTrainingPositions] = useState<AdditionalTrainingPosition[]>([{
        namePosition: '',
        number: null,
        salary: null,
    }]);
    const [open, setOpen] = useState(false);
    const options = postTitleOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.postCategoryDescription
    }));
    const documentOptions = documentOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.docName
    }));
    const certificateOptions = certificateOptionsAPI?.map((title) => ({
        value: title.id,
        label: title.certificateName
    }));
    const provinceOptions = province?.map((province) => ({
        value: province.province_id,
        label: province.province_name
    }));
    const districtOptions = district?.map((district) => ({
        value: district.district_id,
        label: district.district_name
    }));

    const wardOptions = ward?.map((ward) => ({
        value: ward.ward_id,
        label: ward.ward_name
    }));

    const FormatTime = 'HH:mm:ss'
    const loading = useAppSelector(state => state.postTitle.loading);
    const [openAddTitleModal, setOpenAddTitleModal] = useState(false);
    const [openAddCertificateModal, setOpenAddCertificateModal] = useState(false);
    const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isloading, setLoading] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [errorUrl, setErrorUrl] = useState<string>('');
    const [fileImage, setFileImage] = useState<any>('');
    const [paramsCreatePost, setParamsCreatePost] = useState<PostCreatedV2>()
    const disabledTime: RangeDisabledTime = (now, defaultType) => {
        if (defaultType === 'start') {
            // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn bắt đầu
            return {
                disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
            };
        }
        // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn kết thúc
        return {
            disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
        };
    };

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (photoUrl !== '') setErrorUrl('');
    }
    const removeImage = () => {
        setPhotoUrl('')
    }
    const onCloseAddTitleModal = () => {
        setOpenAddTitleModal(false);
    };

    const onOpenAddTitleModal = () => {
        setOpenAddTitleModal(true);
    };
    const onCloseAddDocumentModal = () => {
        setOpenAddDocumentModal(false);
    };

    const onOpenAddDocumentModal = () => {
        setOpenAddDocumentModal(true);
    };
    const onCloseAddCertificateModal = () => {
        setOpenAddCertificateModal(false);
    };

    const onOpenAddCertificateModal = () => {
        setOpenAddCertificateModal(true);
    };
    const onPremiumChange = () => {
        setIsPremium(!isPremium);
    }
    const onChangeSliderPiority = (newValue: number | null) => {
        setPiority(newValue);
    };
    const handlePostPosition = async (postPosition: PostPosition) => {
        const geocodingParams: paramI = {
            address: postPosition.location,
            key: 'AIzaSyDSEKbLICxkqgw7vIuEbK9-f2oHiuKw-XY'
        }
        const response = await dispatch(geocodingApi(geocodingParams))
        const result: AxiosResponse<geocodingDto, any> = unwrapResult(response)
        const repsonse = {
            trainingCertificateId: postPosition.certificateOption,
            positionDescription: postPosition.positionDescription,
            documentId: postPosition.documentOption,
            positionName: postPosition.positionName,
            amount: postPosition.amount,
            salary: postPosition.salary,
            timeFrom: postPosition.timeFrom_timeTo[0],
            timeTo: postPosition.timeFrom_timeTo[1],
            isBusService: postPosition.isBusService,
            schoolName: postPosition.schoolName,
            location: postPosition.location,
            latitude: result.data.results[0].geometry.location.lat,
            longitude: result.data.results[0].geometry.location.lng,
            date: postPosition.date
        }
        console.log('respone position: ', repsonse)
        return repsonse;
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

    const handleSubmitAnt = async (value: any) => {
        console.log('description: ', description)
        if (fileImage !== '' && description !== '') {
            setError('');
            const dateFrom = new Date(value?.dateFrom_dateTo[0]);
            const dateTo = new Date(value?.dateFrom_dateTo[1]);
            confirm({
                title: 'Do you want to create post?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                // content: 'Some descriptions',
                onOk: async () => {
                    setLoading(true)
                    const postPositionPromises = value?.postPositions?.map(async (postPosition: PostPosition) => handlePostPosition(postPosition));
                    try {
                        const postPositionsResults = await Promise.all(postPositionPromises);
                        const photoUrl = await uploadImage(fileImage, setLoading); // Gọi hàm upload của bạn
                        const params: PostCreatedV2 = {
                            postCategoryId: value?.postCategory,
                            postDescription: description,
                            dateFrom: dateFrom,
                            dateTo: dateTo,
                            priority: value?.piority,
                            isPremium: value?.isPremium,
                            postPositions: postPositionsResults,
                            postImg: photoUrl
                        }
                        console.log('params: ', params);
                        setParamsCreatePost(params);
                    } catch (error) {
                        console.error('Error in handlePostPosition:', error);
                        // Handle error appropriately
                    }


                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            if (description === '') {
                setError('Description is required!')
                message.warning('Add description to create post!');
            }
            if (photoUrl === '') {
                setErrorUrl('Image is required!')
                message.warning('Add image to create post!');
            }
        }
    }
    const handleAddPost = async (params: PostCreatedV2) => {
        await dispatch(createPost(params)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                setLoading(false)
                message.success('Create post success!')
                form.resetFields();
                setLoading(false);
            }
        }).catch((error) => {
            message.error('Intenal server error!')
            setLoading(false)
            console.error(error)
        })
    }

    const handleDeleteTrainingPosition = (indexToDelete: number) => {
        const updatedPositions = additionalTrainingPositions.filter((_, index) => index !== indexToDelete);
        setAdditionalTrainingPositions(updatedPositions);
    };
    const handleDeletePosition = (indexToDelete: number) => {
        if (additionalPositions.length === 1) {
            messageApi.open({
                type: 'warning',
                content: 'Need at least 1 position to create a post!',
            });
        } else {
            setError('')
            const updatedPositions = additionalPositions.filter((_, index) => index !== indexToDelete);
            setAdditionalPositions(updatedPositions);
        }
    };
    const fetchPostTitleOption = async () => {
        await dispatch(getPostTitle());
    }
    const fetchDocumentOption = async () => {
        await dispatch(getDocument());
    }
    const fetchCertificateOption = async () => {
        await dispatch(getCertificate());
    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
    }
    useEffect(() => {
        fetchPostTitleOption();
        fetchDocumentOption();
        fetchCertificateOption();
    }, [])
    useEffect(() => {
        setLoading(loading)
    }, [loading])
    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }
    useEffect(() => {
        if (paramsCreatePost) {
            handleAddPost(paramsCreatePost)
        }
    }, [paramsCreatePost])

    const handler = {
        handleChangePosition,
        handleDeletePosition,
        handleSubmit,
        onPremiumChange,
        onChangeSliderPiority,
        setOpen,
        reset,
        setOpenAddTitleModal,
        onCloseAddTitleModal,
        onOpenAddTitleModal,
        fetchPostTitleOption,
        handleDeleteTrainingPosition,
        handlePreview,
        handleChange,
        handleCancel,
        handleSubmitAnt,
        setDescription,
        customRequest,
        removeImage,
        onOpenAddCertificateModal,
        onCloseAddCertificateModal,
        onOpenAddDocumentModal,
        onCloseAddDocumentModal,
        setOpenAddDocumentModal,
        setOpenAddCertificateModal,
        fetchDocumentOption,
        fetchCertificateOption,
        disabledTime
    }
    const props = {
        open,
        options,
        loading,
        control,
        errors,
        piority,
        additionalPositions,
        error,
        additionalTrainingPositions,
        contextHolder,
        openAddTitleModal,
        provinceOptions,
        districtOptions,
        wardOptions,
        previewOpen,
        previewTitle,
        previewImage,
        fileList,
        documentOptions,
        certificateOptions,
        errorUrl,
        form,
        isloading,
        openAddDocumentModal,
        openAddCertificateModal,
        certificateOptionsAPI,
        documentOptionsAPI,
        postTitleOptionsAPI

    }
    return { handler, props }

}
export default useAddNewPostHook;
