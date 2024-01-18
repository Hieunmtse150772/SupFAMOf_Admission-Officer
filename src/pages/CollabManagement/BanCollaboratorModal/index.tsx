import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormDatePicker,
    ProFormTextArea
} from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import dayjs from 'dayjs';
import { banCollaboratorById } from 'features/collabSlice';
import { BanParamsI } from 'models/banParamsI.model';
import { FC } from 'react';
import useSessionTimeOut from 'utils/useSessionTimeOut';

interface BanCollaboratorModalProps {
    open: boolean,
    setOpenBanCollaborator: React.Dispatch<React.SetStateAction<boolean>>,
    accountId: number,
    accountName: string,
    fetchCollabList: () => void
}
const BanCollaboratorModal: FC<BanCollaboratorModalProps> = ({ open, setOpenBanCollaborator, accountId, accountName, fetchCollabList }) => {
    console.log('accountId: ', accountId)
    const { confirm } = Modal;
    const { SessionTimeOut } = useSessionTimeOut();
    const Formatter = 'YYYY-MM-DD';
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.collab.loading)
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleBanAccount = async (value: any) => {
        const params: BanParamsI = {
            accountIdBanned: accountId,
            note: value?.note,
            dayEnd: value?.dateEnd
        }
        confirm({
            title: `Do you want to ban ${accountName}?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                await dispatch(banCollaboratorById(params)).then((response: any) => {
                    if (response?.payload?.data?.status?.success) {
                        message.success(`Successfully banned ${accountName} account`);
                        setOpenBanCollaborator(false);
                        fetchCollabList();
                    } else if (response?.payload?.status === 401) {
                        SessionTimeOut();
                    } else message.error(response?.payload?.message);
                }).catch((error) => {
                    console.log("Error in getting the data", error)
                })
            },
            onCancel() {
            },
        });

    }
    return (
        <>
            <ModalForm
                title={`Ban ${accountName} account`}
                open={open}
                loading={loading}
                onOpenChange={setOpenBanCollaborator}
                onFinish={handleBanAccount}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={500}
            >
                <ProForm.Group>
                    <ProFormDatePicker
                        fieldProps={{
                            disabledDate: disabledDate
                        }}
                        width="lg"
                        name="dateEnd"
                        label="End date ban"
                        tooltip="The account will be banned until the date you choose"
                        rules={[{ required: true, message: 'Date end is required!' }]}
                    />
                    <ProFormTextArea
                        width="lg"
                        name="note"
                        label="Note"
                        placeholder="Reason for account ban"
                        rules={[{ required: true, message: 'The note is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default BanCollaboratorModal;
