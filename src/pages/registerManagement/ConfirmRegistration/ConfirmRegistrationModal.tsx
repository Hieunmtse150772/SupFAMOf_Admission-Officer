import { ProCard, ProList, StepsForm } from "@ant-design/pro-components";
import { Modal, Progress, Space, Tag, message } from "antd";
import CollabInfo from "models/collab.model";
import Registrations from "models/registration.model";
import { FC, Key, useEffect, useState } from "react";

interface ConfirmRegistrationModalProps {
    open: boolean,
    setOpenConfirmModal: React.Dispatch<React.SetStateAction<boolean>>,
    listCollab: CollabInfo[],
    total: number,
    handleSubmit: (value: any) => Promise<boolean | void>,
    registrationList: Registrations[]
}
const ConfirmRegistrationModal: FC<ConfirmRegistrationModalProps> = ({ listCollab, open, setOpenConfirmModal, total, handleSubmit, registrationList }) => {
    console.log('registrationList: ', registrationList)
    type DataItem = (typeof registrationList)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(registrationList);
    const [collabPicker, setCollabPicker] = useState<DataItem[]>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            if (percent <= 100) { setSelectedRowKeys(keys) } else message.error('The number of participants is sufficient!')
        },
    };
    const [percent, setPercent] = useState<number>(0);
    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    const handleNext = async () => {
        if (percent < 100) {
            message.error('Please enter full collaborator!')
        } else {
            console.log('rowkey: ', selectedRowKeys)
            setCollabPicker(registrationList.filter((registration) => selectedRowKeys.includes(registration.id)))
            return true
        }
    }
    const handleConfirm = async () => {

    }
    useEffect(() => {
        setPercent((selectedRowKeys.length * 100) / total)
    }, [selectedRowKeys])
    return (

        <StepsForm
            onFinish={async (values) => {
                console.log(values);
                await waitTime(1000);
                message.success('提交成功');
            }}
            formProps={{
                validateMessages: {
                    required: '此项为必填项',
                },
            }}
            stepsFormRender={(dom, submitter) => {
                return (
                    <Modal
                        width={1190}
                        title={'Confirm position'}
                        onCancel={() => setOpenConfirmModal(false)}
                        open={open}
                        footer={submitter}
                        destroyOnClose
                    >
                        {dom}
                    </Modal>
                )
            }}
        >
            <StepsForm.StepForm
                name="collab_confirm"
                title="Choose collab"
                onFinish={handleNext}
            >
                <ProCard
                    title="Collaborator list"
                    bordered
                    headerBordered
                    collapsible
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 1000,
                        maxWidth: '100%',
                    }}
                >
                    <Progress percent={Number(percent.toFixed(2))} type="line" style={{ width: '100%' }} />
                    <ProList<DataItem>
                        rowKey="id"
                        style={{ width: '100%' }}
                        headerTitle="List Collab Register"
                        dataSource={dataSource}
                        metas={{
                            id: {
                                dataIndex: 'id'
                            },
                            title: {
                                dataIndex: 'name',
                                search: false,
                                render: (text, row, index, action) => (
                                    <>{row.account.name}</>
                                )
                            },
                            avatar: {
                                dataIndex: 'imgUrl',
                                editable: false,
                                search: false,
                                render: (text, row, index, action) => (
                                    <img src={row.account.imgUrl} alt="Avatar" width={50} />),
                                valueType: 'avatar'
                            },
                            description: {
                                dataIndex: 'phone',
                                search: false,
                                render: (text, row, index, action) => (
                                    <>{row.account.email}</>
                                )
                            },
                            content: {
                                dataIndex: 'account.email',
                                render: (text, row, index, action) => (
                                    <>{row.account.phone}</>
                                )
                            },
                            subTitle: {
                                render: () => {
                                    return (
                                        <Space size={0}>
                                            <Tag color="blue">IsPremium</Tag>
                                        </Space>
                                    );
                                },
                                search: false
                            },
                            actions: {
                                render: (text, row, index, action) => [
                                    <div
                                        onClick={() => {
                                            action?.startEditable(row.id);
                                        }}
                                        key="link"
                                    >
                                        Pick
                                    </div>,
                                ],
                            },

                        }}
                        pagination={{
                            pageSize: 5,
                        }}
                        rowSelection={rowSelection}
                        search={{}}

                    />
                </ProCard>
            </StepsForm.StepForm>
            <StepsForm.StepForm
                name="confirm"
                title="confirm"
                onFinish={async () => {
                    await waitTime(2000);
                    return true;
                }}
            >
                <ProCard
                    title="Collaborator list"
                    bordered
                    headerBordered
                    collapsible
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 1000,
                        maxWidth: '100%',
                    }}
                >
                    <ProList<DataItem>
                        rowKey="id"
                        style={{ width: '100%' }}
                        headerTitle="List Collab Register"
                        dataSource={collabPicker}
                        metas={{
                            title: {
                                dataIndex: 'name',
                                search: false,
                                render: (text, row, index, action) => (
                                    <>{row.account.name}</>
                                )
                            },
                            avatar: {
                                dataIndex: 'imgUrl',
                                editable: false,
                                search: false,
                                render: (text, row, index, action) => (
                                    <img src={row.account.imgUrl} alt="Avatar" width={50} />),
                                valueType: 'avatar'
                            },
                            description: {
                                dataIndex: 'phone',
                                search: false,
                                render: (text, row, index, action) => (
                                    <>{row.account.phone}</>
                                )
                            },
                            content: {
                                dataIndex: 'account.email',
                                render: (text, row, index, action) => (
                                    <>{row.account.email}</>
                                )
                            },
                            subTitle: {
                                render: () => {
                                    return (
                                        <Space size={0}>
                                            <Tag color="blue">IsPremium</Tag>
                                        </Space>
                                    );
                                },
                                search: false
                            },

                        }}
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                </ProCard>

            </StepsForm.StepForm>
        </StepsForm>
    )
}

export default ConfirmRegistrationModal;
