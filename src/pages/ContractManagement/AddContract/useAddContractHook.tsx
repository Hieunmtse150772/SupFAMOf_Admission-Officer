import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProForm } from "@ant-design/pro-components";
import { unwrapResult } from '@reduxjs/toolkit';
import { Modal, UploadProps, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { UploadFile } from 'antd/lib/upload';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import dayjs from "dayjs";
import { createContract } from 'features/contractSlice';
import ContractCreated from 'models/contractCreated.model';
import { useEffect, useState } from "react";
import { uploadImage } from '../../../firebase';
const useAddContractHook = () => {
    const [form] = ProForm.useForm();
    const { confirm } = Modal;

    const dispatch = useAppDispatch();
    const postInfo = useAppSelector(state => state.post.postInfo)
    const [url, setUrl] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [disableDate, setDisableDate] = useState<boolean>(true)
    const [disableDateAssign, setDisableDateAsign] = useState<RangePickerProps['disabledDate']>()
    const [assignDate, setAssignDate] = useState<Date>()
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [errorUrl, setErrorUrl] = useState<string>('');
    const [FileContract, setFileContract] = useState<any>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [endDateLimit, setEndDateLimit] = useState<Date[]>();
    const [paramsCreateContract, setParamsCreateContract] = useState<ContractCreated>()
    const [amountInWords, setAmountInWords] = useState('');

    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            setTimeout(() => {
                setFileContract(file);
                onSuccess();
            }, 2000);
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (FileContract !== '') setErrorUrl('');
    }
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Lấy thời điểm hiện tại
        const currentTime = dayjs();

        // Thêm 48 giờ (2 ngày) vào thời điểm hiện tại
        const twoDaysLater = currentTime.add(48, 'hour');

        // Kiểm tra nếu 'current' tồn tại và nhỏ hơn thời điểm sau 48 giờ
        return current && current < twoDaysLater;
    };
    const disabledDateStart: RangePickerProps['disabledDate'] = (current) => {
        // Lấy ngày hiện tại và thêm 2 ngày
        if (assignDate) {
            const twoDaysLater = dayjs(assignDate);
            return current && current < twoDaysLater.startOf('day');
        } else {
            const twoDaysLater = dayjs().add(2, 'day');
            // Kiểm tra nếu 'current' tồn tại và nhỏ hơn ngày hiện tại cộng 2 ngày
            return current && current < twoDaysLater.startOf('day');
        }
    };

    const handleAssignDateChange = (value: any) => {
        console.log('value: ', value)
        if (value) {
            setDisableDate(false);
            setAssignDate(value);
            const twoDaysLater = dayjs(value).get('day');
            form.setFieldValue('dateFrom_dateTo', null);

        } else {
            setDisableDate(true);
            form.setFieldValue('dateFrom_dateTo', null);
        }

    }
    const removeImage = () => {
        setFileContract('');
    }
    const handleCreateContract = async (params: ContractCreated) => {
        await dispatch(createContract(params)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                setLoading(false)
                message.success('Create post success!')
                removeImage();
                setFileList([]);
                form.resetFields();
                setLoading(false);
            }
        }).catch((error) => {
            message.error('Intenal server error!')
            setLoading(false)
            console.error(error)
        })
    }
    // const handleChange = (event: any) => {
    //     const inputAmount = event.target.value;
    //     // Chuyển đổi số thành chữ tiếng Việt
    //     const words = numberToWords.toWords(inputAmount);
    //     setAmountInWords(words);
    // };
    const handleSubmitAnt = async (value: any) => {
        console.log('value: ', value)
        console.log('description: ', description)

        if (description !== '') {
            setError('');
        }
        if (FileContract !== '' && description !== '') {
            setError('');
            confirm({
                title: 'Do you want to create post?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                onOk: async () => {
                    setLoading(true)
                    const photoUrl = await uploadImage(FileContract, setLoading); // Gọi hàm upload của bạn
                    const params: ContractCreated = {
                        contractName: value?.contractName,
                        contractDescription: description,
                        sampleFile: photoUrl,
                        signingDate: value?.signingDate,
                        startDate: value?.startingDate,
                        totalSalary: value?.endDate
                    }
                    setParamsCreateContract(params);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            if (description === '') {
                console.log('Description is required!')
                setError('Description is required!')
                message.warning('Add description to create post!');
            }
            if (FileContract === '') {
                console.log('Image is required!')

                setErrorUrl('Image is required!')
                message.warning('Add image to create post!');
            }
        }
    }

    useEffect(() => {
        if (paramsCreateContract) {
            handleCreateContract(paramsCreateContract)
        }
    }, [paramsCreateContract])

    const handler = {
        customRequest,
        disabledDate,
        handleAssignDateChange,
        disableDateAssign,
        disabledDateStart,
        setDescription,
        handleSubmitAnt,
        handleChange,
    }
    const props = {
        disableDate,
        form,
        error,
        errorUrl
    }
    return { handler, props }
}

export default useAddContractHook;
