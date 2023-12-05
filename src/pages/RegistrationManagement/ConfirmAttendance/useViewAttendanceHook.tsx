import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Avatar, Modal, Space, Switch, Tag } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getAttendenceByPositionId } from 'features/attendenceSlice';
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
    const { attendenceList, loading } = useAppSelector(state => state.attendence)
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
    const [editPostModalId, setEditPostModalId] = useState<string>('');
    const requests = useAppSelector(state => state.request.requests)
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
    const total = requests?.metadata?.total
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    let navigate = useNavigate();

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
            title: 'Student ID',
            dataIndex: 'idStudent',
            key: 'idStudent',
            hideInSearch: true,
        },
        {
            title: 'Check attendence',
            key: 'checkAttendence',
            align: 'center',
            render: (value) => {
                return <Switch
                    style={{
                        marginBlockEnd: 16,
                    }}
                    defaultChecked={false}
                    checkedChildren="attend"
                    unCheckedChildren="absend"
                />
            },
            hideInSearch: true,
        },
    ];
    const dispatch = useAppDispatch();

    const handleSearch = (value: any) => {

    }
    const handleConfirmCheckAttendance = async (value: any) => {
        console.log('value: ', value)
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
    const rows = attendenceList.data.map(attendence => ({
        key: attendence?.id,
        id: attendence?.id,
        name: attendence?.account?.name,
        email: attendence?.account?.email,
        phone: attendence?.postRegistration?.post?.account?.phone,
        imgUrl: attendence?.account?.imgUrl,
        idStudent: attendence?.postRegistration?.post?.account?.accountInformation?.idStudent,
        isPremium: attendence?.postRegistration?.post?.account?.isPremium
    }));

    const fetchAttendence = async () => {
        await dispatch(getAttendenceByPositionId({
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
        requests,
        loading,
        rows,
        showDetail,
        currentRow,
        openEditPostModal,
        editPostModalId,
        postInfo,
        postInfoAPI,
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
export default useViewAttendanceHook;
