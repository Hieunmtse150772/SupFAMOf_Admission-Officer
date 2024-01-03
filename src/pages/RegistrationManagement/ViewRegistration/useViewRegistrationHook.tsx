import { CheckCircleOutlined, CheckOutlined, DownOutlined, ExclamationCircleFilled, EyeOutlined, FolderViewOutlined, LockOutlined, MoreOutlined, OrderedListOutlined, UnlockOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { Badge, Button, Dropdown, Image, MenuProps, Modal, Popover, Space, StepsProps, Table, TableColumnsType, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from 'enums/status.enum';
import { getCertificate } from 'features/certificateSlice';
import { getDocument } from 'features/documentSlice';
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
    trainingCertificateId: number;
    positionName: string,
    documentId: number;
    isBusService: boolean;
    latitude: string;
    date: Date;
    longtitude: string;
    timeFrom: Date;
    timeTo: Date;
    positionRegisterAmount: number;
    totalPositionRegisterAmount: number,
    amount: number,
    salary: number,
    status: number,
    schoolName: string,
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
    postCategoryId?: number,
    createAt?: Date
}
function useViewRegistrationHook() {
    const Formatter = 'YYYY-MM-DD'
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
    const certificateList = useAppSelector(state => state.certificate.certificateOption);
    const documentList = useAppSelector(state => state.document.documentOption);
    const [postId, setPostId] = useState<number | null>(null);
    const [postCode, setPostCode] = useState<string>('');
    const [openViewRequestModal, setOpenViewRequestModal] = useState<boolean>(false);
    const [openViewAttendenceModal, setOpenViewAttendenceModal] = useState<boolean>(false);
    const [openViewWorkListModal, setOpenViewWorkList] = useState<boolean>(false);


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
            fixed: 'left',

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
            width: 100,
        },
        {
            title: 'Category',
            dataIndex: 'postCategoryId',
            valueType: 'select',
            key: 'postCategoryId',
            valueEnum: valueEnum,
            width: 125,
        },
        {
            title: 'Number of positions',
            dataIndex: 'numberOfPosition',
            key: 'numberOfPosition',
            hideInSearch: true,
            width: 120,
            align: 'center'
        },
        {
            title: 'Create at',
            dataIndex: 'createAt',
            key: 'createAt',
            valueType: 'date',
            sorter: true,
            width: 100,
        },
        {
            title: 'Date From',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            valueType: 'date',
            sorter: true,
            width: 100,
        },
        {
            title: 'Date To',
            dataIndex: 'dateTo',
            key: 'dateTo',
            sorter: true,
            valueType: 'date',
            width: 100,

        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
            width: 100,
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
            width: 100,
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
            width: 120,
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
            width: 80,
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
            fixed: 'right',
            render: (value, valueEnum, record) => {
                const totalUpdateRegisterAmount = valueEnum?.totalUpdateRegisterAmount; // Access totalUpdateRegisterAmount from record
                const items: MenuProps['items'] = [
                    {
                        label: 'Close',
                        key: '1',
                        icon: <LockOutlined rev={undefined} />,
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
                        disabled: Boolean(valueEnum?.status === 1 || valueEnum?.status === 6 || valueEnum?.status === 3),
                        danger: true
                    },
                    {
                        label: 'View request',
                        key: '4',
                        icon: <EyeOutlined rev={undefined} />,
                        itemIcon: <Badge count={totalUpdateRegisterAmount} />,
                        onClick: () => handleOpenViewRequestModal(value),
                    },
                ];
                const menuProps = {
                    items,
                };
                return <Badge count={totalUpdateRegisterAmount}><Box>
                    <Dropdown disabled={Boolean(valueEnum.status === 5)} menu={menuProps} trigger={['click']} placement='bottomLeft'>
                        <Button disabled={Boolean(valueEnum.status === 5)} icon={<MoreOutlined rev={undefined} />}></Button>
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
            { title: 'Position name', dataIndex: 'positionName', key: 'positionName', width: 200 },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'center', width: 50 },
            { title: 'Confirmed', dataIndex: 'positionRegisterAmount', key: 'positionRegisterAmount', align: 'center', width: 100 },
            // {
            //     title: 'Progress', dataIndex: 'percent', render: (value) => <Progress style={{ maxWidth: '90%' }} percent={Number(value)} size="small" />, width: 100
            // },
            { title: 'Date', dataIndex: 'date', key: 'date', render: (value) => <span>{moment(value).format(Formatter)}</span>, width: 100 },
            { title: 'Time From', dataIndex: 'timeFrom', key: 'timeFrom', width: 120 },
            { title: 'Time To', dataIndex: 'timeTo', key: 'timeTo', width: 120 },
            {
                title: 'Salary', dataIndex: 'salary', key: 'salary', render: (value, valueEnum) => <span>{Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
                }).format(valueEnum.salary)}</span>
                , width: 100
            },
            {
                title: 'Status', dataIndex: 'status', key: 'status', render: (rows) => {
                    return rows === 1 ? (
                        <Space size={0}>
                            <Tag color="blue">Active</Tag>
                        </Space>
                    ) : (
                        <Space size={0}>
                            <Tag color="red">Deleted</Tag>
                        </Space>
                    );
                },
                width: 80
            },
            {
                title: 'Action',
                align: 'center',
                fixed: 'right',
                render: (value, valueEnum) => {
                    const totalRegistration = valueEnum.totalPositionRegisterAmount
                    console.log('totalRegistration: ', totalRegistration)
                    const items: MenuProps['items'] = [
                        {
                            label: 'Registration',
                            key: '1',
                            icon: <FolderViewOutlined rev={undefined} />,
                            itemIcon: <Badge count={totalRegistration} />,
                            onClick: () => handleOpenConfirmModal(valueEnum),
                        },
                        {
                            label: 'Attendance',
                            key: '2',
                            icon: <CheckOutlined color='green' rev={undefined} />,
                            onClick: () => handleOpenCheckAttendence(valueEnum),
                        },
                        {
                            label: 'Worklist',
                            key: '3',
                            icon: <OrderedListOutlined color='green' rev={undefined} />,
                            onClick: () => handleViewWorkList(valueEnum),
                        },
                    ];
                    const menuProps = {
                        items,
                    };
                    return <Badge count={totalRegistration}>
                        <Box>
                            <Dropdown disabled={Boolean(valueEnum.status === 2)} menu={menuProps} trigger={['click']} placement='bottomLeft'>
                                <Button icon={<DownOutlined rev={undefined} />}></Button>
                            </Dropdown>
                        </Box>
                    </Badge>
                },
                width: 80
            },
            // {
            //     title: 'Action',
            //     key: 'action',
            //     width: 200,
            //     render: (value) => <Button icon={<FolderViewOutlined rev={undefined} />} onClick={() => handleOpenConfirmModal(value)} color="primary">View registration</Button>,
            // },
            // {
            //     title: 'Attendence',
            //     key: 'action',
            //     width: 200,
            //     render: (value) => <Button icon={<FolderViewOutlined rev={undefined} />} onClick={() => handleOpenCheckAttendence(value)} color="primary">View attendence</Button>,
            // }
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
                totalPositionRegisterAmount: value.totalPositionRegisterAmount
            }
        })
        return <Table
            columns={columnsExpanded}
            dataSource={data?.position}
            pagination={false}
        />;
    };
    const dispatch = useAppDispatch();
    const { confirm } = Modal;
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('Click on menu item.');
    };
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        message.info('Click on left button.');
    };
    const handleOpenCheckAttendence = async (value: any) => {
        setPositionId(value.id);
        setOpenViewAttendenceModal(true);
    }
    const handleViewWorkList = async (value: any) => {
        setPositionId(value.id);
        setOpenViewWorkList(true);
    }
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
        setPostCode(value?.props.record?.postCode)
        setOpenViewRequestModal(true);
    }
    const handleAction = (value: any, status: number) => {
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
    }
    const handleSetStatus = async (value: any) => {
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
    const handleSearch = async (value: SearchParamsI) => {
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
                postCategoryId: value?.postCategoryId,
                createAt: value?.createAt
            })).catch((error) => {
                console.log("Error in getting the data", error)
            })
        }
    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        if (sorter && Object.keys(sorter).length > 0) {
            const keys = Object.keys(sorter);
            const fieldName = keys[0];
            const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';

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
        setPageSize(value)
    }

    const rows = posts.data.map((post, index) => ({
        count: index,
        key: post?.id,
        id: post?.postCode,
        postCode: post?.postCode,
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
        position: post?.postPositions,
        numberOfPosition: post?.postPositions.length,
        createAt: post?.createAt,
        totalUpdateRegisterAmount: post?.totalUpdateRegisterAmount,
        postCategoryId: post?.postCategory?.postCategoryDescription,

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
            postCategoryId: searchParams?.postCategoryId,
            createAt: searchParams?.createAt
        })).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }

    const fetchPostTitleOption = async () => {
        await dispatch(getPostTitle());
    }
    const fetchCertificateOption = async () => {
        await dispatch(getCertificate());
    }
    const fetchDocumentOption = async () => {
        await dispatch(getDocument());
    }
    useEffect(() => {
        const fetch = async () => {
            await fetchPostTitleOption();
            await fetchCertificateOption();
            await fetchDocumentOption();
        }
        fetch();
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
        setOpenViewRequestModal,
        fetchPostList,
        setOpenViewAttendenceModal,
        setOpenViewWorkList
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
        postId,
        openViewAttendenceModal,
        currentRow,
        certificateList,
        documentList,
        openViewWorkListModal,
        postCode
    }
    return {
        handler,
        props,
        expandedRowRender
    }
}
export default useViewRegistrationHook;
