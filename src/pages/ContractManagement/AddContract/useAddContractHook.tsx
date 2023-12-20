import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProForm } from "@ant-design/pro-components";
import { Modal, UploadProps, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { UploadFile } from 'antd/lib/upload';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from "app/store";
import dayjs from "dayjs";
import { CollabListDto } from 'dtos/collabList.dto';
import { searchCollabListByEmail } from 'features/collabSlice';
import { createContract, getCollabByContractId, sendContractEmail } from 'features/contractSlice';
import ContractCreated from 'models/contractCreated.model';
import moment from 'moment';
import { Key, useEffect, useState } from "react";
import { uploadDocs } from '../../../firebase';
const useAddContractHook = () => {
    const [form] = ProForm.useForm();
    const { confirm } = Modal;

    const dispatch = useAppDispatch();
    const collabLists: CollabListDto = useAppSelector(state => state.contract.collabList);
    const loading = useAppSelector(state => state.contract.loading)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [disableDate, setDisableDate] = useState<boolean>(true)
    const [disableDateAssign, setDisableDateAsign] = useState<RangePickerProps['disabledDate']>()
    const [assignDate, setAssignDate] = useState<Date>()
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [errorUrl, setErrorUrl] = useState<string>('');
    const [FileContract, setFileContract] = useState<any>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [searchByEmail, setSearchByEmail] = useState<string>('');
    type DataItem = (typeof collabLists.data)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(collabLists.data);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [collabPicker, setCollabPicker] = useState<DataItem[]>();
    const [contractId, setContractId] = useState<string>('')
    const [isEdit, setEdit] = useState<boolean>(false);
    const [dateFrom, setDateFrom] = useState<Date | null>(null)
    const [dateTo, setDateTo] = useState<Date | null>(null)
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = collabLists?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys)
        },
    };
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
    const handleSearchCollabByEmail = async (email: string) => {
        if (email !== '') {
            await dispatch(searchCollabListByEmail({ email: email })).catch((error) => {
                console.log("Error in getting the data", error)
            });
        } else await dispatch(getCollabByContractId({ search: email, contractId: contractId })).catch((error) => {
            console.log("Error in getting the data", error)
        });
    }
    const handleChangeContractName = (value: any) => {
        if (value) {
            console.log('value.target.value: ', value.target.value)
            form.setFieldValue('contractName', value.target.value);
        } else {
            form.setFieldValue('contractName', '');
        }

    }
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
    // const handleChange = (event: any) => {
    //     const inputAmount = event.target.value;
    //     // Chuyển đổi số thành chữ tiếng Việt
    //     const words = numberToWords.toWords(inputAmount);
    //     setAmountInWords(words);
    // };
    const handleSubmitAnt = async (value: any): Promise<Boolean | void> => {
        console.log('description: ', description)
        let result = false;
        if (description !== '') {
            setError('');
        }
        if (FileContract !== '' && description !== '') {
            setError('');
            confirm({
                title: 'Do you want to create contract?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                onOk: async () => {
                    setLoading(true)
                    const dateFrom_dateTo = form.getFieldValue('dateFrom_dateTo');
                    const dateFrom = new Date(dateFrom_dateTo[0]);
                    setDateFrom(dateFrom);
                    const dateTo = new Date(dateFrom_dateTo[1]);
                    setDateTo(dateTo);
                    const photoUrl = await uploadDocs(FileContract, setLoading); // Gọi hàm upload của bạn
                    const params: ContractCreated = {
                        contractName: form.getFieldValue('contractName'),
                        contractDescription: description,
                        sampleFile: photoUrl,
                        signingDate: form.getFieldValue('signingDate'),
                        startDate: moment(dateFrom).format('YYYY-MM-DDTHH:mm:ss'),
                        endDate: moment(dateTo).format('YYYY-MM-DDTHH:mm:ss'),
                        totalSalary: Number(form.getFieldValue('salary'))
                    }
                    if (params) {
                        await dispatch(createContract(params)).then((response: any) => {
                            console.log('repsonse: ', response)
                            if (response?.payload?.status === 200) {
                                setLoading(false)
                                message.success('Create contract success!')
                                setContractId(response?.payload?.data?.data?.id);
                                fetchCollabList()
                                form.submit();
                                result = true;
                            } else if (response?.payload?.status === 400) {
                                message.error('Description too long')
                                setLoading(false);
                                result = false;
                            } else {
                                message.error(response?.payload?.message)
                                setLoading(false);
                                result = false;
                            }
                        }).catch((error) => {
                            message.error('Intenal server error!')
                            setLoading(false)
                            console.error(error)
                            result = false;
                        })
                    }
                },
                onCancel() {
                    result = false;
                },
            });
        } else {
            if (description === '') {
                setError('Description is required!')
                result = false;
            }
        }
        return result;
    }
    const handleConfirm = async () => {
        setLoading(true)
        console.log('contractId: ', contractId);
        const numbers = selectedRowKeys.map((key) => +key);
        try {
            await dispatch(sendContractEmail({ contractId: contractId, accountIds: numbers })).then((response: any) => {
                console.log('response: ', response)
                if (response.payload.status === 200) {
                    setLoading(false);
                    message.success('Send contract email success!');
                    form.submit();
                } else {
                    message.error(response?.payload?.message);
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }
    const handleNext = async () => {
        if (selectedRowKeys.length === 0) {
            message.error('Please enter at least one collab!')
        } else {
            setCollabPicker(collabLists.data.filter((collab) => selectedRowKeys.includes(collab.id)))
            form.submit()
            return true
        }
    }
    const fetchCollabList = async () => {
        if (contractId !== '') {
            await dispatch(getCollabByContractId({
                contractId: contractId,
                page: page,
                PageSize: pageSize
            })).catch((error) => {
                console.log("Error in getting the data", error)
            })
        }
    }

    useEffect(() => {
        fetchCollabList()
    }, [page, pageSize, contractId])
    useEffect(() => {
        setDataSource(collabLists.data)
    }, [collabLists])
    useEffect(() => {
    }, [isEdit])
    const handler = {
        customRequest,
        disabledDate,
        handleAssignDateChange,
        disableDateAssign,
        disabledDateStart,
        setDescription,
        handleSubmitAnt,
        handleChange,
        handleSearchCollabByEmail,
        setLoading,
        handleConfirm,
        handleNext,
        handleChangeContractName,
        setEdit,
        setDateFrom,
        setDateTo,
        setPage,
        setPageSize,
    }
    const props = {
        disableDate,
        form,
        error,
        errorUrl,
        isLoading,
        collabLists,
        loading,
        rowSelection,
        collabPicker,
        dataSource,
        fileList,
        isEdit,
        dateFrom,
        dateTo,
        pageSizeOptions,
        total

    }
    return { handler, props }
}

export default useAddContractHook;
