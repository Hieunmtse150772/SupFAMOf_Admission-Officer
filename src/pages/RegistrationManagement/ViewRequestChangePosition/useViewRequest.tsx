import { CheckOutlined, CloseCircleOutlined, MoreOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Box } from '@mui/material';
import { Button, Drawer, Dropdown, MenuProps, Modal, Space, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getRequestByAccountId, updateRequest } from 'features/requestSlice';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';


interface ExpandedDataType {
    id: number,
    postId: number,
    positionName: string,
    amount: number,
    salary: number
}
type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
};
type SortModalI = {
    Sort: string,
    Order: string
}
type SearchParamsI = {
    postName?: string,
    postCode?: string,
    dateFrom?: Date,
    dateTo?: Date,
    status?: string,
    postCategoryId?: number
}
function useViewRequest(postId: number, fetchPost: () => void) {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;

    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const [editPostModalId, setEditPostModalId] = useState<string>('');
    const requests = useAppSelector(state => state.request.requests)
    const postInfoAPI = useAppSelector(state => state.post.postInfo);
    const isLoading = useAppSelector(state => state.request.loading);
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [statusFilter, setStatusFilter] = useState<number | null>();

    const postCode = requests?.data[0]?.post?.postCode;
    const [searchParams, setSearchParams] = useState<SearchParamsI>()
    const pageSizeOptions = [5, 10, 15]; // Các tùy chọn cho pageSize
    const total = requests?.metadata?.total
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let navigate = useNavigate();

    const columns: ProColumns[] = [
        {
            title: 'Post Code',
            dataIndex: 'postCode',
            key: 'postCode',
            hideInSearch: true,
            width: 10,
            render: (dom, entity) => {
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: 'Category',
            dataIndex: 'postCategoryName',
            key: 'postCategoryName',
            hideInSearch: true,
            width: 5,
        },
        {
            title: 'Date',
            hideInSearch: true,
            dataIndex: 'createAt',
            key: 'createAt',
            valueType: 'date',
            width: 30,
            sorter: true,
        },
        {
            title: 'Start Date',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            valueType: 'date',
            width: 30,
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Current Position',
            dataIndex: 'originalPositionName',
            key: 'originalPositionName',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'Amount',
            dataIndex: 'currentPositionAmount',
            key: 'currentPositionAmount',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'Expected Position',
            dataIndex: 'positionNeedToUpdateName',
            key: 'positionNeedToUpdateName',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'Amount',
            dataIndex: 'expectedPositionAmount',
            key: 'expectedPositionAmount',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'stauts',
            width: 30,
            hideInSearch: true,
            render: (rows) => {
                switch (rows) {
                    case 1:
                        return (
                            <Space size={0}>
                                <Tag color="green">Pending</Tag>
                            </Space>
                        )
                    case 2:
                        return (
                            <Space size={0}>
                                <Tag color="blue">Approved</Tag>
                            </Space>
                        )
                    case 3:
                        return (
                            <Space size={0}>
                                <Tag color="red">Rejected</Tag>
                            </Space>
                        )
                    default:
                        break;
                }
            },
        },
        {
            title: 'Action',
            align: 'center',
            width: 10,
            dataIndex: 'status',
            hideInSearch: true,
            valueEnum: {
                1: {
                    text: 'Pending',
                    status: 'Pending',
                },
                2: {
                    text: 'Approved',
                    status: 'Approved',
                },
                3: {
                    text: 'Rejected',
                    status: 'Rejected',
                },
            },
            render: (value, valueEnum) => {
                const items: MenuProps['items'] = [
                    {
                        label: 'Approve',
                        key: '1',
                        icon: <CheckOutlined color='green' rev={undefined} />,
                        onClick: () => handleUpdateRequest(value, true),
                        disabled: Boolean(valueEnum.status !== 1)
                    },
                    {
                        label: 'Reject',
                        key: '2',
                        icon: <CloseCircleOutlined rev={undefined} />,
                        onClick: () => handleUpdateRequest(value, false),
                        danger: true,
                        disabled: Boolean(valueEnum.status !== 1)
                    },
                ];
                const menuProps = {
                    items,
                };
                return <Box>
                    <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
                        <Button icon={<MoreOutlined rev={undefined} />}></Button>
                    </Dropdown>
                </Box>
            },
        },
    ];
    const drawerDetail = () => {
        return (
            <Drawer
                width={600}
                open={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow && (
                    // <ProDescriptions<RuleListItem>
                    //   column={2}
                    //   title={currentRow?.name}
                    //   request={async () => ({
                    //     data: currentRow || {},
                    //   })}
                    //   params={{
                    //     id: currentRow?.name,
                    //   }}
                    //   columns={columns as ProDescriptionsItemProps<RuleListItem>[]}
                    // />
                    <><span>{currentRow.name}</span>
                        <span>{currentRow.status}</span>
                        <span>{currentRow.name}</span>

                    </>

                )}
            </Drawer>
        )
    }
    const dispatch = useAppDispatch();

    const handleUpdateRequest = async (value: any, IsApproved: boolean) => {
        const title = IsApproved ? 'approve' : 'reject';
        confirm({
            title: `Do you want to ${title} the request?`,
            icon: IsApproved ? <CheckOutlined rev={undefined} /> : <CloseCircleOutlined rev={undefined} />,
            onOk: async () => {
                const ids: number[] = [value?.props?.record.key];
                const params = {
                    ids: ids,
                    IsApproved: IsApproved
                }
                await dispatch(updateRequest(params)).then((result: any) => {
                    if (result.payload.errorCode === 4005) {
                        message.warning('Update request has already been approved!');
                    } else if (result.payload.errorCode === 4006) {
                        message.warning('Update request has already been rejected!');
                    }
                    else if (result.meta.requestStatus === "fulfilled") {
                        message.success('Update request success');
                        fetchRequest();
                        fetchPost();
                    }
                }
                )
            },
            onCancel() {
            },
        });
    }

    const handleSearch = (value: any) => {

    }
    const handleSetStatus = async (value: any) => {
        if (value.radio === 0) {
            setStatusFilter(null)
            setPage(1)
            await dispatch(getRequestByAccountId({ page: 1, PageSize: 10, Sort: 'createAt', Order: 'desc', Id: postId }))
        } else {
            setStatusFilter(value?.radio);
            setPage(1)
            await dispatch(getRequestByAccountId({ page: 1, PageSize: 10, Sort: 'createAt', Order: 'desc', Status: value?.radio, Id: postId }))
        }
    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        await dispatch(getRequestByAccountId({ Id: postId }))
        return {
            data: [],
            success: true,
            total: 10,
        };
    }
    const onPageChange = (value: any) => {
        setPage(value)
    }
    const onChangePageSize = (value: any) => {
        setPageSize(value)
    }
    const rows = requests.data.map(request => ({
        // ...post,
        key: request?.id,
        id: request?.id,
        originalPositionName: request.originalPosition.positionName,
        postCategoryName: request.post.postCategory.postCategoryDescription,
        positionNeedToUpdateName: request.postPositionNeedToBeUpdated.positionName,
        postCode: request.post.postCode,
        status: request.status,
        dateFrom: request.post.dateFrom,
        dateTo: request.post.dateTo,
        attendanceComplete: request.post.attendanceComplete,
        createAt: request.createAt,
        expectedPositionAmount: `${request.originalPosition.positionRegisterAmount}/${request.originalPosition.amount}`,
        currentPositionAmount: `${request.postPositionNeedToBeUpdated.positionRegisterAmount}/${request.postPositionNeedToBeUpdated.amount}`
    }));

    const fetchRequest = async () => {
        await dispatch(getRequestByAccountId({
            page: page,
            PageSize: pageSize,
            Id: postId
        }))
    }
    useEffect(() => {
        fetchRequest()
    }, [page, pageSize, searchParams, sortModel])

    const handler = {
        setCurrentRow,
        setShowDetail,
        setOpenEditPostModal,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleActionChange,
        handleSearch,
        handleSetStatus
    }
    const props = {
        total,
        columns,
        requests,
        rows,
        showDetail,
        currentRow,
        openEditPostModal,
        editPostModalId,
        postInfo,
        postInfoAPI,
        isLoading,
        page,
        pageSize,
        pageSizeOptions,
        postCode
    }
    return {
        handler,
        props,
        drawerDetail,
    }
}
export default useViewRequest
