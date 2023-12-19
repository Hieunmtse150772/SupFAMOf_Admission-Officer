import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { Avatar, Modal, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import StatusPostRegistration from "enums/statusPostRegistration.enum";
import { confirmAttendanceByPositionId, getWorkListsByPositionId, paramsConfirmAttendance } from 'features/attendenceSlice';
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
function useViewAttendanceHook(positionId: string, fetchPost: () => void) {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const { workLists, loading } = useAppSelector(state => state.attendence)
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const [editPostModalId, setEditPostModalId] = useState<string>('');
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()

    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = workLists?.metadata?.total
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let navigate = useNavigate();

    const columns: ProColumns[] = [
        {
            title: 'Number',
            dataIndex: 'count',
            key: 'count',
            hideInSearch: true,
            width: 50,
            valueType: 'index'
        },
        {
            title: 'Avatar',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            width: 50,
            hideInSearch: true,
            render: (dom, entity) => {
                return (
                    <Avatar
                        onClick={() => {
                            console.log('dom', dom)
                            console.log('entity', entity)
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                        src={dom}
                        style={{ width: 50, height: 50 }} />
                );
            },
        },

        {
            title: 'Full name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
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
            title: 'Phone number',
            dataIndex: 'phone',
            key: 'phone',
            hideInSearch: true,
            width: 100
        },
        {
            title: 'Bus Option',
            dataIndex: 'isBusService',
            key: 'isBusService', render: (value) => {
                return value ? <span>Yes</span> : <span>No</span>
            },
            width: 100
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            hideInSearch: true,
            width: 100,
            render: (value, valueEnum) => {
                let color = grey[400].toString();
                let statusText = 'Unknown';
                switch (valueEnum?.status) {
                    case StatusPostRegistration.Pending:
                        color = '#1890ff';
                        statusText = 'Pending';
                        break;

                    case StatusPostRegistration.Confirmed:
                        color = green[500];
                        statusText = 'Confirmed';
                        break;
                    case StatusPostRegistration.Cancel:
                        color = red[500];
                        statusText = 'Cancel';
                        break;
                    case StatusPostRegistration.CheckIn:
                        color = green[500];
                        statusText = 'CheckIn';
                        break;
                    case StatusPostRegistration.Checkout:
                        color = green[500];
                        statusText = 'Checkout';
                        break;

                    case StatusPostRegistration.Rejected:
                        color = red[500];
                        statusText = 'Rejected';
                        break;
                    case StatusPostRegistration.Quit:
                        color = red[500];
                        statusText = 'Quit';
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
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     valueEnum: {
        //         1: {
        //             text: 'Pending',
        //             status: 'Pending',
        //         },
        //         2: {
        //             text: 'Attended',
        //             status: 'Attended',
        //         },
        //         3: {
        //             text: 'Absent',
        //             status: 'Absent',
        //         },
        //     },
        //     render: (value, valueEnum) => {
        //         let color = grey[400].toString();
        //         let statusText = 'Unknown';
        //         switch (valueEnum?.status) {
        //             case Status.pending:
        //                 color = '#1890ff';
        //                 statusText = 'Pending';
        //                 break;

        //             case Status.approved:
        //                 color = green[500];
        //                 statusText = 'Attended';
        //                 break;

        //             case Status.rejected:
        //                 color = red[500];
        //                 statusText = 'Absent';
        //                 break;
        //             default:
        //                 break;
        //         }
        //         return <Box display="flex" alignItems="center">
        //             <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
        //             <Typography variant="subtitle1" color={color}>
        //                 {statusText}
        //             </Typography>
        //         </Box>
        //     },
        // },
    ];
    const dispatch = useAppDispatch();

    const handleSearch = (value: any) => {

    }

    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
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

    const checkAttendanceData = workLists.data.map((attendence, index) => ({
        id: attendence?.id,
        status: attendence?.status
    }))
    const handleChangeStatus = (id: number, status: number, value: boolean) => {
        checkAttendanceData.map((attendance) => {
            if (attendance.id === id) {
                attendance.status = value ? 2 : 1
            }
            return attendance;
        })
    }
    const handleConfirmCheckAttendance = async (value: any) => {
        const params: paramsConfirmAttendance = {
            data: checkAttendanceData,
            positionId: positionId
        }
        dispatch(confirmAttendanceByPositionId(params)).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Confirm attendance success');
            } else if (response?.payload?.statusCode === 400) {
                message.error(response?.payload?.message);
            }
        })
    }

    const rows = workLists.data.map((collab, index) => ({
        count: index,
        key: collab?.id,
        id: collab?.id,
        name: collab?.account?.name,
        email: collab?.account?.email,
        phone: collab?.account?.phone,
        imgUrl: collab?.account?.imgUrl,
        status: collab?.status,
        confirmTime: collab?.confirmTime,
        isBusService: collab?.schoolBusOption
    }));

    const fetchAttendence = async () => {
        await dispatch(getWorkListsByPositionId({
            positionId: positionId
        }))
    }
    useEffect(() => {
        fetchAttendence()
    }, [])

    const handler = {
        setCurrentRow,
        setShowDetail,
        setOpenEditPostModal,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleActionChange,
        handleSearch,
        handleConfirmCheckAttendance
    }
    const props = {
        total,
        columns,
        loading,
        rows,
        showDetail,
        currentRow,
        openEditPostModal,
        editPostModalId,
        postInfo,
        page,
        pageSize,
        pageSizeOptions,
        workLists
    }
    return {
        handler,
        props,
    }
}
export default useViewAttendanceHook;
