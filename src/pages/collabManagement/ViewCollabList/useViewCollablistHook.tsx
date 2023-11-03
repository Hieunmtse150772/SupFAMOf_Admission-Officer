import { ProColumns } from "@ant-design/pro-components";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCollabList } from "features/collabSlice";
import { useEffect, useState } from "react";

const useViewCollablistHook = () => {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const collabAPI = useAppSelector(state => state.collab.collabList);
    const isLoading = useAppSelector(state => state.post.loading);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = collabAPI?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);

    const columns: ProColumns[] = [
        {
            title: 'Full name',
            dataIndex: 'name',
            key: 'name',
            width: 5,
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
            width: 15,
            hideInSearch: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 30,
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Is Premium',
            dataIndex: 'isPremium',
            key: 'isPremium',
            width: 30,
            sorter: true,
        },
        {
            title: 'Student ID',
            dataIndex: 'idStudent',
            key: 'idStudent',
            hideInSearch: true,
            width: 20,
        },
        {
            title: 'Tax Number',
            dataIndex: 'taxNumber',
            key: 'taxNumber',
            width: 20,
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

    const rows = collabAPI?.data.map(collab => ({
        key: collab?.id,
        name: collab?.name,
        email: collab?.email,
        phone: collab?.phone,
        imgUrl: collab?.imgUrl,
        isPremium: collab?.isPremium,
        idStudent: collab?.idStudent,
        identityNumber: collab?.identityNumber,
        taxNumber: collab?.taxNumber,
        bankName: collab?.bankName,
        branch: collab?.branch
        // ...
    }));
    const fetchCollabList = async () => {
        await dispatch(getCollabList())
    }

    useEffect(() => {
        fetchCollabList()
    }, [page, pageSize])
    const handler = { onPageChange, onChangePageSize }
    const props = { columns, collabAPI, pageSizeOptions, total, page, pageSize, rows, isLoading }
    return {
        handler,
        props,
    }
}

export default useViewCollablistHook
