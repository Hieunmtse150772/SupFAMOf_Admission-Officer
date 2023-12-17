import { CheckCircleOutlined, DeleteOutlined, DownOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { ProColumns } from "@ant-design/pro-components";
import { Box } from "@mui/material";
import { green, grey, red, yellow } from "@mui/material/colors";
import { unwrapResult } from "@reduxjs/toolkit";
import { Avatar, Button, Dropdown, MenuProps, Space, Table, TableColumnsType, Tag, message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { completeContractByAccountContractId, getCollabByContractId, getContractList } from "features/contractSlice";
import UserPlusIcon from "icons/UserPlusIcon";
import { ContractInfoRows, ListContractI } from "models/contract.model";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
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
    id?: number;
    contractId?: number;
    accountId?: number;
    status?: number;
    name?: string;
    email?: string;
    phone?: string;
    imgUrl?: string;
    signingDate?: Date;
    submittedFile?: string;
    contractName?: string;
    accountContractId?: number
}
type SortModalI = {
    Sort: string,
    Order: string
}
const useViewContractHook = () => {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<ContractInfoRows | null>(null);
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openConFirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const contractAPI = useAppSelector(state => state.contract.contractList);
    const { collabList } = useAppSelector(state => state.contract);
    const isLoading = useAppSelector(state => state.post.loading);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = contractAPI?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [openAddContractModal, setOpenAddContractModal] = useState<boolean>(false);
    const [addCollabModal, setAddCollabModal] = useState<boolean>(false);
    const [contractId, setContractId] = useState<number | null>(null);
    const downloadRef = useRef<HTMLAnchorElement | null>(null);
    const [sortModel, setSortModel] = useState<SortModalI>({
        Sort: 'createAt',
        Order: 'desc'
    });
    const columns: ProColumns<ContractInfoRows>[] = [
        {
            title: 'Contract name',
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
            valueType: 'text',
            width: 15,
            hideInSearch: true,
            render: (value) => {

                if (value !== '') {
                    return (ReactHtmlParser(String(value)));
                }
                return <span></span>;
            },
            hideInTable: true
        },
        {
            title: 'Date create',
            dataIndex: 'createAt',
            key: 'createAt',
            valueType: 'date',
            width: 20,
            sorter: true,
        },
        {
            title: 'Sample file',
            dataIndex: 'sampleFile',
            key: 'sampleFile',
            width: 30,
            render: (value) => {
                return <a ref={downloadRef} href={String(value)} download='downloaded_file.doc'>Link</a>
            },
            hideInSearch: true,
            hideInTable: true
        },
        {
            title: 'Salary',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            render: (value, valueEnum) => {
                return <span>  {Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
                }).format(valueEnum?.totalSalary)}</span>

            },
            width: 30,
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
                        {value ? <Tag color="blue">Is Active</Tag> : <Tag color="red">InActive</Tag>}
                    </Space>
                );
            }
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
                        onClick: () => handleDownload(valueEnum as ContractInfoRows),
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
                        onClick: () => handleAddCollab(valueEnum as ContractInfoRows),
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
            { title: 'Phone', dataIndex: 'phone', key: 'phone' },
            { title: 'Signing date', dataIndex: 'signingDate', key: 'signingDate', render: (value) => <span>{moment(value).format(Formatter)}</span> },
            {
                title: 'Status', dataIndex: 'status', key: 'status', render: (rows) => {
                    let color = grey[400].toString();
                    let statusText = 'Unknown';
                    switch (rows) {
                        case 1:
                            color = '#1890ff';
                            statusText = 'Pending';
                            break;

                        case 2:
                            color = green[500];
                            statusText = 'Confirmed';
                            break;

                        case 3:
                            color = red[500];
                            statusText = 'Rejected';
                            break;
                        case 4:
                            color = yellow[500];
                            statusText = 'Completed';
                            break;
                        case 5:
                            color = red[500];
                            statusText = 'Fail';
                            break;
                        default:
                            break;
                    }
                    return <Box display="flex" alignItems="center">
                        <Space size={0}>
                            <Tag color={color}>{statusText}</Tag>
                        </Space>
                    </Box>
                }
            },
            {
                title: 'Action',
                align: 'center',
                width: 10,
                render: (value, valueEnum) => {
                    const items: MenuProps['items'] = [
                        {
                            label: 'Download',
                            key: '1',
                            icon: <DownloadOutlined rev={undefined} />,
                            onClick: () => handleDownloadSubmitFile(valueEnum),
                        },
                        {
                            label: 'Complete',
                            key: '2',
                            icon: <CheckCircleOutlined color='green' rev={undefined} />,
                            onClick: () => handleCompleteContract(valueEnum),
                        },
                    ];
                    const menuProps = {
                        items,
                    };
                    return <Box>
                        <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
                            <Button icon={<DownOutlined rev={undefined} />}></Button>
                        </Dropdown>
                    </Box>
                },
            },
        ];
        console.log('record: ', record?.id)
        const data = rowsExpanded.find((value) => value.key === record?.id);
        console.log('data: ', data)
        const dataCustom: ExpandedDataType[] = data?.contract.map((value) => {
            return {
                id: value.id,
                name: value.account.name,
                email: value.account.email,
                accountId: value.account.id,
                contractId: value.contractId,
                status: value.status,
                phone: value.account.phone,
                imgUrl: value.account.imgUrl,
                signingDate: value.contract.signingDate,
                submittedFile: value.submittedFile,
                contractName: value.contract.contractName,
                accountContractId: value.id
            };
        }) || [];
        return <Table
            columns={columnsExpanded}
            dataSource={dataCustom}
            pagination={false}
        />;
    };
    const dispatch = useAppDispatch();
    const handleAddCollab = async (value: ContractInfoRows) => {
        console.log('value111: ', value)
        setContractId(Number(value?.id));
        const result = await dispatch(getCollabByContractId({ search: '', contractId: Number(value?.id) }));
        unwrapResult(result);
        setAddCollabModal(true);
        // if (getCollabList.fulfilled.match(result)) {
        //     const filteredCollabs = result.payload.data.data.filter(collab => {
        //         return !listAccount.includes(collab.id);
        //     });
        //     setAccountList(filteredCollabs);
        //     setAddCollabModal(true);
        // }
    }
    const handleDownload = (value: ContractInfoRows) => {
        if (value.sampleFile) {
            const fileUrl = value.sampleFile;
            const fileName = `${value.contractName}.docx`; // Thay đổi đuôi file tại đây
            // Tạo đường dẫn tải về với đuôi file .docx
            const downloadUrl = `${fileUrl}?alt=media&download=${fileName}`;
            // Mở tệp trong tab mới
            window.open(downloadUrl, '_blank');
            message.success(`Download ${fileName} success`)
        } else {
            message.error('Collaborators have not confirmed the contract yet!')
        }
    }
    const handleCompleteContract = (value: ExpandedDataType) => {
        const params = {
            accountContractId: value?.accountContractId
        }
        dispatch(completeContractByAccountContractId(params)).then((response: any) => {
            console.log('response: ', response);
            if (response?.payload.status) {
                message.success('Contract completed successfully')
            } else message.error(response?.payload?.message);
        })
    }
    const handleDownloadSubmitFile = (value: ExpandedDataType) => {
        console.log('value: ', value);
        if (value.submittedFile) {
            const fileUrl = value.submittedFile;
            const fileName = `${value?.name}_${value?.contractName}.docx`; // Thay đổi đuôi file tại đây
            // Tạo đường dẫn tải về với đuôi file .docx
            const downloadUrl = `${fileUrl}?alt=media&download=${fileName}`;
            // Mở tệp trong tab mới
            window.open(downloadUrl, '_blank');
            message.success(`Download ${fileName} success`)

        } else {
            message.error('Download contract fail!')
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

    const rows: ContractInfoRows[] = contractAPI?.data.map(contract => ({
        key: contract?.id,
        id: contract?.id,
        contractName: contract?.contractName,
        contractDescription: contract?.contractDescription,
        sampleFile: contract?.sampleFile,
        totalSalary: contract?.totalSalary,
        isActive: contract?.isActive,
        createAt: contract?.createAt,
        endDate: contract?.endDate,
        startDate: contract?.startDate,
        signingDate: contract?.signingDate,
        accountContracts: contract?.accountContracts
        // ...
    }));
    const fetchContractList = async () => {
        await dispatch(getContractList({
            page: page,
            PageSize: pageSize,
            Sort: sortModel?.Sort,
            Order: sortModel?.Order,
        }))
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
        fetchContractList,
        setCurrentRow,
        setShowDetail
    }
    const props = {
        columns,
        contractAPI,
        pageSizeOptions,
        total,
        page,
        pageSize,
        rows,
        isLoading,
        openAddContractModal,
        rowsExpanded,
        collabList,
        contractId,
        addCollabModal,
        showDetail,
        currentRow
    }
    return {
        handler,
        props,
        expandedRowRender
    }
}

export default useViewContractHook
