import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormTextArea
} from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import dayjs from 'dayjs';
import { updateBanCollaboratorById } from 'features/collabSlice';
import { UnBanParamsI } from 'models/banParamsI.model';
import { FC } from 'react';

interface UnBanCollaboratorModalProps {
    open: boolean,
    setOpenUnBanCollaborator: React.Dispatch<React.SetStateAction<boolean>>,
    accountId: number,
    accountName: string,
    fetchCollabList: () => void
}
const UnBanCollaboratorModal: FC<UnBanCollaboratorModalProps> = ({ open, setOpenUnBanCollaborator, accountId, accountName, fetchCollabList }) => {
    console.log('accountId: ', accountId)
    const { confirm } = Modal;
    const Formatter = 'YYYY-MM-DD';
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.collab.loading)
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleUnBanAccount = async (value: any) => {
        const params: UnBanParamsI = {
            accountBannedId: accountId,
            note: value?.note,
            isActive: false
        }
        confirm({
            title: `Do you want to unban ${accountName}?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                try {
                    await dispatch(updateBanCollaboratorById(params)).then((response: any) => {
                        console.log('response: ', response)
                        if (response?.payload?.data?.status?.success) {
                            message.success(`Successfully un banned ${accountName} account`);
                            setOpenUnBanCollaborator(false);
                            fetchCollabList();
                        } else message.error(response?.payload?.message);
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                } catch (error) {
                    message.error('Server internal error');
                }
            },
            onCancel() {
            },
        });

    }
    return (
        <>
            <ModalForm
                title={`Unban ${accountName} account`}
                open={open}
                loading={loading}
                onOpenChange={setOpenUnBanCollaborator}
                onFinish={handleUnBanAccount}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={400}
            >
                <ProForm.Group>
                    <ProFormTextArea
                        width='lg'
                        name="note"
                        label="Note"
                        placeholder="Reason for account unban"
                        rules={[{ required: true, message: 'The note is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default UnBanCollaboratorModal;
