import { CheckCircleOutlined, EditOutlined, ExclamationCircleFilled, FolderViewOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns } from "@ant-design/pro-components";
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Image, Modal, Popover, Progress, StepsProps, Table, TableColumnsType } from 'antd';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from 'enums/status.enum';
import { confirmEndPost, confirmRunningPost, getPostByAccountId } from "features/postSlice";
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
    registerAmount: number,
    date: Date,
    timeFrom: Date,
    timeTo: Date,
    percent: number,
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
    const { collabs, loading } = useAppSelector(state => state.collab)
    const { registrationList } = useAppSelector(state => state.registration)
    const collabsList = collabs?.data ? collabs?.data : []
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = posts?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [amountUnConfirmed, setAmountUnConfirmed] = useState<number>(0);
    const [registerAmount, setAmountConfirmed] = useState<number>(0);
    const [positionId, setPositionId] = useState<string>('')
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [searchByEmail, setSearchByEmail] = useState<string>('')
    const [status, setStatus] = useState<number>(1)
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
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
            width: 5,
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
            title: 'Positions count',
            dataIndex: 'numberOfPosition',
            key: 'numberOfPosition',
            width: 15,
            hideInSearch: true,
        },
        {
            title: 'Date From',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            width: 30,
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Date To',
            dataIndex: 'dateTo',
            key: 'dateTo',
            width: 30,
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'Description',
            hideInSearch: true,
            width: 20,
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
            width: 20,
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
            width: 20,
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
                        statusText = 'Ending';
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
            width: 10,
            hideInSearch: true,
            dataIndex: 'status',
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
                let disable = false;
                let icon = <EditOutlined rev={undefined} />
                switch (valueEnum?.status) {
                    case Status.opening:
                        color = '#1890ff';

                        icon = <LockOutlined rev={undefined} />;
                        statusText = 'Close';
                        break;

                    case Status.closed:
                        color = green[500];
                        statusText = 'End';
                        icon = <CheckCircleOutlined rev={undefined} />;
                        break;

                    case Status.ended:
                        color = red[500];
                        statusText = 'End';
                        disable = true;
                        break;
                    case Status.canceled:
                        color = yellow[500];
                        statusText = 'End';
                        disable = true;
                        break;
                    case Status.deleted:
                        color = red[500];
                        statusText = 'End';
                        disable = true;
                        break;
                    case Status.reopen:
                        color = green[500];
                        statusText = 'Close';
                        icon = <CheckCircleOutlined rev={undefined} />;
                        disable = false;
                        break;
                    default:
                        break;
                }
                return <Box>
                    {valueEnum?.status === 2 && (<><Button onClick={() => handleReopen(value)} type='default' color={color} style={{ color: color, width: '100px' }} disabled={disable} icon={<UnlockOutlined rev={undefined} />}>Re-open</Button> | </>)}
                    <Button onClick={() => handleAction(value, valueEnum.status)} type='default' color={color} style={{ color: color, width: '100px' }} disabled={disable} icon={icon}>{statusText}</Button>
                </Box>
            },
        },
    ];
    const rowsExpanded: ListPositionI[] = posts.data.map(post => ({
        key: post.postCode,
        position: post.postPositions
    }));

    const expandedRowRender = (record: any) => {
        const columnsExpanded: TableColumnsType<ExpandedDataType> = [
            { title: 'Position Name', dataIndex: 'positionName', key: 'positionName', width: 200 },
            { title: 'Amount', dataIndex: 'amount', key: 'amount' },
            { title: 'Amount Confirmed', dataIndex: 'registerAmount', key: 'registerAmount', width: 200 },
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
                registerAmount: value.registerAmount,
                date: value.date,
                timeFrom: value.timeFrom,
                timeTo: value.timeTo,
                salary: value.salary,
                percent: Number((value.registerAmount * 100 / value.amount).toFixed(1)),
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

    const handleOpenConfirmModal = async (value: any) => {
        setTotalCollab(value?.amount)
        setAmountConfirmed(value?.registerAmount)
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
        console.log('key: ', value)
        const result = await dispatch(confirmRunningPost(value))
    }
    const handleConfirmEndPost = async (value: number) => {
        console.log('key: ', value)
        const result = await dispatch(confirmEndPost(value))
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
                break;
            }
            default:
                break;
        }
    }
    const handleReopen = (value: any) => {

    }

    const handleSubmit = async (value: any) => {
        console.log('list: ', value)
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
        title: post?.postCategory?.postCategoryDescription,
        titleType: post?.postCategory?.postCategoryType,
        isPremium: post?.isPremium,
        description: post?.postDescription,
        location: post?.location,
        status: post?.status,
        dateFrom: moment(post?.dateFrom).format(Formatter),
        dateTo: moment(post?.dateTo).format(Formatter),
        timeFrom: post?.timeFrom,
        timeTo: post?.timeTo,
        postImg: post?.postImg,
        priority: post?.priority,
        numberOfPosition: post.postPositions.length,
        // ...
    }));
    console.log('trainingposition: ', rowsExpanded)

    const fetchPostList = async () => {
        await dispatch(getPostByAccountId({ page: page, PageSize: pageSize }))
    }

    useEffect(() => {
        fetchPostList()
    }, [page, pageSize])


    const handler = {
        setCurrentRow,
        setShowDetail,
        setOpenConfirmModal,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleSubmit,
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
        positionId
    }
    return {
        handler,
        props,
        expandedRowRender
    }
}
export default useViewRegistrationHook;
