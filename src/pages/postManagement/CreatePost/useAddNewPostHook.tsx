import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Modal, message } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { Dayjs } from 'dayjs';
import { getDistrict, getProvince, getWard } from 'features/addressSlice';
import { getCertificate } from 'features/certificateSlice';
import { getDocument } from 'features/documentSlice';
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from 'hooks/useTitle';
import PostCreated, { PositionCreatedI, PostCreatedV2, TrainingPositionsCreatedI } from 'models/postCreated.model';
import PostOptionI from 'models/postOption.model';
import { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { upload } from '../../../firebase';

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
}
interface PostTrainingPosition {
    trainingPositionName: string;
    documentTrainingOption: number;
    certificateTrainingOption: number;
    schoolNameTraining: string;
    locationTraining: string;
    trainingTimeFrom_timeTo: Moment[];
    traingAmount: number;
    trainingSalary: number;
    isBusServiceTraining: boolean;
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
        setValue, getValues, reset
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
    const [errorTraining, setErrorTraining] = useState<String>('');
    const [modalVisit, setModalVisit] = useState(false);
    const [piority, setPiority] = useState<number | null>(0);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [createParams, setCreateParams] = useState<PostCreated>()
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
    const [optionsAPI, setOptionsAPI] = useState<readonly PostOptionI[]>([]);
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
    const loading = useAppSelector(state => state.postTitle.loading)
    const [openAddTitleModal, setOpenAddTitleModal] = useState(false)
    const [openAddCertificateModal, setOpenAddCertificateModal] = useState(false)
    const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false)


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [provinceId, setProvinceId] = useState<number>(0);
    const [districId, setDistricId] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [isloading, setLoading] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [errorUrl, setErrorUrl] = useState<string>('');
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
    const onSubmit = async (data: any) => {
        const timeRange: Moment[] = getValues('TimeFrom-TimeTo')
        const dateRange: Date[] = getValues('DateFrom-DateTo')

        const formattedTimeRange = timeRange?.map((time) => time.format(FormatTime));
        const formattedDateRange = dateRange?.map((time) => time);
        const position: PositionCreatedI[] = (additionalPositions || [])?.map((_, index) => {
            const positionValue = getValues(`postPosition${index}`);
            const numberStudentValue = getValues(`numberStudent${index}`);
            const salaryValue = getValues(`Salary${index}`);
            return {
                positionName: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const trainingPosition: TrainingPositionsCreatedI[] = (additionalTrainingPositions || []).map((_, index) => {
            const positionValue = getValues(`postPositionTraining${index}`);
            const numberStudentValue = getValues(`numberStudentTraining${index}`);
            const salaryValue = getValues(`SalaryTraining${index}`);
            return {
                positionName: positionValue,
                amount: numberStudentValue,
                salary: salaryValue,
            };
        });
        const params: PostCreated = {
            postTitleId: getValues('postTitle'), //completetext box     
            postDescription: getValues('postDescription'),
            dateFrom: formattedDateRange[0],
            dateTo: formattedDateRange[1],
            timeFrom: formattedTimeRange[0], //00:00:00 
            timeTo: formattedTimeRange[1],
            priority: piority, //độ ưu tiên 1-5, defaultvalue: 0
            isPremium: isPremium, // false
            location: getValues('location'),
            postPositions: position,
            trainingPositions: trainingPosition ? trainingPosition : []
        }
        // await dispatch(createPost(params)).then((response) => {
        //     const result2 = unwrapResult(response);
        //     if (result2.status === 200) {
        //         message.success('Create post success!');
        //         reset()
        //     }
        // }).catch((error) => {
        //     console.error(error)
        // })
        // You can perform your submission logic here
    };
    const handleChangeProvince = (value: any) => {
        setProvinceId(value)
        fetchDistrictOption(value)
    }
    const handleChangeDistrict = (value: any) => {
        setDistricId(value)
        fetchWardOption(value)
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
    const handleSubmitAnt = async (value: any) => {
        console.log('description: ', description)
        if (photoUrl !== '' && description !== '') {
            setError('');
            const dateFrom = new Date(value?.dateFrom_dateTo[0]);
            const dateTo = new Date(value?.dateFrom_dateTo[1]);
            const params: PostCreatedV2 = {
                postCategoryId: value?.postCategory,
                postDescription: description,
                dateFrom: dateFrom,
                dateTo: dateTo,
                priority: value?.piority,
                isPremium: value?.isPremium,
                postPositions: value?.postPositions?.map((postPosition: PostPosition) => {
                    // const timeRange: Moment[] = postPosition.timeFrom_timeTo;
                    // const formattedTimeRange = timeRange?.map((time) => time.format(FormatTime));
                    return {
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
                        latitude: 10.841444,
                        longitude: 106.810033,
                    }
                }),
                trainingPositions: value?.trainingPosition?.map((postPosition: PostTrainingPosition) => {
                    // const timeRange: Moment[] = postPosition.trainingTimeFrom_timeTo;
                    // const formattedTimeRange = timeRange?.map((time) => time.format(FormatTime));
                    return {
                        trainingCertificateId: postPosition.certificateTrainingOption,
                        documentId: postPosition.documentTrainingOption,
                        positionName: postPosition.trainingPositionName,
                        amount: postPosition.traingAmount,
                        salary: postPosition.trainingSalary,
                        timeFrom: postPosition.trainingTimeFrom_timeTo[0],
                        timeTo: postPosition.trainingTimeFrom_timeTo[1],
                        isBusService: postPosition.isBusServiceTraining,
                        schoolName: postPosition.schoolNameTraining,
                        location: postPosition.locationTraining,
                        latitude: 1.20931,
                        longitude: 3.418731,
                    }
                }),
                postImg: photoUrl
            }
            confirm({
                title: 'Do you want to create post?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                // content: 'Some descriptions',
                onOk() {
                    setLoading(true)
                    handleAddPost(params).then().catch((error) => {
                        message.error('Intenal server error!')
                        setLoading(false)
                    })
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

            console.log("value: ", params);
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
                message.success('Create post success!');
                form.resetFields();
                setLoading(false);
            }
        }).catch((error) => {
            console.error(error)
        })
    }
    const handleAddPosition = () => {
        const newPosition = {
            positionName: '',
            amount: null,
            salary: null,
        };
        setError('');
        setAdditionalPositions([...additionalPositions, newPosition]);
    };
    const handleAddTrainingPosition = () => {
        const newPosition = {
            namePosition: '',
            number: null,
            salary: null,
        };
        setErrorTraining('');
        setAdditionalTrainingPositions([...additionalTrainingPositions, newPosition]);
    };

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
        const result = await dispatch(getPostTitle());
    }
    const fetchDocumentOption = async () => {
        const result = await dispatch(getDocument());
    }
    const fetchCertificateOption = async () => {
        const result = await dispatch(getCertificate());
    }
    const fetchProvinceOption = async () => {
        const result = await dispatch(getProvince());
        console.log('first: ', province)
    }
    const fetchDistrictOption = async (value: string) => {
        const result = await dispatch(getDistrict(value));
        console.log('first: ', province)
    }
    const fetchWardOption = async (value: string) => {
        const result = await dispatch(getWard(value));
    }
    const handleChangePosition = (value: PostOptionI | null) => {
        setValue('postTitle', value?.id)
    }
    useEffect(() => {
        fetchProvinceOption();
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
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e1); // For demo purposes.

            if (active) {
                setOptionsAPI([...postTitleOptionsAPI]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptionsAPI([]);
        }
    }, [open]);
    const handler = {
        handleAddPosition,
        handleAddTrainingPosition,
        handleChangePosition,
        handleDeletePosition,
        handleSubmit,
        onPremiumChange,
        onChangeSliderPiority,
        onSubmit,
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
        handleChangeProvince,
        handleChangeDistrict,
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
        fetchCertificateOption
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
