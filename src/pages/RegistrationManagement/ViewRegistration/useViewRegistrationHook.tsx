import { CheckCircleOutlined, ExclamationCircleFilled, EyeOutlined, FolderViewOutlined, MoreOutlined, UnlockOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { Badge, Button, Dropdown, Image, MenuProps, Modal, Popover, Progress, StepsProps, Table, TableColumnsType, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from 'enums/status.enum';
import { confirmEndPost, confirmReopenPost, confirmRunningPost, getPostByAccountId } from "features/postSlice";
import { getPostTitle } from 'features/postTitleSlice';
import { getRegistrationByPositionId } from 'features/registrationSlice';
import { ListPositionI } from 'models/post.model';
import moment from "moment";
import { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser';


interface ExpandedDataType {
    id: number,
    postId: number,
    positionName: string,
    amount: number,
    salary: number,
    positionRegisterAmount: number,
    date: Date,
    timeFrom: Date,
    timeTo: Date,
    percent: number,
}
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
function useViewRegistrationHook() {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const { posts, isDeleted } = useAppSelector(state => state.post);
    const postInfoAPI = useAppSelector(state => state.post.postInfo);
    const isLoading = useAppSelector(state => state.post.loading);
    const { collabs, loading } = useAppSelector(state => state.collab);
    const { registrationList } = useAppSelector(state => state.registration);
    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption);
    const valueEnum: { [key: number]: { text: string } } = {};
    postTitleOptionsAPI.forEach((option) => {
        valueEnum[option.id] = { text: option.postCategoryDescription };
    });
    const collabsList = collabs?.data ? collabs?.data : [];
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<number | null>();
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = posts?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [amountUnConfirmed, setAmountUnConfirmed] = useState<number>(0);
    const [registerAmount, setAmountConfirmed] = useState<number>(0);
    const [positionId, setPositionId] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [searchByEmail, setSearchByEmail] = useState<string>('');
    const [status, setStatus] = useState<number>(1);
    const [postId, setPostId] = useState<number | null>(null);
    const [openViewRequestModal, setOpenViewRequestModal] = useState<boolean>(false);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>();

    const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
        <Popover
            content={
                <span>
                    step {index} status: {status}
                </span>
            }
        >
            {dot}
        </Popover>
    );

    const columns: ProColumns[] = [
        {
            title: 'Post Code',
            dataIndex: 'postCode',
            key: 'postCode',
            render: (dom, entity) => {
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        onClick={() => {
                            console.log('dom', dom)
                            console.log('entity', entity)
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
            dataIndex: 'postCategoryId',
            valueType: 'select',
            key: 'postCategoryId',
            valueEnum: valueEnum
        },
        {
            title: 'Positions count',
            dataIndex: 'numberOfPosition',
            key: 'numberOfPosition',
            hideInSearch: true,
        },
        {
            title: 'Create at',
            dataIndex: 'createAt',
            key: 'createAt',
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Date From',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            valueType: 'date',
            sorter: true,
        },
        {
            title: 'Date To',
            dataIndex: 'dateTo',
            key: 'dateTo',
            sorter: true,
            valueType: 'date',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
            hideInSearch: true,
            render: (value) => {

                if (value !== '') {
                    return (ReactHtmlParser(String(value)));
                }
                return <span></span>;

            },
            hideInTable: true,
        },
        {
            title: 'Post Image',
            dataIndex: 'postImg',
            key: 'postImg',
            render: (value) => {
                return (<Image src={String(value)}></Image>);
            },
            hideInTable: true,
            hideInSearch: true
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            valueEnum: {
                1: {
                    text: 'Pending',
                    status: 'Pending',
                },
                2: {
                    text: 'Closed',
                    status: 'Closed',
                },
                3: {
                    text: 'Ending',
                    status: 'Success',
                },
                4: {
                    text: 'Canceled',
                    status: 'Canceled',
                },
                5: {
                    text: 'Deleted',
                    status: 'Deleted',
                },
                6: {
                    text: 'Re-open',
                    status: 'Re-open',
                },
            },
            render: (value, valueEnum) => {
                let color = grey[400].toString();
                let statusText = 'Unknown';
                switch (valueEnum?.status) {
                    case Status.opening:
                        color = '#1890ff';
                        statusText = 'Opening';
                        break;

                    case Status.closed:
                        color = green[500];
                        statusText = 'Closed';
                        break;

                    case Status.ended:
                        color = red[500];
                        statusText = 'Ended';
                        break;
                    case Status.canceled:
                        color = yellow[500];
                        statusText = 'Re-open';
                        break;
                    case Status.deleted:
                        color = red[500];
                        statusText = 'Deleted';
                        break;
                    case Status.reopen:
                        color = green[500];
                        statusText = 'Re-open';
                        break;
                    default:
                        break;
                }
                return <Box display="flex" alignItems="center">
                    <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
                    <Typography variant="subtitle1" color={color}>
                        {statusText}
                    </Typography>
                </Box>
            },
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            hideInSearch: true,
            dataIndex: ['status', 'totalUpdateRegisterAmount'],
            valueEnum: {
                1: {
                    text: 'Pending',
                    status: 'Pending',
                },
                2: {
                    text: 'Closed',
                    status: 'Closed',
                },
                3: {
                    text: 'Ending',
                    status: 'Success',
                },
                4: {
                    text: 'Canceled',
                    status: 'Canceled',
                },
                5: {
                    text: 'Deleted',
                    status: 'Deleted',
                },
                6: {
                    text: 'Re-open',
                    status: 'Re-open',
                },
            },
            render: (value, valueEnum, record) => {
                const totalUpdateRegisterAmount = valueEnum?.totalUpdateRegisterAmount; // Access totalUpdateRegisterAmount from record
                const items: MenuProps['items'] = [
                    {
                        label: 'Close',
                        key: '1',
                        icon: <CheckCircleOutlined rev={undefined} />,
                        onClick: () => handleAction(value, valueEnum.status),
                        disabled: Boolean(valueEnum?.status === 2 || valueEnum?.status === 3)
                    },
                    {
                        label: 'Re-open',
                        key: '2',
                        icon: <UnlockOutlined rev={undefined} />,
                        onClick: () => handleReopen(value),
                        disabled: Boolean(valueEnum?.status === 1 || valueEnum?.status === 3 || valueEnum?.status === 6),
                    },
                    {
                        label: 'End',
                        key: '3',
                        icon: <CheckCircleOutlined rev={undefined} />,
                        onClick: () => handleAction(value, valueEnum.status),
                        disabled: Boolean(valueEnum?.status === 1 || valueEnum?.status === 6),
                        danger: true
                    },
                    {
                        label: 'View request',
                        key: '4',
                        icon: <EyeOutlined rev={undefined} />,
                        itemIcon: <Badge count={totalUpdateRegisterAmount} />,
                        onClick: () => handleOpenViewRequestModal(value),
                        disabled: Boolean(totalUpdateRegisterAmount === 0)
                    },
                ];
                const menuProps = {
                    items,
                };
                return <Badge count={totalUpdateRegisterAmount}><Box>
                    <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
                        <Button icon={<MoreOutlined rev={undefined} />}></Button>
                    </Dropdown>
                </Box>
                </Badge>
            },
        },
        // {
        //     title: 'Request',
        //     width: 100,
        //     align: 'center',
        //     hideInSearch: true,
        //     dataIndex: 'totalUpdateRegisterAmount',
        //     render: (value) => {
        //         const items: MenuProps['items'] = [
        //             {
        //                 label: 'View request',
        //                 key: '1',
        //                 icon: <EyeOutlined rev={undefined} />,
        //                 // onClick: () => handleAction(value, valueEnum.status),
        //             },
        //         ];
        //         const menuProps = {
        //             items,
        //         };
        //         return <Badge count={5}>
        //             <Box>
        //                 <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
        //                     <Button icon={<MoreOutlined rev={undefined} />}></Button>
        //                 </Dropdown>
        //             </Box>
        //         </Badge>
        //     },
        // },
    ];
    const rowsExpanded: ListPositionI[] = posts.data.map(post => ({
        key: post.postCode,
        position: post.postPositions
    }));

    const expandedRowRender = (record: any) => {
        const columnsExpanded: TableColumnsType<ExpandedDataType> = [
            { title: 'Position Name', dataIndex: 'positionName', key: 'positionName', width: 200 },
            { title: 'Amount', dataIndex: 'amount', key: 'amount' },
            { title: 'Amount Confirmed', dataIndex: 'positionRegisterAmount', key: 'positionRegisterAmount', width: 200 },
            {
                title: 'Progress', dataIndex: 'percent', render: (value) => <Progress style={{ maxWidth: '90%' }} percent={Number(value)} size="small" />, width: 200
            },
            { title: 'Date', dataIndex: 'date', key: 'date', render: (value) => <span>{moment(value).format(Formatter)}</span>, width: 200 },
            { title: 'Time From', dataIndex: 'timeFrom', key: 'timeFrom', width: 200 },
            { title: 'Time To', dataIndex: 'timeTo', key: 'timeTo', width: 200 },
            { title: 'Salary', dataIndex: 'salary', key: 'salary', width: 200 },
            {
                title: 'Action',
                key: 'action',
                width: 200,
                render: (value) => <Button icon={<FolderViewOutlined rev={undefined} />} onClick={() => handleOpenConfirmModal(value)} color="primary">View registration</Button>,
            }
        ];
        const data = rowsExpanded.find((value) => value.key === record?.id);
        const dataCustom = data?.position.map((value) => {
            return {
                postId: value.postId,
                id: value.id,
                positionName: value.positionName,
                amount: value.amount,
                positionRegisterAmount: value.positionRegisterAmount,
                date: value.date,
                timeFrom: value.timeFrom,
                timeTo: value.timeTo,
                salary: value.salary,
                percent: Number((value.positionRegisterAmount * 100 / value.amount).toFixed(1)),
            }
        })
        return <Table
            columns={columnsExpanded}
            dataSource={dataCustom}
            pagination={false}
        />;
    };
    const dispatch = useAppDispatch();
    const { confirm } = Modal;
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
    };
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        message.info('Click on left button.');
        console.log('click left button', e);
    };
    const handleOpenConfirmModal = async (value: any) => {
        setTotalCollab(value?.amount)
        setAmountConfirmed(value?.positionRegisterAmount)
        setPositionId(value.id)
        const result = await dispatch(getRegistrationByPositionId(
            {
                positionId: value.id,
                Status: 1
            }))
        unwrapResult(result)
        if (getRegistrationByPositionId.fulfilled.match(result)) {
            console.log('result', result.payload.data);  // Access the 'data' property
            console.log('setAmountUnConfirmed', result.payload.data.length);  // Access the 'data' property
            setAmountUnConfirmed(result.payload.data.length)
            setOpenConfirmModal(true)
        }
    }
    const handleConfirmRunningPost = async (value: number) => {
        const result = await dispatch(confirmRunningPost(value)).then((response: any) => {
            if (response?.payload?.errorCode === 4008) {
                message.error(response?.payload?.message)
            } else if (response?.payload?.status === 200) {
                message.success('Close post success!');
                fetchPostList();
            }
        }).catch((error) => {
            message.error(error);
        })
    }
    const handleConfirmEndPost = async (value: number) => {
        const result = await dispatch(confirmEndPost(value)).then((response: any) => {
            if (response?.payload?.errorCode === 4043) {
                message.warning(response?.payload?.message)
            } else if (response?.payload?.statusCode === 200) {
                message.success('Confirm end post success!');
                fetchPostList();
            }
        }).catch((error) => {
            message.error(error);
        })
    }
    const handleConfirmReopenPost = async (value: number) => {
        const result = await dispatch(confirmReopenPost(value)).then((response: any) => {
            if (response?.payload?.errorCode === 4008) {
                message.error(response?.payload?.message)
            } else if (response?.payload?.status === 200) {
                message.success('Reopen post success!');
                fetchPostList();
            }
        }).catch((error) => {
            message.error(error);
        })
    }
    const handleOpenViewRequestModal = (value: any) => {
        setPostId(value?.props.record?.key)
        setOpenViewRequestModal(true);
    }
    const handleAction = (value: any, status: number) => {
        console.log('value: ', value.props.record);
        console.log('status', status)
        switch (status) {
            case Status.opening: {
                confirm({
                    title: 'Do you want to close the post?',
                    icon: <ExclamationCircleFilled rev={undefined} />,
                    onOk() {
                        handleConfirmRunningPost(Number(value?.props.record.key))
                    },
                    onCancel() {
                    },
                });
                break;
            }
            case Status.closed: {
                confirm({
                    title: 'Do you want to end the post?',
                    icon: <ExclamationCircleFilled rev={undefined} />,
                    onOk() {
                        handleConfirmEndPost(Number(value?.props.record.key))
                    },
                    onCancel() {
                    },
                });
                break;
            }
            case Status.reopen: {
                console.log('status: ', status);
                confirm({
                    title: 'Do you want to end the post?',
                    icon: <ExclamationCircleFilled rev={undefined} />,
                    onOk() {
                        handleConfirmRunningPost(Number(value?.props.record.key))
                    },
                    onCancel() {
                    },
                });
                break;
            }
            default:
                break;
        }
    }
    const handleReopen = (value: any) => {
        confirm({
            title: 'Do you want to re-open the post?',
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk() {
                handleConfirmReopenPost(Number(value?.props.record.key))
            },
            onCancel() {
            },
        });
    }

    const handleSubmit = async (value: any) => {
        console.log('list: ', value)
    }
    const handleSetStatus = async (value: any) => {
        console.log('value: ', value);
        if (value.radio === 0) {
            setStatusFilter(null)
            setPage(1)
            await dispatch(getPostByAccountId({ page: 1, PageSize: 10, Sort: 'createAt', Order: 'desc' }))
        } else {
            setStatusFilter(value?.radio);
            setPage(1)
            await dispatch(getPostByAccountId({ page: 1, PageSize: 10, Status: value?.radio }))
        }
    }
    const handleSearch = async (value: any) => {
        if (value) {
            setSearchParams(value)
            await dispatch(getPostByAccountId({
                page: page,
                PageSize: pageSize,
                Status: statusFilter,
                Sort: sortModel?.Sort,
                Order: sortModel?.Order,
                dateFrom: value?.dateFrom,
                dateTo: value?.dateTo,
                postCode: value?.postCode,
                postName: value?.postName,
                postCategoryId: value?.postCategoryId
            }))
        }
    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        if (sorter && Object.keys(sorter).length > 0) {
            const keys = Object.keys(sorter);
            const fieldName = keys[0];
            console.log('sorter[fieldName]: ', sorter[fieldName])
            const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';
            console.log('sorter: ', sortOrder)

            setSortModel({ Sort: fieldName, Order: String(sortOrder) })
        } else setSortModel({ Sort: 'createAt', Order: 'desc' })

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
        console.log('pagesize: ', value)
        setPageSize(value)
    }

    const rows = posts.data.map(post => ({
        key: post?.id,
        id: post?.postCode,
        postCode: post?.postCode,
        postCategoryId: post?.postCategory?.postCategoryDescription,
        titleType: post?.postCategory?.postCategoryType,
        isPremium: post?.isPremium,
        description: post?.postDescription,
        location: post?.location,
        status: post?.status,
        dateFrom: post?.dateFrom,
        dateTo: post?.dateTo,
        timeFrom: post?.timeFrom,
        timeTo: post?.timeTo,
        postImg: post?.postImg,
        priority: post?.priority,
        numberOfPosition: post?.postPositions.length,
        createAt: post?.createAt,
        totalUpdateRegisterAmount: post?.totalUpdateRegisterAmount
        // ...
    }));

    const fetchPostList = async () => {
        await dispatch(getPostByAccountId({
            page: page,
            PageSize: pageSize,
            Status: statusFilter,
            Sort: sortModel?.Sort,
            Order: sortModel?.Order,
            dateFrom: searchParams?.dateFrom,
            dateTo: searchParams?.dateTo,
            postCode: searchParams?.postCode,
            postName: searchParams?.postName,
            postCategoryId: searchParams?.postCategoryId
        }))
    }

    const fetchPostTitleOption = async () => {
        await dispatch(getPostTitle());
    }

    useEffect(() => {
        fetchPostTitleOption()
    }, [])

    useEffect(() => {
        fetchPostList()
    }, [page, pageSize, sortModel])


    const handler = {
        setCurrentRow,
        setShowDetail,
        setOpenConfirmModal,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleSubmit,
        setStatusFilter,
        handleSetStatus,
        handleActionChange,
        handleSearch,
        setOpenViewRequestModal
    }
    const props = {
        openConFirmModal,
        total,
        columns,
        posts,
        loading,
        rows,
        showDetail,
        rowsExpanded,
        postInfo,
        postInfoAPI,
        isLoading,
        page,
        pageSize,
        pageSizeOptions,
        totalCollab,
        collabs,
        collabsList,
        registrationList,
        registerAmount,
        amountUnConfirmed,
        positionId,
        openViewRequestModal,
        postId
    }
    return {
        handler,
        props,
        expandedRowRender
    }
}
export default useViewRegistrationHook;
