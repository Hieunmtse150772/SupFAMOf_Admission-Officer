import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProForm } from "@ant-design/pro-components";
import { Modal, UploadFile, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { UploadProps } from "antd/lib/upload";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import dayjs from "dayjs";
import { updateContract } from "features/contractSlice";
import ContractInfo from "models/contract.model";
import ContractUpdated from "models/contractUpdated.model";
import { useState } from "react";
import { uploadDocs } from "../../../firebase";

export type ContractFormValue = {
    dateFrom_dateTo: Date[],
    signingDate: Date,
    contractName: string,
    salary: number,
}
function useEditContractModalHook(fetchContractList: () => void, setOpenEditContractModal: React.Dispatch<React.SetStateAction<boolean>>, contractInfo: ContractInfo) {
    const dispatch = useAppDispatch();
    const [form] = ProForm.useForm();
    const { confirm } = Modal;
    const { loading } = useAppSelector(state => state.class)
    const [assignDate, setAssignDate] = useState<Date>()
    const [FileContract, setFileContract] = useState<any>('');
    const [isloading, setLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: contractInfo?.contractName,
            status: 'done',
            url: contractInfo?.sampleFile,
        },
    ]);
    const [errorUrl, setErrorUrl] = useState<string>('');
    const [disableDate, setDisableDate] = useState<boolean>(true)
    const [error, setError] = useState<string>('');
    const [description, setDescription] = useState<string>(contractInfo?.contractDescription ? contractInfo?.contractDescription : '');


    const handleSubmitEditContract = async (value: ContractFormValue) => {
        console.log('description: ', description)
        console.log('value: ', value)
        let result = false;
        if (description !== '') {
            setError('');
        }
        if (description !== '') {
            setError('');
            confirm({
                title: 'Do you want to edit contract?',
                icon: <ExclamationCircleFilled rev={undefined} />,
                onOk: async () => {
                    setLoading(true)
                    const dateFrom_dateTo = value?.dateFrom_dateTo;
                    console.log("dateFrom_dateTo: ", dateFrom_dateTo);
                    const dateFrom = new Date(dateFrom_dateTo[0]);
                    const dateTo = new Date(dateFrom_dateTo[1]);
                    const contractUrl = FileContract ? await uploadDocs(FileContract, setLoading) : contractInfo?.sampleFile; // Gọi hàm upload của bạn
                    const params: ContractUpdated = {
                        contractId: contractInfo?.id,
                        contractName: value?.contractName,
                        contractDescription: description,
                        sampleFile: contractUrl,
                        signingDate: value?.signingDate,
                        startDate: dateFrom,
                        endDate: dateTo,
                        totalSalary: Number(value?.salary)
                    }
                    console.log('params: ', params);
                    if (params) {
                        await dispatch(updateContract(params)).then((response: any) => {
                            console.log('repsonse: ', response)
                            if (response?.payload?.status === 200) {
                                setLoading(false)
                                message.success('Create contract success!')
                                fetchContractList()
                                form.submit();
                                result = true;
                                setOpenEditContractModal(false);
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
    const handler = {
        handleSubmitEditContract,
        disabledDateStart,
        handleChange,
        customRequest,
        handleAssignDateChange,
        disabledDate,
        setDescription
    }
    const props = {
        form,
        loading,
        disableDate,
        error,
        fileList
    }
    return { handler, props }
}

export default useEditContractModalHook
