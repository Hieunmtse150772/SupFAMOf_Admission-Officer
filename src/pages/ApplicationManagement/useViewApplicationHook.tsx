import { CheckOutlined, CloseCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { Button, Dropdown, MenuProps, Modal } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getApplicationList } from "features/applicationSlice";
import moment from "moment";
import { useEffect, useState } from "react";
function useViewApplicationHook() {
    const { applications, loading } = useAppSelector(state => state.application)

    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [5, 10, 15]; // Các tùy chọn cho pageSize
    const total = applications?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [applicationId, setApplicationId] = useState<number>();
    const [isApprove, setIsApprove] = useState<boolean>();
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption)
    const [openReplyApplicationModal, setOpenReplyApplicationModal] = useState<boolean>(false)
    const { confirm } = Modal;
    const columns: ProColumns[] = [
        {
            dataIndex: 'count',
            key: 'count',
            valueType: 'index',
            hideInSearch: true
        },
        {
            title: 'Full name',
            dataIndex: 'name',
            key: 'name',
            render: (dom, entity) => {
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        onClick={() => {
                            console.log('dom', dom)
                            console.log('entity', entity)
                            setCurrentRow(entity);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
            width: 200
        },
        {
            title: 'Report date',
            dataIndex: 'reportDate',
            key: 'reportDate',
            valueType: 'date',
            width: 100,
            hideInSearch: true,
        },
        {
            title: 'Problem note',
            dataIndex: 'problemNote',
            key: 'problemNote',
            hideInSearch: true,
            render: (value) => {
                if (value !== null) {
                    return <p>{value}</p>
                } else { return <p></p> }
            }
        },
        {
            title: 'Reply date',
            dataIndex: 'replyDate',
            key: 'replyDate',
            valueType: 'date',
            width: 100,
            hideInSearch: true,
            render: (value, valueEnum) => {
                if (valueEnum.replyDate) {
                    return <p>{moment(valueEnum.replyDate).format('YYYY-MM-DD')}</p>
                } else { return <p style={{ fontStyle: 'italic' }}>Not yet...</p> }
            }
        },
        {
            title: 'Reply note',
            dataIndex: 'replyNote',
            key: 'replyNote',
            hideInSearch: true,
            render: (value, valueEnum) => {
                if (valueEnum.replyNote) {
                    return <p>{valueEnum.replyNote}</p>
                } else { return <p style={{ fontStyle: 'italic' }}>Haven't replied yet...</p> }
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
                let color = grey[400].toString();
                let statusText = 'Unknown';
                switch (valueEnum?.status) {
                    case 1:
                        color = '#1890ff';
                        statusText = 'Pending';
                        break;

                    case 2:
                        color = green[500];
                        statusText = 'Approved';
                        break;

                    case 3:
                        color = red[500];
                        statusText = 'Rejected';
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
            align: 'center',
            width: 10,
            dataIndex: 'status',
            hideInSearch: true,
            render: (value, valueEnum) => {
                const items: MenuProps['items'] = [
                    {
                        label: 'Approve',
                        key: '1',
                        icon: <CheckOutlined color='green' rev={undefined} />,
                        onClick: () => handleOpenReplyApplicationModal(valueEnum.key, true),
                        disabled: Boolean(valueEnum.status !== 1)
                    },
                    {
                        label: 'Reject',
                        key: '2',
                        icon: <CloseCircleOutlined rev={undefined} />,
                        onClick: () => handleOpenReplyApplicationModal(valueEnum.key, false),
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
    const dispatch = useAppDispatch();
    const onPageChange = (value: any) => {
        setPage(value)
    }
    const onChangePageSize = (value: any) => {
        console.log('pagesize: ', value)
        setPageSize(value)
    }
    const handleSearch = () => {

    }
    const handleOpenReplyApplicationModal = (value: number, status: boolean) => {
        console.log('value: ', value)
        console.log('value: ', value)
        setApplicationId(value);
        setOpenReplyApplicationModal(true);
        setIsApprove(status);
    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        console.log('sorter: ', params);
        fetchApplicationList();
        return {
            data: [],
            success: true, // Set to true if the request was successful
            total: 10, // Total number of data items (if available)
        };
    }
    const rows = applications?.data.map((application, index) => ({
        count: index,
        key: application?.id,
        reportDate: application.reportDate,
        replyDate: application.replyDate,
        status: application.status,
        name: application.account.name,
        idStudent: application.account.accountInformation.idStudent,
        problemNote: application.problemNote,
        replyNote: application.replyNote,
        // ...
    }));
    console.log('rows: ', rows)
    const fetchApplicationList = async () => {
        await dispatch(getApplicationList({ page: page, PageSize: pageSize }))
    }

    useEffect(() => {
        fetchApplicationList()
    }, [page, pageSize])

    const handler = {
        handleSearch,
        handleActionChange,
        pageSizeOptions,
        onPageChange,
        onChangePageSize,
        setOpenReplyApplicationModal,
        fetchApplicationList
    }
    const props = {
        applications,
        total,
        page,
        pageSize,
        rows,
        columns,
        loading,
        pageSizeOptions,
        isApprove,
        openReplyApplicationModal,
        applicationId
    }
    return { handler, props }
}
export default useViewApplicationHook;
