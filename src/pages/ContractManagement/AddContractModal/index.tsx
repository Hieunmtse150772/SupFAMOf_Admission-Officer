import { ProCard, ProList, StepsForm } from "@ant-design/pro-components";
import { Box } from "@mui/material";
import { Badge, Button, Modal, Space, Spin, Tag, message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { Span } from "components/Typography";
import { getCollabByContractId, sendContractEmail } from "features/contractSlice";
import CollabListInfo from "models/collabListInfo.model";
import { FC, Key, useEffect, useState } from "react";

interface AddContractModalProps {
    open: boolean,
    setOpenAddCollabModal: React.Dispatch<React.SetStateAction<boolean>>,
    amountUnConfirmed: number,
    collabList: CollabListInfo[],
    contractId: string,
    fetchContractList: () => void
}
const AddContractModal: FC<AddContractModalProps> = (
    {
        open,
        setOpenAddCollabModal,
        amountUnConfirmed,
        collabList,
        contractId,
        fetchContractList
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
    const [searchByEmail, setSearchByEmail] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let isSubmitting = false;

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys)
        },
    };

    const handleNext = async () => {
        if (selectedRowKeys.length === 0) {
            message.error('Please enter at least one collab!')
        } else {
            setCollabPicker(collabList.filter((registration) => selectedRowKeys.includes(registration.id)))
            return true
        }
    }
    const handleConfirm = async () => {
        setLoading(true)
        const numbers = selectedRowKeys.map((key) => +key);
        const params = {
            contractId: contractId,
            accountIds: numbers
        }
        try {
            await dispatch(sendContractEmail(params))
                .then((result: any) => {
                    console.log('result: ', result);
                    if (result.payload.status === 400) {
                        message.warning(result.payload.message);
                        setLoading(false);
                    } else if (result.payload.status === 200) {
                        message.success('Send contract to collaborators successfull');
                        setLoading(false);
                        setOpenAddCollabModal(false);
                        fetchContractList();
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
    const handleSearchCollabByEmail = async (email: string) => {
        setSearchByEmail(email);
        const result = await dispatch(getCollabByContractId(
            {
                contractId: contractId,
                search: email,
                page: 1,
                PageSize: 10
            }))
    }

    const fetchCollabByContractId = async () => {
        const result = await dispatch(getCollabByContractId(
            {
                contractId: contractId,
                search: searchByEmail,
                page: page,
                PageSize: pageSize
            }))
    }
    useEffect(() => {
        setDataSource(collabList);
    }, [collabList]);
    useEffect(() => {
        const fetch = async () => {
            await fetchCollabByContractId();
        }
        fetch();
    }, [page, pageSize])
    // useEffect(() => {
    //     fetchCollabByEmail()
    // }, [searchByEmail])
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
                />
            </Space >

        );
    };
    return (
        <Spin spinning={isLoading}>
            <StepsForm
                submitter={{
                    render: (props) => {
                        if (props.step === 0) {
                            return (
                                <Button
                                    color='primary'
                                    type="primary"
                                    htmlType="submit"
                                    onClick={() => {
                                        handleNext();
                                        props.form?.submit()
                                    }}
                                >
                                    Next
                                </Button>
                            );
                        }
                        if (props.step === 1) {
                            return (
                                <Box>
                                    <Button type="default" onClick={() => props.onPre()}>
                                        Previous
                                    </Button>
                                    <Button
                                        color='primary'
                                        type="primary"
                                        htmlType="submit"
                                        disabled={isLoading}
                                        onClick={() => {
                                            handleConfirm()
                                        }}
                                    >
                                        Finish
                                    </Button>
                                </Box>
                            );
                        }
                        return null; // Default return to handle other cases
                    },
                }}
                stepsFormRender={(dom, submitter) => {
                    return (
                        <Modal
                            width={1190}
                            title={'Confirm contract'}
                            onCancel={() => setOpenAddCollabModal(false)}
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
                        <Span>Choose collaborator to send contract</Span>
                        <ProList<DataItem>
                            loading={loading}
                            rowKey="id"
                            style={{ width: '100%' }}
                            headerTitle="List Collab Register"
                            dataSource={dataSource}
                            pagination={{
                                showSizeChanger: true,
                                onChange(page, pageSize) {
                                    setPage(page);
                                    setPageSize(pageSize);
                                },
                                pageSizeOptions: pageSizeOptions,
                                defaultPageSize: 5,
                                total: amountUnConfirmed
                            }}
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
                                    ],
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
                                        <>{row.name}</>
                                    )
                                },
                                avatar: {
                                    dataIndex: 'imgUrl',
                                    editable: false,
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <img src={row.imgUrl} alt="Avatar" width={50} />),
                                    valueType: 'avatar'
                                },
                                content: {
                                    dataIndex: 'email',
                                    render: (text, row, index, action) => (
                                        <>{row.email}</>
                                    )
                                },
                                description: {
                                    dataIndex: 'account.phone',
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <>{row.phone}</>
                                    )
                                },
                                subTitle: {
                                    render: (text, row, index, action) => {
                                        return row.isPremium ? (
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
                            rowSelection={rowSelection}
                        />
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm
                    name="Confirm"
                    title="Confirm"
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
                            loading={isLoading}
                            rowKey="id"
                            style={{ width: '100%' }}
                            headerTitle={activeKey === 'tab1' ? <Span>List collab confirmed</Span> : <Span>List collab rejected</Span>}
                            dataSource={collabPicker}
                            metas={{
                                title: {
                                    dataIndex: 'name',
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <>{row.name}</>
                                    )
                                },
                                avatar: {
                                    dataIndex: 'imgUrl',
                                    editable: false,
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <img src={row.imgUrl} alt="Avatar" width={50} />),
                                    valueType: 'avatar'
                                },
                                description: {
                                    dataIndex: 'phone',
                                    search: false,
                                    render: (text, row, index, action) => (
                                        <>{row.phone}</>
                                    )
                                },
                                content: {
                                    dataIndex: 'account.email',
                                    render: (text, row, index, action) => (
                                        <>{row.email}</>
                                    )
                                },
                                subTitle: {
                                    render: (text, row, index, action) => {
                                        return row.isPremium ? (
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
                                total: rowSelection.selectedRowKeys.length
                            }}
                        />
                    </ProCard>

                </StepsForm.StepForm>
            </StepsForm>
        </Spin>

    )
}

export default AddContractModal;
