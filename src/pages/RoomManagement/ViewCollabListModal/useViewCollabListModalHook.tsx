import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { blue, green, grey, red } from "@mui/material/colors";
import { Avatar, Modal, Switch, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import StatusTrainingRegistration from "enums/statusTrainingRegistration.enum";
import { confirmAttendanceByEvenDayId } from "features/classSlice";
import { ConfirmAdtendanceRoom } from "models/ConfirmAdtendanceRoom.model";
import { TrainingRegistrationsI } from "models/classTraining.model";
import { useState } from "react";
import { useNavigate } from 'react-router';


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
function useViewCollabListModalHook(
    collabList: TrainingRegistrationsI[],
    eventDayId: string,
    setOpenViewCollabListModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchRooms: () => void
) {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const { attendenceList, loading } = useAppSelector(state => state.attendence)
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const [editPostModalId, setEditPostModalId] = useState<string>('');
    const isLoading = useAppSelector(state => state.class.loading);
    const [postInfo, setPostInfo] = useState<any>();
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()

    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let navigate = useNavigate();

    const columns: ProColumns[] = [
        {
            title: 'Number',
            dataIndex: 'count',
            key: 'count',
            hideInSearch: true,
            valueType: 'index'
        },
        {
            title: 'Avatar',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: 'Start time',
            dataIndex: 'timeFrom',
            key: 'timeFrom',
            hideInSearch: true,
        },
        {
            title: 'End time',
            dataIndex: 'timeTo',
            key: 'timeTo',
            hideInSearch: true,
        },
        {
            title: 'Student ID',
            dataIndex: 'idStudent',
            key: 'idStudent',
            width: 100,
            hideInSearch: true,
        },
        {
            title: 'Certificate',
            dataIndex: 'certificateName',
            key: 'certificateName',
            hideInSearch: true,
            width: 100,

            render: (value, valueEnum) => {
                return <Tag color="green">{valueEnum.certificateName}</Tag>
            }
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
                    case StatusTrainingRegistration.Pending:
                        color = '#1890ff';
                        statusText = 'Pending';
                        break;
                    case StatusTrainingRegistration.Assigned:
                        color = blue[500];
                        statusText = 'Assigned';
                        break;
                    case StatusTrainingRegistration.Passed:
                        color = green[500];
                        statusText = 'Passed';
                        break;
                    case StatusTrainingRegistration.Not_Passed:
                        color = red[500];
                        statusText = 'Not Passed';
                        break;
                    case StatusTrainingRegistration.Canceled:
                        color = red[500];
                        statusText = 'Canceled';
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
            width: 100,
            render: (value, valueEnum) => {
                return <Switch
                    style={{
                        marginBlockEnd: 16,
                        alignSelf: 'center',
                        display: 'felx',
                        justifySelf: 'center'
                    }}
                    defaultChecked={Boolean(valueEnum?.status === 3)}
                    checkedChildren="passed"
                    unCheckedChildren="not passed"
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

    const checkAttendanceData = collabList.map((collab, index) => ({
        trainingRegistrationId: collab?.id,
        status: collab?.status
    }))
    const handleChangeStatus = (id: number, status: number, value: boolean) => {
        checkAttendanceData.map((attendance) => {
            if (attendance.trainingRegistrationId === id) {
                attendance.status = value ? 3 : 4
            }
            return attendance;
        })
    }
    const handleConfirmCheckAttendance = async (value: any) => {
        confirm({
            title: `Do you want to submit check attendance?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                const params: ConfirmAdtendanceRoom = {
                    data: checkAttendanceData,
                    eventDayId: eventDayId
                }
                console.log('paramsL: ', params)
                dispatch(confirmAttendanceByEvenDayId(params)).then((response: any) => {
                    console.log('response: ', response)
                    if (response?.payload?.status?.success) {
                        message.success('Confirm attendance success');
                        setOpenViewCollabListModal(false);
                        fetchRooms();
                    } else if (response?.payload?.statusCode === 400) {
                        message.error(response?.payload?.message);
                    }
                })
            },
            onCancel() {
            },
        });

    }

    const rows = collabList.map((collab, index) => ({
        count: index,
        key: collab?.id,
        id: collab?.id,
        name: collab?.account?.name,
        email: collab?.account?.email,
        phone: collab?.account?.phone,
        imgUrl: collab?.account?.imgUrl,
        idStudent: collab?.account?.idStudent,
        status: collab?.status,
        timeFrom: collab?.newItem?.timeFrom,
        timeTo: collab?.newItem?.timeTo,
        date: collab?.newItem?.date,
        certificateName: collab?.trainingCertificate?.certificateName
    }));

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
        columns,
        loading,
        rows,
        showDetail,
        currentRow,
        openEditPostModal,
        editPostModalId,
        postInfo,
        isLoading,
        page,
        pageSize,
        pageSizeOptions
    }
    return {
        handler,
        props,
    }
}
export default useViewCollabListModalHook;
