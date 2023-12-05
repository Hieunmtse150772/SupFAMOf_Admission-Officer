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
    accountName: string
}
const UnBanCollaboratorModal: FC<UnBanCollaboratorModalProps> = ({ open, setOpenUnBanCollaborator, accountId, accountName }) => {
    console.log('accountId: ', accountId)
    const { confirm } = Modal;
    const Formatter = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.collab.loading)
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleUnBanAccount = async (value: any) => {
        const params: UnBanParamsI = {
            accountIdBanned: accountId,
            note: value?.note,
            isActive: true
        }
        confirm({
            title: `Do you want to unban ${accountName}?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                try {
                    dispatch(updateBanCollaboratorById(params)).then((response: any) => {
                        console.log('response: ', response)
                        if (response?.payload?.errorCode === 4002) {
                            message.error(response?.payload?.message)
                        } else if (response?.payload?.data?.status?.success) {
                            message.success(`Successfully un banned ${accountName} account`);
                            setOpenUnBanCollaborator(false);
                        } else message.error('Server internal error');
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
                title="Ban account collaborator"
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
                        placeholder="Reason for account ban"
                        rules={[{ required: true, message: 'The note is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default UnBanCollaboratorModal;
