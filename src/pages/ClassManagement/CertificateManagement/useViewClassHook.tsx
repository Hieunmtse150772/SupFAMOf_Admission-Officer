import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { blue, green, grey, red } from "@mui/material/colors";
import { Avatar, Modal, Popover, Space, StepsProps, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import SearchTrainingRegistrationParamsDto from "dtos/searchTrainingRegistration.dto";
import StatusTrainingRegistration from "enums/statusTrainingRegistration.enum";
import { assignTrainingClass, getCertificateRegistration } from 'features/certificateSlice';
import { getPostByAccountId } from "features/postSlice";
import AssignTrainingClass from "models/assignTraining.model";
import { Key, useEffect, useState } from "react";
import { useParams } from 'react-router';


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
function UseViewClassHook() {
    const Formatter = 'DD/MM/YYYY'
    const { id } = useParams<{ id: string }>();
    const [currentRow, setCurrentRow] = useState<any>();
    const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const certificateRegistrationList = useAppSelector(state => state.certificate.trainingRegistration)
    const certificateList = useAppSelector(state => state.certificate.certificateOption)
    const isLoading = useAppSelector(state => state.certificate.loading);

    const valueEnum: { [key: number]: { text: string } } = {};
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<number | null>();
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = certificateRegistrationList?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [postId, setPostId] = useState<number | null>(null);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [openAssignClassModal, setOpenAssignClassModal] = useState<boolean>(false);
    const fetchCertificateRegistration = async () => {
        try {
            const params: SearchTrainingRegistrationParamsDto = {
                id: Number(id),
                isActive: true
            }
            await dispatch(getCertificateRegistration(params))

        } catch (error) {
            console.error(error)
        }
    }
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            hideInSearch: true,
        },
        {
            title: 'Is Premium',
            dataIndex: 'isPremium',
            key: 'isPremium',
            hideInSearch: true,
            render: (isPremium) => {

                return <Space size={0}>
                    {isPremium ? <Tag color="yellow">Premium</Tag> : <Tag color="blue">Normal</Tag>}
                </Space>
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
    ];
    const dispatch = useAppDispatch();
    const { confirm } = Modal;

    const handleSubmit = async (value: any) => {
    }
    const hanldeOpenAssignClass = () => {
        setOpenAssignClassModal(true);
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
    const handleAssignClass = (evenDayId: Key[]) => {
        console.log('evenDayId: ', evenDayId)

        const params: AssignTrainingClass[] = selectedRowsState.map((row) => (
            {
                trainingRegistrationId: row.key,
                eventDayId: Number(evenDayId[0])
            }))
        console.log('params: ', params)
        dispatch(assignTrainingClass(params)).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Assign success');
                setOpenAssignClassModal(false);
            } else message.error(response?.payload?.message)
        })
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

    const rows = certificateRegistrationList?.data[0]?.registrations.map(collab => ({
        key: collab?.id,
        name: collab?.name,
        email: collab?.email,
        phone: collab?.phone,
        imgUrl: collab?.imgUrl,
        isPremium: collab?.isPremium,
        idStudent: collab?.idStudent,
        status: collab?.status
        // ...
    }));

    useEffect(() => {
        fetchCertificateRegistration()
    }, [page, pageSize, sortModel])

    const handler = {
        setCurrentRow,
        setShowDetail,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleSubmit,
        setStatusFilter,
        handleActionChange,
        handleSearch,
        setSelectedRows,
        handleAssignClass,
        setOpenAssignClassModal,
        hanldeOpenAssignClass
    }
    const props = {
        openConFirmModal,
        total,
        columns,
        rows,
        page,
        pageSize,
        pageSizeOptions,
        postId,
        certificateList,
        certificateRegistrationList,
        isLoading,
        selectedRowsState,
        openAssignClassModal
    }
    return {
        handler,
        props,
    }
}
export default UseViewClassHook;
