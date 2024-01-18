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
import moment from "moment";
import { useEffect, useState } from "react";
import useSessionTimeOut from "utils/useSessionTimeOut";
import { uploadContracts } from "../../../firebase";

export type ContractFormValue = {
    dateFrom_dateTo: Date[],
    signingDate: Date,
    contractName: string,
    salary: number,
}
function useEditContractModalHook(fetchContractList: () => void, setOpenEditContractModal: React.Dispatch<React.SetStateAction<boolean>>, contractInfo: ContractInfo) {
    const dispatch = useAppDispatch();
    const { SessionTimeOut } = useSessionTimeOut();
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
    const [paramsUpdateContract, setParamsUpdateContract] = useState<ContractUpdated>()

    const handleSubmitEditContract = async (value: ContractFormValue) => {
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
                    const dateFrom = moment(dateFrom_dateTo[0]).format('YYYY-MM-DDTHH:mm:ss');
                    const dateTo = moment(dateFrom_dateTo[1]).format('YYYY-MM-DDTHH:mm:ss');
                    const contractUrl = FileContract !== '' ? await uploadContracts(FileContract, setLoading) : contractInfo?.sampleFile; // Gọi hàm upload của bạn
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
                    setParamsUpdateContract(params);
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
    const handleUpdateContractApi = async (params: ContractUpdated): Promise<boolean> => {
        let result = false;
        await dispatch(updateContract(params)).then((response: any) => {
            if (response?.payload?.status === 200) {
                setLoading(false);
                message.success('Update contract success!');
                fetchContractList();
                result = true;
            } else if (response?.payload?.status === 401) {
                SessionTimeOut();
            } else if (response?.payload?.status === 400) {
                message.error('Description too long');
                result = false;
                setLoading(false);
            } else {
                message.error(response?.payload?.message);
                result = false;
                setLoading(false);
            }
        }).catch((error) => {
            message.error('Intenal server error!');
            setLoading(false);
            result = false;
            console.error(error);
        })
        return result;
    }
    useEffect(() => {
        if (paramsUpdateContract) {
            handleUpdateContractApi(paramsUpdateContract).then((repsonse: boolean) => {
                if (repsonse) {
                    setOpenEditContractModal(false);
                }
            })
        }
    }, [paramsUpdateContract])
    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            setFileContract(file);
            onSuccess();
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
