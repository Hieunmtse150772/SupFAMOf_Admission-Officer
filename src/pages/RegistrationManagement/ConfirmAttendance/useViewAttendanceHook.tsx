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
import { confirmAttendanceByPositionId, paramsConfirmAttendance } from 'features/attendenceSlice';
import { useState } from "react";


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
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const { attendanceList, loading } = useAppSelector(state => state.attendence)
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = attendanceList?.metadata?.total
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const dispatch = useAppDispatch();

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
                console.log('status 2: ', valueEnum.status)
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
            title: 'Check attendance',
            key: 'checkAttendence',
            dataIndex: 'status',
            align: 'center',
            fixed: 'right',
            tooltip: 'Can just check attendance for collaborator have checkout!',
            width: 150,
            render: (value, valueEnum) => {
                const checked = value === 2 ? true : false;
                const disabled = valueEnum.checkOutTime === null ? true : false;
                console.log('valueeee: ', value)
                return <Switch
                    style={{
                        marginBlockEnd: 16,
                        alignSelf: 'center',
                        display: 'felx',
                        justifySelf: 'center'
                    }}
                    id="switch"
                    checkedChildren="Attend"
                    unCheckedChildren="Absend"
                    onChange={(value) => { handleChangeStatus(valueEnum.id, valueEnum.status, value) }}
                    defaultChecked={checked}
                    disabled={disabled}
                // fieldProps={{
                //     onChange: (value) => { handleChangeStatus(valueEnum.id, valueEnum.status, value) },
                //     defaultChecked: checked,

                // }}
                />
            },
            hideInSearch: true,
            debounceTime: 5000
        },
    ];

    const handleSearch = (value: any) => {

    }

    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        // if (sorter && Object.keys(sorter).length > 0) {
        //     const keys = Object.keys(sorter);
        //     const fieldName = keys[0];
        //     const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';

        //     setSortModel({ Sort: fieldName, Order: String(sortOrder) })
        // } else setSortModel({ Sort: 'createAt', Order: 'desc' })
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
    const checkAttendanceData = attendanceList.data.map((attendence, index) => ({
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
    // const fetchAttendence = async () => {
    //     await dispatch(getAttendenceByPositionId({
    //         positionId: positionId,
    //         page: page,
    //         PageSize: pageSize,
    //         Sort: sortModel.Sort,
    //         Order: sortModel.Order
    //     }))
    // }
    // useEffect(() => {
    //     const fetch = async () => {
    //         await fetchAttendence();
    //     }
    //     fetch();
    // }, [page, pageSize])

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
        showDetail,
        currentRow,
        openEditPostModal,
        postInfo,
        page,
        pageSize,
        pageSizeOptions,
        attendanceList
    }
    return {
        handler,
        props,
    }
}
export default useViewAttendanceHook;
