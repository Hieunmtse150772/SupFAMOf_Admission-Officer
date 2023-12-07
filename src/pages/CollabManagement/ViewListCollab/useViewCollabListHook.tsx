import { EditOutlined, LockOutlined, MoreOutlined, UnlockOutlined } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Box } from "@mui/material";
import { Avatar, Badge, Button, Dropdown, MenuProps, Modal, Space, Tag } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getCertificate } from "features/certificateSlice";
import { getCollabList } from "features/collabSlice";
import { handleDownloadReport } from "features/reportSlice";
import { Certificate } from "models/collabListInfo.model";
import { useEffect, useState } from "react";

const useViewCollablistHook = () => {
    const Formatter = 'DD/MM/YYYY'
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [openCertificateModal, setOpenCertificateModal] = useState<boolean>(false)
    const [certificateList, setCertificateList] = useState<Certificate[]>([])
    const { collabList, loading } = useAppSelector(state => state.collab);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = collabList?.metadata?.total;
    const [totalCollab, setTotalCollab] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const excelFile = useAppSelector(state => state.report.excelFile);
    const option = [{ label: 'true', value: true }, { label: 'false', value: false }];
    const [openDisableAccountModal, setOpendisableAccountModal] = useState<boolean>(false);
    const [openUnbanAccountModal, setOpenUnbanAccountModal] = useState<boolean>(false);
    const [accountId, setAccountId] = useState<string>()
    const [accountIdBan, setAccountIdBan] = useState<number>();
    const [accountName, setAccountName] = useState<string>();
    const [openExportModal, setOpenExportModal] = useState<boolean>(false);
    const [nameFileExport, setNameFileExport] = useState<string>('false');
    const certificateOptionsAPI = useAppSelector(state => state.certificate.certificateOption)
    const certificateOptions = certificateOptionsAPI?.map((title) => ({
        id: title.id,
        value: title.id,
        label: title.certificateName
    }));
    const { confirm } = Modal;
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
            title: 'Certificates',
            dataIndex: 'certificates',
            hideInSearch: true,
            key: 'certificates',
            render: (certificates) => {
                if (Array.isArray(certificates)) {
                    const filtercertificate = certificates.filter((certificate) => certificate.status === 1)
                    if (filtercertificate.length !== 0) {
                        return filtercertificate.map((certificate) =>
                        (
                            <Space size={0} key={certificate.id}>
                                <Tag color="green">{certificate?.certificateName}</Tag>
                            </Space>
                        )
                        );
                    } else return <Space size={0}>
                        <Tag color="red">No certificate</Tag>
                    </Space>
                } else {
                    <Tag color="red">No certificate</Tag>
                    // Handle the case when certificates is not an array
                    return null; // or you can return an appropriate message or component
                }
            }
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            hideInSearch: true,
            key: 'isActive',
            render: (value, valueEnum) => {
                if (valueEnum.isActive === true) {
                    return <Tag color="blue">Is Active</Tag>
                } else return <Tag color="red">InActive</Tag>
            }
        },
        {
            title: 'Ban',
            dataIndex: 'isBanned',
            hideInSearch: true,
            key: 'isBanned',
            render: (value, valueEnum) => {
                if (valueEnum.isBanned === true) {
                    return <Tag color="red">Banned</Tag>
                } else return <Tag color="blue">Unbanned</Tag>
            }
        },
        {
            title: 'Action',
            width: 100,
            align: 'center',
            hideInSearch: true,
            dataIndex: ['isActive'],
            valueEnum: {
                1: {
                    text: 'Is active',
                    status: 'Pending',
                },
                2: {
                    text: 'Banned',
                    status: 'Banned',
                },
            },
            render: (value, valueEnum, record) => {
                const totalUpdateRegisterAmount = valueEnum?.totalUpdateRegisterAmount; // Access totalUpdateRegisterAmount from record
                console.log('valueEnum.isActive: ', valueEnum.isActive)
                const items: MenuProps['items'] = [
                    {
                        label: 'Ban account',
                        key: '1',
                        icon: <LockOutlined rev={undefined} />,
                        onClick: () => handleOpenDisableAccountModal(valueEnum),
                        disabled: Boolean(valueEnum.isBanned === true),
                        danger: true
                    },
                    {
                        label: 'Unban',
                        key: '2',
                        icon: <UnlockOutlined rev={undefined} />,
                        onClick: () => handleOpenUnBanAccountModal(valueEnum),
                        disabled: Boolean(valueEnum.isBanned === false),
                    },
                    {
                        label: 'Edit certificate',
                        key: '3',
                        icon: <EditOutlined rev={undefined} />,
                        onClick: () => handleOpenCertificateModal(valueEnum),
                    },
                ];
                const menuProps = {
                    items,
                };
                return <Badge count={totalUpdateRegisterAmount}><Box>
                    <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
                        <Button icon={<MoreOutlined rev={undefined} />}></Button>
                    </Dropdown>
                </Box>
                </Badge>
            },
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
    const handleSearch = (value: any) => {

    }
    const handleOpenExportExcel = (name: string) => {
        setNameFileExport(name);
        setOpenExportModal(true);
    }
    const handleExportAccountReportExcel = async () => {
        await dispatch(handleDownloadReport())
    }

    const handleOpenCertificateModal = (value: any) => {
        console.log('value: ', value)
        setAccountId(value?.key);
        setCertificateList(value?.certificates);
        setOpenCertificateModal(true);
    }

    const handleOpenUnBanAccountModal = async (value: any) => {
        console.log('value:', value)
        setAccountIdBan(value?.key);
        setAccountName(value?.name);
        setOpenUnbanAccountModal(true);
    }
    const handleOpenDisableAccountModal = async (value: any) => {
        console.log('value:', value)
        setAccountIdBan(value?.key);
        setAccountName(value?.name);
        setOpendisableAccountModal(true);
    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        console.log('sorter: ', params);
        if (params) {
            await dispatch(getCollabList(params))
        }
        return {
            data: [],
            success: true, // Set to true if the request was successful
            total: 10, // Total number of data items (if available)
        };
    }
    const rows = collabList?.data.map(collab => ({
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
        branch: collab?.branch,
        certificates: collab?.certificates,
        isActive: collab.isActive,
        endTime: collab.endTime,
        isBanned: collab.isBanned,
        startTime: collab.startTime
        // ...
    }));
    const fetchCollabList = async () => {
        await dispatch(getCollabList({ page: page, PageSize: pageSize }))
    }
    const downloadExcelFile = () => {
        if (excelFile) {
            const url = window.URL.createObjectURL(excelFile);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'account_report.xlsx');
            document.body.appendChild(link);
            link.click();
            // Kiểm tra xem link có được chèn vào DOM hay không trước khi loại bỏ
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }
    };
    const fetchCertificateOption = async () => {
        const result = await dispatch(getCertificate());
    }
    useEffect(() => {
        fetchCertificateOption();
    }, [])
    useEffect(() => {
        fetchCollabList()
    }, [page, pageSize])
    // useEffect(() => {
    //     if (excelFile) {
    //         const url = window.URL.createObjectURL(excelFile);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'account_report.xlsx');
    //         document.body.appendChild(link);
    //         link.click();
    //         // Kiểm tra xem link có được chèn vào DOM hay không trước khi loại bỏ
    //         if (link.parentNode) {
    //             link.parentNode.removeChild(link);
    //         }
    //     }
    // }, [excelFile]);

    const handler = {
        onPageChange,
        handleExportAccountReportExcel,
        onChangePageSize,
        setCurrentRow,
        setShowDetail,
        setOpenCertificateModal,
        handleActionChange,
        handleSearch,
        downloadExcelFile,
        setOpendisableAccountModal,
        handleOpenDisableAccountModal,
        setOpenUnbanAccountModal,
        handleOpenExportExcel,
        setOpenExportModal,
        fetchCollabList
    }
    const props = {
        columns,
        collabList,
        pageSizeOptions,
        total,
        page,
        pageSize,
        rows,
        loading,
        showDetail,
        currentRow,
        openCertificateModal,
        certificateList,
        excelFile,
        openDisableAccountModal,
        accountIdBan,
        accountName,
        openUnbanAccountModal,
        openExportModal,
        nameFileExport,
        certificateOptions,
        accountId
    }
    return {
        handler,
        props,
    }
}

export default useViewCollablistHook
