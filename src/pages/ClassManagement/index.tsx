import { PlusOutlined } from '@ant-design/icons';
import {
    ProList
} from '@ant-design/pro-components';
import ClassIcon from '@mui/icons-material/Class';
import { Button, Space, Tag } from 'antd';
import moment from 'moment';
import AddCertificateModal from 'pages/Modal/AddCertificateModal';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import './style.scss';
import useViewCertificate from './useViewCertificate';
function ClassManagement() {
    const navigate = useNavigate()
    const { props, handler } = useViewCertificate()
    type DataItem = (typeof props.certificateList)[number];
    const hanldeClickViewClass = (id: any) => {
        console.log('id: ', id)
        navigate(`/dashboard/class-list/${id}`)
    }
    const DateRow = props.certificateList.map((item) => {
        // Tạo một bản sao của item từ certificateList
        const newItem = { ...item };
        // Thêm trường actions vào newItem
        newItem.actions = [
            <a key="run" onClick={() => { hanldeClickViewClass(item.id) }}>View Class</a>,
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
                pagination={{
                    defaultPageSize: 8,
                    showSizeChanger: false,
                }}
                toolbar={{
                    search: {
                        placeholder: 'Enter certificate name'
                    },
                    actions: [<Button
                        color='primary'
                        onClick={handler.onOpenAddCertificateModal}>
                        <PlusOutlined rev={undefined} />
                        Add certificate
                    </Button>],

                }}
                showActions="hover"
                grid={{ gutter: 20, column: 4 }}
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
                            console.log('row: ', row.certificateName)
                            return (
                                <>{row.certificateName}</>
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
                />
            }

        </div >
    )
}

export default ClassManagement;
