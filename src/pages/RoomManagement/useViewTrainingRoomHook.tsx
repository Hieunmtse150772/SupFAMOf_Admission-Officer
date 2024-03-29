import { CheckOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Box } from '@mui/material';
import { Button, Dropdown, MenuProps, Modal, Space, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { deleteClassById, getAllClassTraining, getClassById } from 'features/classSlice';
import { ClassTrainingI, TrainingRegistrationsI } from 'models/classTraining.model';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import useSessionTimeOut from 'utils/useSessionTimeOut';


type ViewRoomI = {
    key: number,
    id: number,
    class: string,
    date: Date,
    timeFrom: Date,
    timeTo: Date,
    status: number,
    numberOfRegistration: number,
    registrationsList: TrainingRegistrationsI[]
}
type SortModalI = {
    Sort: string,
    Order: string
}
type SearchParamsI = {
    date?: Date,
    class?: string,
}
function useViewTrainingHook() {
    const Formatter = 'YYYY-MM-DD'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const { SessionTimeOut } = useSessionTimeOut();
    const rooms = useAppSelector(state => state.class.allClassList);
    const total = rooms.metadata?.total;
    const isLoading = useAppSelector(state => state.class.loading);
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [openViewCollabListModal, setOpenViewCollabListModal] = useState<boolean>(false);
    const [collabList, setCollabList] = useState<TrainingRegistrationsI[]>();
    const [eventDayId, setEvenDayId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [openAddMoreClassModal, setOpenAddMoreClassModal] = useState<boolean>(false);
    const [openEditRoom, setOpenEditRoom] = useState<boolean>(false);
    const [roomId, setRoomId] = useState<string>();
    const { classInfo } = useAppSelector(state => state.class);
    let navigate = useNavigate();

    const columns: ProColumns[] = [
        {
            title: 'Room',
            dataIndex: 'class',
            key: 'class',
            width: 10,
            render: (dom, entity) => {
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
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
            key: 'Date',
            sorter: true,
            valueType: 'date',
            width: 5,
        },
        {
            title: 'Start time',
            dataIndex: 'timeFrom',
            key: 'timeFrom',
            valueType: 'time',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'End time',
            dataIndex: 'timeTo',
            key: 'timeTo',
            valueType: 'time',
            width: 30,
            hideInSearch: true,
        },
        {
            title: 'Number collaborator',
            dataIndex: 'numberOfRegistration',
            key: 'numberOfRegistration',
            hideInSearch: true,
            width: 30,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'stauts',
            width: 30,
            hideInSearch: true,
            render: (rows) => {
                switch (rows) {
                    case 1:
                        return (
                            <Space size={0}>
                                <Tag color="green">Opening</Tag>
                            </Space>
                        )
                    case 2:
                        return (
                            <Space size={0}>
                                <Tag color="red">Deleted</Tag>
                            </Space>
                        )
                    case 3:
                        return (
                            <Space size={0}>
                                <Tag color="blue">Completed</Tag>
                            </Space>
                        )
                    default:
                        break;
                }
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
                        label: 'Collaborator list',
                        key: '1',
                        icon: <CheckOutlined color='green' rev={undefined} />,
                        onClick: () => handleViewRegistration(valueEnum),
                        disabled: Boolean(value === 2)
                    },
                    {
                        label: 'Edit',
                        key: '2',
                        icon: <EditOutlined rev={undefined} />,
                        onClick: () => handleEditRoom(valueEnum),
                        disabled: Boolean(value === 2)
                    },
                    {
                        label: 'Delete',
                        key: '3',
                        icon: <DeleteOutlined rev={undefined} />,
                        danger: true,
                        onClick: () => handleDelete(valueEnum),
                        disabled: Boolean(value === 2)
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
    const handleViewRegistration = async (value: ViewRoomI) => {
        console.log('value: ', value)
        const newItem = {
            date: value.date,
            timeFrom: value.timeFrom,
            timeTo: value.timeTo
        };
        setOpenViewCollabListModal(true);
        const updatedCollabList: TrainingRegistrationsI[] = value.registrationsList.map(item => ({
            ...item,
            newItem
        }));
        setEvenDayId(String(value?.id));
        setCollabList(updatedCollabList);
    }
    const handleEditRoom = async (value: any) => {
        setOpenEditRoom(true);
        setRoomId(value?.id);
        await dispatch(getClassById({ id: value?.id })).then((response: any) => {
            if (response?.payload?.statusCode === 401) {
                SessionTimeOut();
            }
        }).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }
    const handleDelete = async (data: ViewRoomI) => {
        await dispatch(deleteClassById(String(data?.id))).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Delete success!');
                fetchRooms();
            } else if (response?.payload?.statusCode === 401) {
                SessionTimeOut();
            } else {
                message.error(response?.payload?.message)
            }
        })
    }
    const handleOpenAddMoreRoom = () => {
        setOpenAddMoreClassModal(true)
    }

    const dispatch = useAppDispatch();

    const handleSearch = async (value: SearchParamsI) => {
        console.log('value:', value)
        const params = {
            class: value?.class,
            date: value?.date
        }
        setSearchParams(params);
        await dispatch(getAllClassTraining(params)).then((response: any) => {
            if (response?.payload?.statusCode === 401) {
                SessionTimeOut();
            }
        }).catch((error) => {
            console.log("Error in getting the data", error)
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
        } else setSortModel({ Sort: 'Date', Order: 'desc' })
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
    const rows: Array<ClassTrainingI> = rooms.data.map(room => ({
        ...room,
        key: room?.id,
        id: room?.id,
        class: room?.class,
        date: room?.date,
        timeFrom: room?.timeFrom,
        timeTo: room?.timeTo,
        status: room?.status,
        numberOfRegistration: room?.trainingRegistrations.length,
        registrationsList: room?.trainingRegistrations
    }));
    const fetchRooms = async () => {
        await dispatch(getAllClassTraining({
            page: page,
            PageSize: pageSize,
            class: searchParams?.class,
            date: searchParams?.date,
            Sort: sortModel.Sort,
            Order: sortModel.Order
        })).then((response: any) => {
            if (response?.payload?.statusCode === 401) {
                SessionTimeOut();
            }
        })
    }
    const handleAddPost = () => {
        navigate('/dashboard/add-post')
    }

    useEffect(() => {
        fetchRooms()
    }, [page, pageSize, sortModel])

    const handler = {
        setCurrentRow,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleAddPost,
        handleActionChange,
        handleSearch,
        setOpenViewCollabListModal,
        fetchRooms,
        handleOpenAddMoreRoom,
        setOpenAddMoreClassModal,
        setOpenEditRoom
    }
    const props = {
        columns,
        rows,
        currentRow,
        isLoading,
        page,
        pageSize,
        pageSizeOptions,
        rooms,
        total,
        openViewCollabListModal,
        collabList,
        eventDayId,
        loading,
        openAddMoreClassModal,
        roomId,
        openEditRoom,
        classInfo,
    }
    return {
        handler,
        props,
    }
}
export default useViewTrainingHook
