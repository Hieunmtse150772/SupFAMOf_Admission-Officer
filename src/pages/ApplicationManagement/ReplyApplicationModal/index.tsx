import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormTextArea
} from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import { approveApplication, rejectApplication } from 'features/applicationSlice';
import { FC } from 'react';

interface ReplyApplicationProps {
    open: boolean,
    setOpenReplyModal: React.Dispatch<React.SetStateAction<boolean>>,
    status: boolean,
    applicationId: number,
    fetchApplicationList: () => void
}
const ReplyApplicationModal: FC<ReplyApplicationProps> = ({ open, setOpenReplyModal, applicationId, status, fetchApplicationList }) => {
    const { confirm } = Modal;
    const Formatter = 'YYYY-MM-DD';
    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.report.loading)
    const handleReplyApplication = async (value: any) => {
        confirm({
            title: `Do you want to ${status ? 'approve' : 'reject'} ?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                const params = {
                    reportId: applicationId,
                    replyNote: value?.replyNote
                }
                if (status) {
                    dispatch(approveApplication(params)).then((response: any) => {
                        if (response?.payload?.statusCode === 400) {
                            message.error(response?.payload?.message);
                        } else if (response?.payload?.data?.status?.success) {
                            message.success(`Successfully approve application`);
                            setOpenReplyModal(false);
                            fetchApplicationList();
                        } else message.error('Server internal error');
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                } else {
                    dispatch(rejectApplication(params)).then((response: any) => {
                        if (response?.payload?.statusCode === 400) {
                            message.error(response?.payload?.message);
                        } else if (response?.payload?.data?.status?.success) {
                            message.success(`Successfully reject application`);
                            setOpenReplyModal(false);
                            fetchApplicationList();
                        } else message.error('Server internal error');
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                }

            },
            onCancel() {
            },
        });


    }
    return (
        <>
            <ModalForm
                title={`Reply application to ${status ? 'approve' : 'reject'}`}
                open={open}
                loading={loading}
                onFinish={(value) => handleReplyApplication(value)}
                onOpenChange={setOpenReplyModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={500}
            >
                <ProForm.Group>
                    <ProFormTextArea
                        name='replyNote'
                        label='Reply note'
                        width='lg'
                        rules={[{ required: true, message: 'The note of reply is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default ReplyApplicationModal;
