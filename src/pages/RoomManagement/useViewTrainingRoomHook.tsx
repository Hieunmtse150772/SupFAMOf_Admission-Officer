import { CheckOutlined, CloseCircleOutlined, MoreOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Box } from '@mui/material';
import { Button, Dropdown, MenuProps, Modal, Space, Tag } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getAllClassTraining } from 'features/classSlice';
import { ClassTrainingI, TrainingRegistrationsI } from 'models/classTraining.model';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';


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
    postName?: string,
    postCode?: string,
    dateFrom?: Date,
    dateTo?: Date,
    status?: string,
    postCategoryId?: number
}
function useViewTrainingHook() {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    const { confirm } = Modal;
    const rooms = useAppSelector(state => state.class.allClassList);
    const total = rooms.metadata?.total;
    const isLoading = useAppSelector(state => state.post.loading);
    const [page, setPage] = useState<number>(1);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const [searchParams, setSearchParams] = useState<SearchParamsI>()
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [openViewCollabListModal, setOpenViewCollabListModal] = useState<boolean>(false);
    const [collabList, setCollabList] = useState<TrainingRegistrationsI[]>()
    const [eventDayId, setEvenDayId] = useState<string>()
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
            key: 'date',
            valueType: 'date',
            hideInSearch: true,
            width: 5,
        },
        {
            title: 'Start time',
            dataIndex: 'timeFrom',
            key: 'timeFrom',
            valueType: 'time',
            width: 30,
            sorter: true,
        },
        {
            title: 'End time',
            dataIndex: 'timeTo',
            key: 'timeTo',
            valueType: 'time',
            width: 30,
            hideInSearch: true,
            sorter: true,
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
                                <Tag color="green">Pending</Tag>
                            </Space>
                        )
                    case 2:
                        return (
                            <Space size={0}>
                                <Tag color="blue">Approved</Tag>
                            </Space>
                        )
                    case 3:
                        return (
                            <Space size={0}>
                                <Tag color="red">Rejected</Tag>
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
                        disabled: Boolean(value !== 1)
                    },
                    {
                        label: 'Edit',
                        key: '2',
                        icon: <CloseCircleOutlined rev={undefined} />,
                        onClick: () => handleEditRoom(value),
                        danger: true,
                        disabled: Boolean(value !== 1)
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
    const handleEditRoom = (value: any) => {

    }
    const dispatch = useAppDispatch();

    const handleSearch = (value: any) => {

    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        if (JSON.stringify(params) !== JSON.stringify({ current: 1, pageSize: 10 })) {
            setSearchParams(params);
        }
        if (sorter && Object.keys(sorter).length > 0) {
            const keys = Object.keys(sorter);
            const fieldName = keys[0];
            const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';
            if (sorter[fieldName] !== sortModel.Sort && fieldName !== sortModel.Order) {
                setSortModel({ Sort: fieldName, Order: String(sortOrder) })
            }
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
    console.log('room', rows)
    const fetchRooms = async () => {
        await dispatch(getAllClassTraining({
            page: page,
            PageSize: pageSize
        }))
    }
    const handleAddPost = () => {
        navigate('/dashboard/add-post')
    }
    useEffect(() => {
        fetchRooms()
    }, [page, pageSize, searchParams, sortModel])

    const handler = {
        setCurrentRow,
        onPageChange,
        setPageSize,
        onChangePageSize,
        handleAddPost,
        handleActionChange,
        handleSearch,
        setOpenViewCollabListModal
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
        eventDayId
    }
    return {
        handler,
        props,
    }
}
export default useViewTrainingHook