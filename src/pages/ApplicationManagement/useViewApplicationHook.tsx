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
import useSessionTimeOut from "utils/useSessionTimeOut";
type SortModalI = {
    Sort: string,
    Order: string
}
type SearchParamsI = {
    reportDate?: Date,
    replyDate?: Date
}
function useViewApplicationHook() {
    const { applications, loading } = useAppSelector(state => state.application)
    const { SessionTimeOut } = useSessionTimeOut();
    const Formatter = 'YYYY-MM-DD'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [5, 10, 15]; // Các tùy chọn cho pageSize
    const total = applications?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [applicationId, setApplicationId] = useState<number>();
    const [isApprove, setIsApprove] = useState<boolean>();
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption);
    const [openReplyApplicationModal, setOpenReplyApplicationModal] = useState<boolean>(false);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'ReportDate',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()

    const { confirm } = Modal;
    const columns: ProColumns[] = [
        {
            dataIndex: 'count',
            key: 'count',
            valueType: 'index',
            hideInSearch: true,
            width: 20
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
            hideInSearch: true,
            width: 250
        },
        {
            title: 'Report date',
            dataIndex: 'reportDate',
            key: 'reportDate',
            valueType: 'date',
            width: 120,
            sorter: true,
        },
        {
            title: 'Problem note',
            dataIndex: 'problemNote',
            key: 'problemNote',
            width: 300,
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
            sorter: true,
            valueType: 'date',
            width: 120,
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
            },
            width: 300,
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
            width: 100,
        },
        {
            title: 'Action',
            align: 'center',
            width: 50,
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
    const handleSearch = async (value: SearchParamsI) => {
        if (value) {
            setSearchParams(value)
            await dispatch(getApplicationList({
                page: page,
                PageSize: pageSize,
                Sort: sortModel?.Sort,
                Order: sortModel?.Order,
                ReportDate: value?.reportDate,
                ReplyDate: value?.replyDate
            })).then((response: any) => {
                if (response?.payload?.statusCode === 401) {
                    SessionTimeOut();
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })
        }
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
        if (sorter && Object.keys(sorter).length > 0) {
            const keys = Object.keys(sorter);
            const fieldName = keys[0];
            const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';

            setSortModel({ Sort: fieldName, Order: String(sortOrder) });
        } else {
            setSortModel({ Sort: 'ReportDate', Order: 'desc' })
        }
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
    const fetchApplicationList = async () => {
        await dispatch(getApplicationList({
            page: page,
            PageSize: pageSize,
            Sort: sortModel.Sort,
            Order: sortModel.Order,
            ReportDate: searchParams?.reportDate,
            ReplyDate: searchParams?.replyDate
        })).then((response: any) => {
            if (response?.payload?.statusCode === 401) {
                SessionTimeOut();
            }
        }).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }
    useEffect(() => {
        fetchApplicationList()
    }, [page, pageSize, sortModel])

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
