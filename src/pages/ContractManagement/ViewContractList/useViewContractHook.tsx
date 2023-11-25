import { ProColumns } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getContractList } from "features/contractSlice";
import moment from "moment";
import { useEffect, useState } from "react";

const useViewContractHook = () => {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const contractAPI = useAppSelector(state => state.contract.contractList);
    const isLoading = useAppSelector(state => state.post.loading);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = contractAPI?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [openAddContractModal, setOpenAddContractModal] = useState<boolean>(false)
    const columns: ProColumns[] = [
        {
            title: 'Contract Name',
            dataIndex: 'contractName',
            key: 'contractName',
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
            title: 'Description',
            dataIndex: 'contractDescription',
            key: 'contractDescription',
            width: 15,
            hideInSearch: true,
        },
        {
            title: 'File',
            dataIndex: 'sampleFile',
            key: 'sampleFile',
            width: 30,
            sorter: true,
            render: (value) => {
                return <a href={String(value)}>Link</a>
            },
            hideInSearch: true,
        },
        {
            title: 'Salary',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            width: 30,
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            hideInSearch: true,
            width: 20,
            render: (value) => {
                console.log('value: ', value)
                return (
                    <Space size={0}>
                        {value ? <Tag color="blue">isActive</Tag> : <Tag color="red">inActive</Tag>}
                    </Space>
                );
            }
        },
        {
            title: 'Date Create',
            dataIndex: 'createAt',
            key: 'createAt',
            width: 20,
        },
    ];
    const dispatch = useAppDispatch();
    const handleSearch = () => {

    }
    const onPageChange = (value: any) => {
        setPage(value)
    }
    const onChangePageSize = (value: any) => {
        console.log('pagesize: ', value)
        setPageSize(value)
    }

    const rows = contractAPI?.data.map(contract => ({
        key: contract?.id,
        contractName: contract?.contractName,
        contractDescription: contract?.contractDescription,
        sampleFile: contract?.sampleFile,
        totalSalary: contract?.totalSalary,
        isActive: contract?.isActive,
        createAt: moment(contract?.createAt).format(Formatter)
        // ...
    }));
    const fetchContractList = async () => {
        await dispatch(getContractList())
    }
    const handleAddContract = () => {
        setOpenAddContractModal(true);
    }
    useEffect(() => {
        fetchContractList()
    }, [page, pageSize])
    const handler = { onPageChange, onChangePageSize, handleAddContract, setOpenAddContractModal, handleSearch }
    const props = { columns, contractAPI, pageSizeOptions, total, page, pageSize, rows, isLoading, openAddContractModal }
    return {
        handler,
        props,
    }
}

export default useViewContractHook
