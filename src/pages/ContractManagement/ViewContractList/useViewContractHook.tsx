import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { ProColumns } from "@ant-design/pro-components";
import { Box } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { Avatar, Button, Dropdown, MenuProps, Space, Table, TableColumnsType, Tag } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCollabList } from "features/collabSlice";
import { getContractList } from "features/contractSlice";
import UserPlusIcon from "icons/UserPlusIcon";
import { ListContractI } from "models/contract.model";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
type CollumsField = {
    key: number,
    contractName: string,
    contractDescription: string,
    sampleFile: string,
    totalSalary: number,
    isActive: boolean,
    createAt: Date
}
interface ExpandedDataType {
    id: number,
    contractId: number,
    accountId: number,
    status: number,
    name: string,
    email: string,
    phone: string,
    imgUrl: string,
}
const useViewContractHook = () => {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const contractAPI = useAppSelector(state => state.contract.contractList);
    const { collabList, loading } = useAppSelector(state => state.collab);
    const isLoading = useAppSelector(state => state.post.loading);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = contractAPI?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [openAddContractModal, setOpenAddContractModal] = useState<boolean>(false);
    const [addCollabModal, setAddCollabModal] = useState<boolean>(false);
    const [contractId, setContractId] = useState<number | null>(null);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);
    const columns: ProColumns<CollumsField>[] = [
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
                return <a ref={downloadRef} href={String(value)} download='downloaded_file.doc'>Link</a>
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
        {
            title: 'Action',
            align: 'center',
            width: 10,
            hideInSearch: true,
            render: (value, valueEnum) => {
                const items: MenuProps['items'] = [
                    {
                        label: 'Download',
                        key: '1',
                        icon: <DownloadOutlined rev={undefined} />,
                        onClick: () => handleDownload(value),
                    },
                    {
                        label: 'Edit',
                        key: '2',
                        icon: <EditOutlined color='green' rev={undefined} />,
                        //   onClick: () => handleOpenEditPostModal(value),
                    },
                    {
                        label: 'Add',
                        key: '3',
                        icon: <UserPlusIcon />,
                        onClick: () => handleAddCollab(value),
                    },
                    {
                        label: 'Delete',
                        key: '4',
                        icon: <DeleteOutlined color='green' rev={undefined} />,
                        //   onClick: () => handleOpenEditPostModal(value),
                        danger: true
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

    const rowsExpanded: ListContractI[] = contractAPI.data.map(contract => ({
        key: contract.id,
        contract: contract.accountContracts
    }));

    const expandedRowRender = (record: any) => {
        console.log('rowsExpanded: ', rowsExpanded)
        const columnsExpanded: TableColumnsType<ExpandedDataType> = [
            { title: 'Avatar', dataIndex: 'imgUrl', key: 'imgUrl', render: (value) => (<Avatar src={value}></Avatar>) },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'phone', dataIndex: 'phone', key: 'phone' },
            {
                title: 'Status', dataIndex: 'status', key: 'status', render: (rows) => {
                    return rows === 1 ? (
                        <Space size={0}>
                            <Tag color="blue">Pending</Tag>
                        </Space>
                    ) : (
                        <Space size={0}>
                            <Tag color="Yellow">Comfirmed</Tag>
                        </Space>
                    );
                }
            },
        ];
        console.log('record: ', record?.id)
        const data = rowsExpanded.find((value) => value.key === record?.id);
        console.log('data: ', data)
        const dataCustom = data?.contract.map((value) => {
            return {
                id: value.id,
                name: value.account.name,
                email: value.account.email,
                accountId: value.account.id,
                contractId: value.contractId,
                status: value.status,
                phone: value.account.phone,
                imgUrl: value.account.imgUrl
            }
        })
        return <Table
            columns={columnsExpanded}
            dataSource={dataCustom}
            pagination={false}
        />;
    };
    const dispatch = useAppDispatch();
    const handleAddCollab = async (value: any) => {
        setContractId(value?.id)
        const result = await dispatch(getCollabList({ email: '' }));
        unwrapResult(result)
        if (getCollabList.fulfilled.match(result)) {
            setAddCollabModal(true);
        }
    }
    const handleDownload = (value: any) => {
        if (downloadRef.current && value && value.sampleFile) {
            const fileUrl = value.sampleFile;
            const fileName = 'downloaded_file.docx'; // Thay đổi đuôi file tại đây

            // Tạo đường dẫn tải về với đuôi file .docx
            const downloadUrl = `${fileUrl}?alt=media&download=${fileName}`;

            // Mở tệp trong tab mới
            window.open(downloadUrl, '_blank');
        } else {
            console.error('Invalid file URL');
        }
    }
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
        id: contract?.id,
        contractName: contract?.contractName,
        contractDescription: contract?.contractDescription,
        sampleFile: contract?.sampleFile,
        totalSalary: contract?.totalSalary,
        isActive: contract?.isActive,
        createAt: moment(contract?.createAt).format(Formatter)
        // ...
    }));
    const fetchContractList = async () => {
        await dispatch(getContractList({ page: page, PageSize: pageSize }))
    }
    const handleAddContract = () => {
        setOpenAddContractModal(true);
    }
    useEffect(() => {
        fetchContractList()
    }, [page, pageSize])
    const handler = {
        onPageChange,
        onChangePageSize,
        handleAddContract,
        setOpenAddContractModal,
        handleSearch,
        setAddCollabModal,
        fetchContractList
    }
    const props = { columns, contractAPI, pageSizeOptions, total, page, pageSize, rows, isLoading, openAddContractModal, rowsExpanded, collabList, loading, contractId, addCollabModal }
    return {
        handler,
        props,
        expandedRowRender
    }
}

export default useViewContractHook
