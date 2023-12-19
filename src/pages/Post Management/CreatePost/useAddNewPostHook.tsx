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
import { getCertificate } from 'features/certificateSlice';
import { getDocument } from 'features/documentSlice';
import { getGeoApiFi, getGoogleAddress } from 'features/googleAPISlice';
import { geocodingLeafLetApi } from 'features/leafLetAPISlice';
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import geocodingLeafLetI from 'models/geocodingLeafLet.model';
import { paramLeafLetI } from 'models/geocodingParam.model';
import { PostCreatedV2 } from 'models/postCreated.model';
import PostOptionI from 'models/postOption.model';
import moment, { Moment } from 'moment';
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
    date: string;
}
interface GooglePlacePrediction {
    description: string;
    place_id: string;
    // Các trường dữ liệu khác mà API trả về
    // ...
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
        setValue, reset, getValues
    } = useForm();
    const Formater = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    const { confirm } = Modal;
    const [form] = ProForm.useForm();

    useTitle("Add New Post");

    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption)
    const documentOptionsAPI = useAppSelector(state => state.document.documentOption)
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption)
    const [error, setError] = useState<string>('');
    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
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
    const [optionDate, setOptionDate] = useState<any[]>([])
    const [optionAddress, setOptionAddress] = useState<any[]>([]);
    const [disableDocumentSelect, setDisableDocumentSelect] = useState<boolean>(true)
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
        if (fileImage !== '') setErrorUrl('');
    }

    const removeImage = () => {
        setPhotoUrl('');
        setFileImage('');
    }
    const handleSearchAddress = async (keyWords: string) => {
        try {
            // Thực hiện gọi API Google ở đây
            const response = await dispatch(getGoogleAddress({ address: keyWords, key: 'AIzaSyDSEKbLICxkqgw7vIuEbK9-f2oHiuKw-XY' }));
            unwrapResult(response)
            if (getGoogleAddress.fulfilled.match(response)) {
                const optionsFromAPI = response.payload.data?.predictions?.map((prediction) => {
                    return {
                        label: prediction.description,
                        value: prediction.description,
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
    const handleSearchAddressGeoapifi = async (keyWords: string) => {
        try {
            // Thực hiện gọi API Google ở đây
            const response = await dispatch(getGeoApiFi({ address: keyWords, key: '6f44e55eb27841738cbd3be2852d936c' }));
            unwrapResult(response)
            if (getGeoApiFi.fulfilled.match(response)) {
                console.log('response: ', response);
                const optionsFromAPI = response.payload.data?.features?.map((feature) => {
                    return {
                        label: feature.properties.formatted,
                        value: feature.properties.formatted,
                        key: feature.properties.place_id
                    }
                });
                console.log('optionsFromAPI: ', optionsFromAPI)
                return optionsFromAPI;
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };
    const onSelectOption = (value: any) => {

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
    const validateAddress = async (rule: any, value: string) => {
        const geocodingParams: paramLeafLetI = {
            q: value,
            format: 'json',
            limit: 1
        }
        try {
            const response = await dispatch(geocodingLeafLetApi(geocodingParams));
            const result: AxiosResponse<geocodingLeafLetI[], any> = unwrapResult(response)
            // Kiểm tra kết quả từ API
            if (result.data.length === 0) {
                return Promise.reject('Địa chỉ không hợp lệ');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Leaflet:', error);
            return Promise.reject('Có lỗi xảy ra khi kiểm tra địa chỉ');
        }
        return Promise.resolve();
    }
    const handlePostPosition = async (postPosition: PostPosition) => {
        const geocodingParams: paramLeafLetI = {
            q: postPosition.location,
            format: 'json',
            limit: 1
        }
        const response = await dispatch(geocodingLeafLetApi(geocodingParams))
        const result: AxiosResponse<geocodingLeafLetI[], any> = unwrapResult(response)
        const parts = postPosition.date.split('/'); // Tách chuỗi thành mảng các phần tử, sử dụng dấu '/' để tách
        // Lưu ý: Đối với định dạng 'DD/MM/YYYY', parts[0] là ngày, parts[1] là tháng và parts[2] là năm
        const day = parseInt(parts[0], 10); // Chuyển phần tử đầu tiên thành số nguyên
        const month = parseInt(parts[1], 10) - 1; // Chuyển phần tử thứ hai thành số nguyên, trừ đi 1 vì index của tháng trong Date bắt đầu từ 0
        const year = parseInt(parts[2], 10);
        const dateObject = new Date(year, month, day);
        const formattedDate = moment(dateObject).format('YYYY-MM-DDTHH:mm:ss'); //ToIsoTostring sẽ tự đổi theo UTC nên sẽ chênh lệch múi giờ, thay vào đó sẽ xài moment
        if (result.data.length !== 0) {
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
                latitude: result.data[0].lat,
                longitude: result.data[0].lon,
                date: formattedDate
            }
            return repsonse;
        } else {
            message.warning('Your address enter was not found, please enter the right address!');
            setLoading(false);
            return false;
        }
    }

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            setFileImage(file);
            onSuccess();
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };

    const handleSubmitAnt = async (value: any) => {
        if (description !== '') {
            setError('');
        }
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
                        setLoading(true);
                        const params: PostCreatedV2 = {
                            postCategoryId: value?.postCategory,
                            postDescription: description,
                            dateFrom: dateFrom,
                            dateTo: dateTo,
                            priority: 1,
                            isPremium: value?.isPremium,
                            postPositions: postPositionsResults,
                            postImg: photoUrl
                        }
                        setParamsCreatePost(params);
                    } catch (error) {
                        setLoading(false);
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
                message.warning('Add description to create post!');
            }
            if (fileImage === '') {
                setErrorUrl('Image is required!')
                message.warning('Add image to create post!');
            }
        }
    }
    const handleAddPost = async (params: PostCreatedV2) => {
        await dispatch(createPost(params)).then((response: any) => {
            if (response.payload.status === 200) {
                form.resetFields();
                message.success('Create post success!');
                removeImage();
                setFileList([]);
                setLoading(false);
            } else {
                setLoading(false);
                message.error(response.payload.message);
            }
        }).catch((error) => {
            message.error('Intenal server error!')
            setLoading(false);
            console.error(error);
        })
    }

    const handleChangeDateRangePicker = (event: any) => {
        if (event !== null) {
            const dateFrom = new Date(event[0]);
            const dateTo = new Date(event[1]);
            let dateArray = [];
            let currentDate = new Date(dateFrom);

            while (currentDate <= dateTo) {
                dateArray.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            const optionDatePicker: any[] = dateArray?.map((date) => ({
                value: moment(date).format(Formater),
                label: moment(date).format(Formater)
            }));
            setOptionDate(optionDatePicker);
        } else setOptionDate([])
    }

    const [selectedCertificates, setSelectedCertificates] = useState<number[]>([]);

    // Hàm xử lý khi chọn chứng chỉ cho mỗi item
    const handleCertificateChange = (index: number, value: any) => {
        if (value) {
            const updatedCertificates: number[] = [...selectedCertificates];
            updatedCertificates[index] = value;
            setSelectedCertificates(updatedCertificates);
        } else {
            const updatedCertificates: number[] = selectedCertificates.filter((items) => items !== index);
            updatedCertificates[index] = value;
            setSelectedCertificates(updatedCertificates);
        };
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
    const fetchCertificateRegistration = async () => {

    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
    }

    useEffect(() => {
        const fetchDate = async () => {
            await fetchPostTitleOption();
            await fetchDocumentOption();
            await fetchCertificateOption();
        }
        fetchDate();
    }, [])
    useEffect(() => {
    }, [optionDate])

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
    useEffect(() => {

    }, [disableDocumentSelect])
    const handler = {
        handleChangePosition,
        handleSubmit,
        onPremiumChange,
        onChangeSliderPiority,
        setOpen,
        reset,
        setOpenAddTitleModal,
        onCloseAddTitleModal,
        onOpenAddTitleModal,
        fetchPostTitleOption,
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
        disabledTime,
        handleChangeDateRangePicker,
        validateAddress,
        handleSearchAddress,
        onSelectOption,
        handleSearchAddressGeoapifi,
        fetchCertificateRegistration,
        handleCertificateChange
    }
    const props = {
        open,
        options,
        loading,
        control,
        errors,
        piority,
        error,
        openAddTitleModal,
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
        postTitleOptionsAPI,
        optionDate,
        optionAddress,
        disableDocumentSelect,
        selectedCertificates
    }
    return { handler, props }

}
export default useAddNewPostHook;
