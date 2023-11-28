import { ProCard, ProList, StepsForm } from "@ant-design/pro-components";
import { unwrapResult } from "@reduxjs/toolkit";
import { Badge, Modal, Progress, Space, Spin, Tag, message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { Span } from "components/Typography";
import { confirmPositionByCollabList, getRegistrationByPositionId } from "features/registrationSlice";
import Registrations from "models/registration.model";
import { FC, Key, useEffect, useState } from "react";

interface ConfirmRegistrationModalProps {
    open: boolean,
    setOpenConfirmModal: React.Dispatch<React.SetStateAction<boolean>>,
    total: number,
    registerAmount: number,
    amountUnConfirmed: number,
    collabList: Registrations[],
    positionId: string
}
const ConfirmRegistrationModal: FC<ConfirmRegistrationModalProps> = (
    {
        open,
        setOpenConfirmModal,
        total,
        registerAmount,
        amountUnConfirmed,
        collabList,
        positionId
    }
) => {
    const dispatch = useAppDispatch();
    type DataItem = (typeof collabList)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(collabList);
    const loading = useAppSelector(state => state.registration.loading);
    const [collabPicker, setCollabPicker] = useState<DataItem[]>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<number>(1);
    const [searchByEmail, setSearchByEmail] = useState<string>('');

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            console.log("pre: ", selectedRowKeys)
            console.log("af: ", keys)
            if ((percent === 100) && (selectedRowKeys.length < keys.length)) { message.error('The number of participants is sufficient!') } else {
                setSelectedRowKeys(keys)
            }
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
        if (selectedRowKeys.length === 0) {
            message.error('Please enter at least one collab!')
        } else {
            setCollabPicker(collabList.filter((registration) => selectedRowKeys.includes(registration.id)))
            return true
        }
    }
    const handleSearchCollabByEmail = async (email: string) => {
        setSearchByEmail(email)
    }
    const fetchCollabByPositionId = async () => {
        const result = await dispatch(getRegistrationByPositionId(
            {
                positionId: positionId,
                searchEmail: searchByEmail,
                Status: status
            }))
    }
    const getTitle = (): React.ReactNode => {
        return activeKey === 'tab1' ? <Span>List collab confirmed</Span> : <Span>List collab rejected</Span>;
    };
    useEffect(() => {
        fetchCollabByPositionId()
    }, [searchByEmail, status])
    useEffect(() => {
        setDataSource(collabList);
    }, [collabList]);
    const handleConfirm = async () => {
        setLoading(true)
        const numbers = selectedRowKeys.map((key) => +key);
        const params = {
            ids: numbers,
            IsApproved: activeKey === 'tab1' ? true : false
        }
        try {
            await dispatch(confirmPositionByCollabList(params))
                .then((result) => {
                    console.log('result: ', result);
                    unwrapResult(result)
                    if (result.meta.requestStatus === "rejected") {
                        message.warning('Slot already full!');
                        setLoading(false)
                    } else if (result.meta.requestStatus === "fulfilled") {
                        message.success(activeKey === 'tab1' ? 'Confirm collab successfull' : 'Rejected collab successfull');
                        setLoading(false)
                        setOpenConfirmModal(false);
                    }
                }
                )
                .catch((error) => {
                    setLoading(false)
                    message.error('Server internal error');
                }
                )
        } catch (error) {
            setLoading(false)
            message.error('Server internal error');
        } finally {
            setLoading(false)
        }

    }

    const renderBadge = (count: number, active = false, title: string) => {
        return (
            <Space
                style={{
                    marginBlockStart: -2,
                    marginInlineStart: 4,
                    color: active ? 'black' : '#999',
                }}>
                {title}
                < Badge
                    count={count}
                    style={{
                        marginBlockStart: -2,
                        marginInlineStart: 4,
                        color: active ? '#1890FF' : '#999',
                        backgroundColor: active ? '#E6F7FF' : '#eee',
                    }
                    }
                />|
            </Space >

        );
    };
    useEffect(() => {
        setPercent((selectedRowKeys.length * 100) / total)
    }, [selectedRowKeys])
    return (
        <Spin spinning={isLoading}>
            <StepsForm
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
                        {activeKey === 'tab1' ? <> <Span>Choose Collab to confirm</Span><Progress percent={Number(percent.toFixed(2))} type="line" style={{ width: '100%' }} /></> : <Span>Choose Collab to reject</Span>}
                        <ProList<DataItem>
                            loading={loading}
                            rowKey="id"
                            style={{ width: '100%' }}
                            headerTitle="List Collab Register"
                            dataSource={dataSource}
                            toolbar={{
                                menu: {
                                    activeKey,
                                    items: [
                                        {
                                            key: 'tab1',
                                            label: (
                                                renderBadge(amountUnConfirmed, activeKey === 'tab1', 'Unconfirmed')
                                            ),
                                        },
                                        {
                                            key: 'tab2',
                                            label: (
                                                renderBadge(registerAmount, activeKey === 'tab2', 'Confirmed')
                                            ),
                                        },
                                    ],
                                    onChange(key) {
                                        if (key === 'tab1') {
                                            setSelectedRowKeys([])
                                            setStatus(1);
                                            setActiveKey(key);
                                        } else {
                                            setSelectedRowKeys([])
                                            setStatus(2);
                                            setActiveKey(key);
                                        }

                                    },
                                },
                                search: {
                                    onSearch: (value: string) => {
                                        setLoading(true)
                                        handleSearchCollabByEmail(value);
                                    },
                                    placeholder: 'Enter email'
                                },
                            }}
                            metas={{
                                id: {
                                    dataIndex: 'id',
                                    search: false
                                },
                                title: {
                                    dataIndex: 'row.account.name',
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
                                content: {
                                    dataIndex: 'email',
                                    render: (text, row, index, action) => (
                                        <>{row.account.email}</>
                                    )
                                },
                                description: {
                                    dataIndex: 'account.phone',
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <>{row.account.phone}</>
                                    )
                                },
                                subTitle: {
                                    render: (text, row, index, action) => {
                                        return row.account.isPremium ? (
                                            <Space size={0}>
                                                <Tag color="yellow">Premium</Tag>
                                            </Space>
                                        ) : (
                                            <Space size={0}>
                                                <Tag color="blue">Normal</Tag>
                                            </Space>
                                        );
                                    },
                                    search: false
                                },
                            }}
                            pagination={{
                                pageSize: 5,
                            }}
                            rowSelection={rowSelection}
                        />
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    loading={isLoading}
                    name="Confirm"
                    title="Confirm"
                    onFinish={async () => {
                        handleConfirm()
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
                            headerTitle={activeKey === 'tab1' ? <Span>List collab confirmed</Span> : <Span>List collab rejected</Span>}
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
                                    render: (text, row, index, action) => {
                                        return row.account.isPremium ? (
                                            <Space size={0}>
                                                <Tag color="yellow">Premium</Tag>
                                            </Space>
                                        ) : (
                                            <Space size={0}>
                                                <Tag color="blue">Normal</Tag>
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
        </Spin>

    )
}

export default ConfirmRegistrationModal;
