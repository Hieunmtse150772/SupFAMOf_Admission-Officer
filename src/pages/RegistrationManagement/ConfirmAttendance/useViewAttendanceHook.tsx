import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { green, grey, red } from "@mui/material/colors";
import { Avatar, Modal, Switch, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from "enums/statusAttendanceEnum";
import { confirmAttendanceByPositionId, getAttendenceByPositionId, paramsConfirmAttendance } from 'features/attendenceSlice';
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
function useViewAttendanceHook(positionId: string, fetchPost: () => void, setOpenCheckAttendanceModal: React.Dispatch<React.SetStateAction<boolean>>) {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const { attendenceList, loading } = useAppSelector(state => state.attendence)
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const postInfoAPI = useAppSelector(state => state.post.postInfo);
    const isLoading = useAppSelector(state => state.post.loading);
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = attendenceList?.metadata?.total
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let navigate = useNavigate();

    const columns: ProColumns[] = [
        {
            title: 'Position name',
            dataIndex: 'positionName',
            key: 'positionName',
            hideInSearch: true,
            width: 100,
            fixed: 'left'
        },
        {
            title: 'Avatar',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            hideInSearch: true,
            width: 50,
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
            width: 120,
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
            title: 'Student ID',
            dataIndex: 'idStudent',
            key: 'idStudent',
            hideInSearch: true,
            width: 100,
        },
        {
            title: 'CheckIn time',
            dataIndex: 'checkInTime',
            key: 'checkinTime',
            valueType: 'date',
            hideInSearch: true,
            width: 100,
        },
        {
            title: 'CheckOut time',
            dataIndex: 'checkOutTime',
            valueType: 'date',
            key: 'checkoutTime',
            width: 100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
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
                    case Status.pending:
                        color = '#1890ff';
                        statusText = 'Pending';
                        break;

                    case Status.approved:
                        color = green[500];
                        statusText = 'Approved';
                        break;

                    case Status.rejected:
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
            title: 'Check attendence',
            key: 'checkAttendence',
            dataIndex: 'status',
            align: 'center',
            fixed: 'right',
            width: 150,
            render: (value, valueEnum) => {
                return <Switch
                    style={{
                        marginBlockEnd: 16,
                        alignSelf: 'center',
                        display: 'felx',
                        justifySelf: 'center'
                    }}
                    defaultChecked={Boolean(valueEnum?.status === 2)}
                    checkedChildren="Attend"
                    unCheckedChildren="Absend"
                    onChange={(value) => { handleChangeStatus(valueEnum.id, valueEnum.status, value) }}
                />
            },
            hideInSearch: true,
        },
    ];
    const dispatch = useAppDispatch();

    const handleSearch = (value: any) => {

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

    const checkAttendanceData = attendenceList.data.map((attendence, index) => ({
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
        confirm({
            title: 'Do you want to confirm check attendance?',
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk() {
                dispatch(confirmAttendanceByPositionId(params)).then((response: any) => {
                    if (response?.payload?.data?.status?.success) {
                        message.success('Confirm attendance success');
                        setOpenCheckAttendanceModal(false)
                        fetchPost();
                    } else if (response?.payload?.statusCode === 400) {
                        message.error(response?.payload?.message);
                    }
                })
            },
            onCancel() {
            },
        });

    }

    const rows = attendenceList.data.map((attendence, index) => ({
        count: index,
        key: attendence?.id,
        id: attendence?.id,
        name: attendence?.account?.name,
        email: attendence?.account?.email,
        phone: attendence?.postRegistration?.post?.account?.phone,
        imgUrl: attendence?.account?.imgUrl,
        idStudent: attendence?.postRegistration?.post?.account?.accountInformation?.idStudent,
        isPremium: attendence?.postRegistration?.post?.account?.isPremium,
        status: attendence?.status,
        checkInTime: attendence.checkInTime,
        checkOutTime: attendence.checkOutTime,
        positionName: attendence.postRegistration.position.positionName
    }));

    const fetchAttendence = async () => {
        await dispatch(getAttendenceByPositionId({
            positionId: positionId,
            page: page,
            PageSize: pageSize,
            Sort: sortModel.Sort,
            Order: sortModel.Order
        }))
    }
    useEffect(() => {
        fetchAttendence()
    }, [page, pageSize, sortModel])

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
        postInfo,
        postInfoAPI,
        isLoading,
        page,
        pageSize,
        pageSizeOptions,
        attendenceList
    }
    return {
        handler,
        props,
    }
}
export default useViewAttendanceHook;
