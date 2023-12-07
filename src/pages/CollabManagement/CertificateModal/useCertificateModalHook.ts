import { message } from "antd";
import { useAppDispatch } from "app/store";
import { giveCertificateByAccountId } from "features/collabSlice";
import { Certificate } from "models/collabListInfo.model";
import { Key, useEffect, useState } from "react";

const useEditPostModal = (
    certificateList: Certificate[],
    accountId: string,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchCollabList: () => void
) => {
    const dispatch = useAppDispatch();
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
        const params = {
            accountId: accountId,
            trainingCertificateId: selectedRowKeys,
            status: 2
        }
        console.log('params: ', params)
    }
    const handleGiveCertificateByAccountId = async (value: any) => {
        console.log('valeu: ', value);
        const params = {
            accountId: accountId,
            trainingCertificates: value?.trainingCertificateId?.map((id: number) => ({ trainingCertificateId: id }))
        }
        dispatch(giveCertificateByAccountId(params)).then((response: any) => {
            console.log('response: ', response)
            if (response?.payload?.data?.status?.success) {
                message.success(response?.payload?.data?.status?.message);
                fetchCollabList();
                setOpenCertificateModal(false);
            } else message.error('Give certificate fail');
        })
        console.log('params: ', params)
    }
    const handler = {
        handleRemoveCertificateByAccountId,
        handleGiveCertificateByAccountId
    }
    const props = {
        rowSelection, selectedRowKeys, dataSource,
    }
    return { handler, props }
}

export default useEditPostModal;
