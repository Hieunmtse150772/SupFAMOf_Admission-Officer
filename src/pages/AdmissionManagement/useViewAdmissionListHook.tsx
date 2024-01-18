import { ExclamationCircleFilled, KeyOutlined, LockOutlined, MoreOutlined } from "@ant-design/icons";
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { Box } from "@mui/material";
import { Avatar, Button, Dropdown, MenuProps, Modal, Tag, message } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { disablePermission, getAdmission, updatePermission } from "features/admissionSlice";
import AdmissionInfo from "models/admission.model";
import { useEffect, useState } from "react";
import useSessionTimeOut from "utils/useSessionTimeOut";

type SearchParamsI = {
    email: string,
    name: string
}
function useViewAdmissionListHook() {
    const dispatch = useAppDispatch();
    const admissionList = useAppSelector(state => state.admission.admissionList);
    const loading = useAppSelector(state => state.admission.loading);
    const { SessionTimeOut } = useSessionTimeOut();
    const [searchParams, setSearchParams] = useState<SearchParamsI>();
    const [currentRow, setCurrentRow] = useState<any>();
    // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = admissionList?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);

    const { confirm } = Modal;
    const columns: ProColumns[] = [
        {
            title: '',
            dataIndex: 'count',
            key: 'count',
            hideInSearch: true,
            fixed: 'left',
            valueType: 'index',
            width: 50
        },
        {
            title: 'Avatar',
            dataIndex: 'imgUrl',
            key: 'imgUrl',
            hideInSearch: true,
            fixed: 'left',
            width: 70,
            render: (dom, entity) => {
                console.log('entity: ', entity)
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
            fixed: 'left',
            width: 120,
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
            width: 150,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            hideInSearch: true,
            width: 50,
            key: 'isActive',
            render: (value, valueEnum) => {
                if (valueEnum.isActive === true) {
                    return <Tag color="blue">Active</Tag>
                } else return <Tag color="red">InActive</Tag>
            }
        },
        {
            title: 'Permission post',
            dataIndex: 'postPermission',
            hideInSearch: true,
            width: 100,
            key: 'postPermission',
            render: (value, valueEnum) => {
                if (valueEnum.postPermission === true) {
                    return <Tag color="blue">Have permission</Tag>
                } else return <Tag color="red">No permission</Tag>
            }
        },
        {
            title: 'Action',
            width: 70,
            fixed: 'right',
            align: 'center',
            key: 'action',
            hideInSearch: true,
            dataIndex: ['isActive'],
            render: (value, valueEnum, record) => {
                const premiumTitle = `${valueEnum?.postPermission ? 'Lock permission' : 'Unlock premium'}`
                const items: MenuProps['items'] = [
                    {
                        label: premiumTitle,
                        key: '1',
                        icon: valueEnum?.postPermission ? <KeyOutlined rev={undefined} /> : <LockOutlined rev={undefined} />,
                        onClick: () => handleUpdatePermission(valueEnum),
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
    const onPageChange = (value: any) => {
        setPage(value)
    }
    const onChangePageSize = (value: any) => {
        console.log('pagesize: ', value)
        setPageSize(value)
    }
    const handleSearch = async (value: SearchParamsI) => {
    }

    const handleUpdatePermission = async (value: AdmissionInfo) => {
        console.log('value: ', value)
        const titleConfirm = value.postPermission ? 'Remove permission' : 'Update permission'
        confirm({
            title: `Do you want ${titleConfirm} for ${value?.name}?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                if (value.postPermission) {
                    dispatch(disablePermission(value?.key)).then((response: any) => {
                        if (response?.payload?.status === 200) {
                            message.success("Successfully removed permission");
                            fetchAdmissionList();
                        } else {
                            message.error(response?.payload?.message);
                        }
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                } else {
                    dispatch(updatePermission(value?.key)).then((response: any) => {
                        if (response?.payload?.status === 200) {
                            message.success("Successfully update permission");
                            fetchAdmissionList();
                        } else {
                            message.error(response?.payload?.message);
                        }
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                }

            },
            onCancel() {
            },
        });


    }
    const handleActionChange = async (params: any,
        sorter: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
        // await dispatch(getCollabList({}))
        return {
            data: [],
            success: true, // Set to true if the request was successful
            total: 10, // Total number of data items (if available)
        };
    }
    const rows = admissionList.data.map((admission, index) => ({
        count: index,
        key: admission?.id,
        name: admission?.name,
        email: admission?.email,
        phone: admission?.phone,
        imgUrl: admission?.imgUrl,
        isActive: admission?.isActive,
        postPermission: admission?.postPermission
        // ...
    }));
    const fetchAdmissionList = async () => {
        await dispatch(getAdmission({ email: searchParams?.email, name: searchParams?.name })).then((response: any) => {
            if (response?.payload?.status === 200) {

            } else if (response?.payload?.status === 401) {
                SessionTimeOut();
            } else {
                message.error('Server internal error, please try again!');
            }
        }).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }
    useEffect(() => {
        fetchAdmissionList();
    }, [])
    const handler = {
        handleSearch,
        handleActionChange,
        onPageChange,
        onChangePageSize
    }
    const props = {
        admissionList,
        pageSizeOptions,
        page,
        rows,
        columns,
        loading,
        total,
        pageSize,
    }
    return {
        handler, props
    }
}

export default useViewAdmissionListHook
