import { PlusOutlined } from '@ant-design/icons';
import {
    ProList
} from '@ant-design/pro-components';
import { ClassOutlined } from '@mui/icons-material';
import ClassIcon from '@mui/icons-material/Class';
import { Badge, Button, Card, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import AddCertificateModal from 'pages/Modal/AddCertificateModal';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import './style.scss';
import useViewCertificate from './useViewCertificate';
function ClassManagement() {
    const navigate = useNavigate()
    const { props, handler } = useViewCertificate()
    type DataItem = (typeof props.certificateRegistrationList.data)[number];
    const hanldeClickViewClass = (id: any) => {
        console.log('id: ', id)
        navigate(`/dashboard/certificate-list/${id}`)
    }
    const DateRow = props.certificateRegistrationList.data.map((item) => {
        // Tạo một bản sao của item từ certificateList
        const newItem = { ...item };
        // Thêm trường actions vào newItem
        newItem.actions = [
            <a key="run" onClick={() => { hanldeClickViewClass(item.id) }}>View Registration</a>,
            <a key="delete">Delete</a>
        ];
        newItem.avatar = <ClassIcon color='success' />;
        // Trả về phần tử với các trường ban đầu và trường actions mới thêm vào
        return newItem;
    });


    const [cardActionProps, setCardActionProps] = useState<'actions' | 'extra'>(
        'actions',
    );
    return (
        <div
            style={{
                backgroundColor: '#eee',
                margin: -24,
                padding: 24,
            }}
        >
            <ProList<DataItem>
                loading={props.loading}
                pagination={{
                    showSizeChanger: true,
                    onChange(page, pageSize) {
                        handler.setPage(page);
                        handler.setPageSize(pageSize);
                    },
                    pageSizeOptions: props.pageSizeOptions,
                    defaultPageSize: 5,
                    total: props.total
                }}
                toolbar={{
                    search: {
                        placeholder: 'Enter certificate name',
                        onSearch: (value) => handler.handleSearch(value)
                    },
                    actions: [<Button
                        color='primary'
                        onClick={handler.onOpenAddCertificateModal}>
                        <PlusOutlined rev={undefined} />
                        Add certificate
                    </Button>],

                }}
                renderItem={(listDom, action) => (
                    <Tooltip title='Click to view registration list' placement="top" key={listDom.id}>

                        <div style={{ margin: '10px' }} onClick={() => hanldeClickViewClass(listDom?.id)}>
                            <Badge.Ribbon color='green' text={`Total registration: ${listDom?.registerAmount}`}>
                                <Card title={<div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ClassOutlined style={{ color: 'green' }} /> {listDom?.certificateName}
                                </div>} size="small">
                                    <Tag color='cyan' style={{ fontWeight: 700 }}>{moment(listDom.createAt).format('DD/MM/YY')}</Tag>
                                </Card>
                            </Badge.Ribbon>
                        </div>
                    </Tooltip>


                )}
                showActions="hover"
                onItem={(record: any) => {
                    return {
                        onMouseEnter: () => {
                            console.log(record);
                        },
                        onClick: () => {
                            console.log(record);
                        },
                    };
                }}
                metas={{
                    id: {
                        dataIndex: 'id'
                    },
                    avatar: {
                        dataIndex: 'avatar'
                    },
                    title: {
                        dataIndex: 'certificateName',
                        search: false,
                        render: (text, row, index, action) => {
                            return (
                                <>{row?.certificateName}</>
                            )
                        }
                    },
                    content: {
                        dataIndex: 'registerAmount',
                        title: 'Register amount',
                        search: false,
                        render: (text, row, index, action) => {
                            return (
                                <>Register amount: {row.registerAmount}</>
                            )
                        }
                    },
                    subTitle: {
                        dataIndex: 'createAt',
                        valueType: 'date',
                        render: (text, row, index, action) => (
                            console.log('row', row),
                            row?.isActive ? (
                                <Space size={0}>
                                    <Tag color="blue">Is active</Tag>
                                    <Tag style={{ position: 'absolute', top: 0, right: -8, fontWeight: 700 }} color='cyan'>{moment(row.createAt).format('DD/MM/YY')}</Tag>
                                </Space>
                            ) : (
                                <Space size={0}>
                                    <Tag color="red">Inactive</Tag>
                                </Space>
                            )

                        ),
                        search: false
                    },
                    actions: {
                        cardActionProps,
                    },
                }}
                headerTitle="Certificate"
                dataSource={DateRow}
            />
            {
                props.openAddCertificateModal &&
                <AddCertificateModal
                    fetchCertificateOption={handler.fetchCertificate}
                    setOpenCertificateModal={handler.setOpenAddCertificateModal}
                    open={props.openAddCertificateModal}
                    data={props.certificateList}
                    fetchCertificateRegistration={handler.fetchCertificateRegistration}
                />
            }

        </div >
    )
}

export default ClassManagement;
