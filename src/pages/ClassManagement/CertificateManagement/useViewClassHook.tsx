import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { blue, green, grey, red } from "@mui/material/colors";
import { Avatar, Modal, Popover, StepsProps, message } from 'antd';
import { RowSelectionType, SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import SearchTrainingRegistrationParamsDto from "dtos/searchTrainingRegistration.dto";
import StatusTrainingRegistration from "enums/statusTrainingRegistration.enum";
import { assignTrainingClass, getCertificateRegistration } from 'features/certificateSlice';
import AssignTrainingClass from "models/assignTraining.model";
import { Key, useEffect, useState } from "react";
import { useParams } from 'react-router';
import useSessionTimeOut from "utils/useSessionTimeOut";


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
type TableType = {
    key: number,
    name: string,
    email: string,
    phone: string,
    imgUrl: string,
    isPremium: boolean,
    idStudent: string,
    status: number,
}
function UseViewClassHook() {
    const Formatter = 'YYYY-MM-DD'
    const { id } = useParams<{ id: string }>();
    const { SessionTimeOut } = useSessionTimeOut();
    const [currentRow, setCurrentRow] = useState<any>();
    const [selectedRowKeys, setSelectedRows] = useState<any[]>([]);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const certificateRegistrationList = useAppSelector(state => state.certificate.trainingRegistration);
    const title = certificateRegistrationList.data[0]?.certificateName;
    const certificateList = useAppSelector(state => state.certificate.certificateOption);
    const isLoading = useAppSelector(state => state.certificate.loading);
    const valueEnum: { [key: number]: { text: string } } = {};
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [statusFilter, setStatusFilter] = useState<number | null>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = certificateRegistrationList?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [postId, setPostId] = useState<number | null>(null);
    const rowSelection = {
        type: "checkbox" as RowSelectionType,
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRows(keys);
        },
        getCheckboxProps: (record: TableType) => ({
            disabled: record.status === 3 || record.status === 4, // Column configuration not to be checked
            name: record.name
        }),
    };
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [openAssignClassModal, setOpenAssignClassModal] = useState<boolean>(false);

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
            hideInSearch: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            hideInSearch: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            hideInSearch: true,
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
            // await dispatch(getPostByAccountId({
            //     page: page,
            //     PageSize: pageSize,
            //     Status: statusFilter,
            //     Sort: sortModel?.Sort,
            //     Order: sortModel?.Order,
            //     dateFrom: value?.dateFrom,
            //     dateTo: value?.dateTo,
            //     postCode: value?.postCode,
            //     postName: value?.postName,
            //     postCategoryId: value?.postCategoryId
            // }))
        }
    }
    const handleSetStatus = async (value: any) => {
        setSelectedRows([]);
        if (value.radio === 0) {
            setStatusFilter(null)
            setPage(1)
            await dispatch(getCertificateRegistration({
                id: Number(id),
                isActive: true,
                page: 1,
                PageSize: 10,
                Sort: 'createAt',
                Order: 'desc'
            })).then((response: any) => {
                if (response?.payload?.status === 401) {
                    SessionTimeOut();
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })
        } else {
            setStatusFilter(value?.radio);
            setPage(1)
            await dispatch(getCertificateRegistration({
                id: Number(id),
                isActive: true,
                page: 1,
                PageSize: 10,
                Status: value?.radio
            })).then((response: any) => {
                if (response?.payload?.status === 401) {
                    SessionTimeOut();
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })
        }
    }
    const fetchCertificatRegistrationAssigned = async () => {
        setStatusFilter(2);
        setPage(1)
        await dispatch(getCertificateRegistration({
            id: Number(id),
            isActive: true,
            page: 1,
            PageSize: 10,
            Status: 2
        })).then((response: any) => {
            if (response?.payload?.status === 401) {
                SessionTimeOut();
            }
        }).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }
    const fetchCertificateRegistration = async () => {
        try {
            const params: SearchTrainingRegistrationParamsDto = {
                id: Number(id),
                isActive: true,
                page: page,
                PageSize: pageSize,
                Sort: sortModel.Sort,
                Order: sortModel.Order,
                Status: statusFilter
            }
            await dispatch(getCertificateRegistration(params)).then((response: any) => {
                if (response?.payload?.status === 401) {
                    SessionTimeOut();
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })

        } catch (error) {
            console.error(error)
        }
    };
    const handleAssignClass = async (evenDayId: Key[]) => {
        confirm({
            title: `Do you want to assign to this room?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                const params: AssignTrainingClass[] = selectedRowKeys.map((row) => (
                    {
                        trainingRegistrationId: row,
                        eventDayId: Number(evenDayId[0])
                    }))
                console.log('params: ', params)
                await dispatch(assignTrainingClass(params)).then((response: any) => {
                    console.log('response: ', response)
                    if (response?.payload?.data?.status?.success) {
                        message.success('Assign room success');
                        setSelectedRows([]);
                        fetchCertificatRegistrationAssigned();
                        setOpenAssignClassModal(false);
                    } else if (response?.payload?.status === 401) {
                        SessionTimeOut();
                    } else message.error(response?.payload?.message)
                }).catch((error) => {
                    message.error('Please save before assign room!');
                    console.log("Error in getting the data", error);
                })
            },
            onCancel() {
            },
        });

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

    const rows: TableType[] = certificateRegistrationList?.data[0]?.registrations.map(collab => ({
        key: collab?.id,
        name: collab?.name,
        email: collab?.email,
        phone: collab?.phone,
        imgUrl: collab?.imgUrl,
        isPremium: collab?.isPremium,
        idStudent: collab?.idStudent,
        status: collab?.status,
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
        hanldeOpenAssignClass,
        fetchCertificateRegistration,
        handleSetStatus
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
        selectedRowKeys,
        openAssignClassModal,
        title,
        statusFilter,
        rowSelection
    }
    return {
        handler,
        props,
    }
}
export default UseViewClassHook;
