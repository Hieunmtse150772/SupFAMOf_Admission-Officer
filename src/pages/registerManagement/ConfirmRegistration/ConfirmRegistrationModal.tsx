import { ModalForm, ProList } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import CollabInfo from "models/collab.model";
import { FC, Key, useState } from "react";

interface ConfirmRegistrationModalProps {
    open: boolean,
    setOpenConfirmModal: React.Dispatch<React.SetStateAction<boolean>>,
    listCollab: CollabInfo[]
}
const ConfirmRegistrationModal: FC<ConfirmRegistrationModalProps> = ({ listCollab, open, setOpenConfirmModal }) => {
    type DataItem = (typeof listCollab)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(listCollab);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => setSelectedRowKeys(keys),
    };

    return (
        <ModalForm
            width={1190}
            title={'Confirm position'}
            open={open}
            // onFinish={(value) => handler.handleUpdatePost(value)}
            onOpenChange={setOpenConfirmModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
        >
            <ProList<DataItem>
                rowKey="id"
                headerTitle="List Collab Register"
                dataSource={dataSource}
                metas={{
                    title: {
                        dataIndex: 'name',
                    },
                    avatar: {
                        dataIndex: 'imgUrl',
                        editable: false,
                    },
                    description: {
                        dataIndex: 'phone',
                    },
                    content: {
                        dataIndex: 'email',
                    },
                    subTitle: {
                        render: () => {
                            return (
                                <Space size={0}>
                                    <Tag color="blue">IsPremium</Tag>
                                </Space>
                            );
                        },
                    },
                    actions: {
                        render: (text, row, index, action) => [
                            <a
                                onClick={() => {
                                    action?.startEditable(row.id);
                                }}
                                key="link"
                            >
                                编辑
                            </a>,
                        ],
                    },
                }}
                pagination={{
                    pageSize: 5,
                }}
                rowSelection={rowSelection}

            ></ProList>
        </ModalForm>
    )
}

export default ConfirmRegistrationModal;
