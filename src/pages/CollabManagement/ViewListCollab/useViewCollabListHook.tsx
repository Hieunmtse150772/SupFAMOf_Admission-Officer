import { ProColumns } from "@ant-design/pro-components";
import { Avatar, Space, Tag } from "antd";
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
    const option = [{ label: 'true', value: true }, { label: 'false', value: false }]
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
            hideInSearch: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Is Premium',
            dataIndex: 'isPremium',
            key: 'isPremium',
            sorter: true,
            filterDropdown: { filters: option },
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
            key: 'certificates',
            render: (certificates) => {
                console.log('Certificate: ', certificates)
                if (Array.isArray(certificates)) {
                    if (certificates.length !== 0) {
                        return certificates.map((certificate) => (
                            <Space size={0} key={certificate.id}>
                                <Tag color="green">{certificate?.certificateName}</Tag>
                            </Space>
                        ));
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
        branch: collab?.branch,
        certificates: collab?.certificates
        // ...
    }));
    const fetchCollabList = async () => {
        await dispatch(getCollabList())
    }

    useEffect(() => {
        fetchCollabList()
    }, [page, pageSize])
    const handler = { onPageChange, onChangePageSize, setCurrentRow, setShowDetail }
    const props = { columns, collabAPI, pageSizeOptions, total, page, pageSize, rows, isLoading, showDetail, currentRow }
    return {
        handler,
        props,
    }
}

export default useViewCollablistHook
