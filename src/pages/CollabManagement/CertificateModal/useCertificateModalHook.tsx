import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, message } from "antd";
import { useAppDispatch } from "app/store";
import { giveCertificateByAccountId, removeCertificateByAccountId } from "features/collabSlice";
import { Certificate } from "models/collabListInfo.model";
import { Key, useEffect, useState } from "react";
import useSessionTimeOut from "utils/useSessionTimeOut";

const useEditPostModal = (
    certificateList: Certificate[],
    accountId: string,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchCollabList: () => void
) => {
    const { confirm } = Modal
    const dispatch = useAppDispatch();
    const { SessionTimeOut } = useSessionTimeOut();
    type DataItem = (typeof certificateList)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(certificateList);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    useEffect(() => { setDataSource(certificateList) }, [certificateList])
    console.log('certificateList 111', certificateList)
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            if (keys.length <= 1) {
                setSelectedRowKeys(keys)
            } else message.warning('You can only choose one certificate to remove')
        },
    };
    const handleRemoveCertificateByAccountId = async () => {
        console.log('select')
        const certificateName = certificateList?.find((certificate) => certificate?.id === selectedRowKeys[0])?.certificateName
        confirm({
            title: `Do you want to remove ${certificateName}?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                const params = {
                    accountId: accountId,
                    accountCertificateId: String(selectedRowKeys[0]),
                    status: 2
                }
                dispatch(removeCertificateByAccountId(params)).then((response: any) => {
                    console.log('response: ', response)
                    if (response?.payload?.data?.status?.success) {
                        message.success(`Remove certificate ${certificateName} success`);
                        fetchCollabList();
                        setOpenCertificateModal(false);
                    } else message.error('Remove certificate fail');
                }).catch((error) => {
                    console.log("Error in getting the data", error)
                })
                console.log('params: ', params)
            },
            onCancel() {
            },
        })

    }
    const handleGiveCertificateByAccountId = async (value: any) => {
        console.log('valeu: ', value);
        const params = {
            accountId: accountId,
            trainingCertificates: value?.trainingCertificateId?.map((id: number) => ({ trainingCertificateId: id }))
        }
        await dispatch(giveCertificateByAccountId(params)).then((response: any) => {
            console.log('response: ', response)
            if (response?.payload?.data?.status?.success) {
                message.success(response?.payload?.data?.status?.message);
                fetchCollabList();
                setOpenCertificateModal(false);
            } else if (response?.payload?.status === 401) {
                SessionTimeOut();
            } else message.error('Give certificate fail');
        }).catch((error) => {
            console.log("Error in getting the data", error)
        })
        console.log('params: ', params)
    }
    const handler = {
        handleRemoveCertificateByAccountId,
        handleGiveCertificateByAccountId,
    }
    const props = {
        rowSelection, selectedRowKeys, dataSource,
    }
    return { handler, props }
}

export default useEditPostModal;
