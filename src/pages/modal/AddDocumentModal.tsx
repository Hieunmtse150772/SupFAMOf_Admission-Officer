import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormUploadButton,
    ProList
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Space, Spin, Tag, message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createDocument, deleteDocument } from 'features/documentSlice';
import DocumentCreated from 'models/document.model';
import DocumentOptionI from 'models/documentOption.model';
import { FC, useState } from 'react';
import { upload } from '../../firebase';

interface AddDocumentModalProps {
    open: boolean,
    setOpenAddDocumentModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchDocumentOption: () => void,
    data: DocumentOptionI[]
}

const AddDocumentModal: FC<AddDocumentModalProps> = ({ open, setOpenAddDocumentModal, fetchDocumentOption, data }) => {
    type DataItem = (typeof data)[number];

    const [dataSource, setDataSource] = useState<DataItem[]>(data);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const dispatch = useAppDispatch();
    const handleDeleteDocument = async (id: any) => {
        const result = await dispatch(deleteDocument(id)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                fetchDocumentOption();
                message.success('Delete success!');
            }
        }
        ).catch((error) => {
            console.log('error: ', error)
            message.error(error);
        })
    }
    const handleCreateDocument = async (value: any) => {
        console.log('value: ', value)

        const payload: DocumentCreated = {
            docName: value?.documentName,
            docUrl: url
        }
        let result = false;
        try {
            await dispatch(createDocument(payload)).then((response) => {
                console.log('response111: ', response.meta.requestStatus)
                const result2 = unwrapResult(response);
                console.log('first: ', result2)
                if (result2.status === 200) {
                    fetchDocumentOption();
                    message.success('Add Document success!');
                    result = true;
                }
            }
            ).catch((error) => {
                console.log('error: ', error)
                message.error(error);
                result = false;
            })
        } catch (error) {
            message.error('Add position title fail!');
            result = false;
        }

        return result;
    }
    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            await upload(file, setLoading, setUrl); // Gọi hàm upload của bạn
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    return (
        <>
            <Spin spinning={isLoading} tip="Loading...">
                <ModalForm
                    title="Document Management"
                    open={open}
                    onFinish={(value) => handleCreateDocument(value)}
                    onOpenChange={setOpenAddDocumentModal}
                    submitter={{
                        searchConfig: {
                            submitText: 'Submit',
                            resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                        }
                    }}
                    width={1000}>
                    <ProList<DataItem>
                        rowKey="id"
                        headerTitle="List Document"
                        dataSource={dataSource}
                        editable={{ onDelete: async (rows) => { handleDeleteDocument(rows) } }}
                        metas={{
                            title: {
                                dataIndex: 'docName',
                                editable: false
                            },
                            description: {
                                dataIndex: 'docUrl',
                                editable: false,
                                render: (value, doc) => (<a href={doc.docUrl}>
                                    {value}
                                </a>)
                            },
                            content: {
                                dataIndex: 'createAt',
                                editable: false
                            },
                            subTitle: {
                                render: (rows, row) => {
                                    return (
                                        <Space size={0}>
                                            {row?.isActive ? <Tag color="blue">isActive</Tag> : <Tag color="red">unActive</Tag>}
                                        </Space>
                                    );
                                },
                            },
                            actions: {
                                render: (text, row, index, action) => [
                                    <span
                                        onClick={() => {
                                            action?.startEditable(row.id);
                                        }}
                                        key="link"
                                    >
                                        Edit
                                    </span>,
                                ],
                            },
                        }}
                        pagination={{
                            pageSize: 5,
                        }}
                    // rowSelection={rowSelection}

                    ></ProList>
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="documentName"
                            label="Document name"
                            placeholder="Document name"
                            tooltip="Enter name of post title"
                            rules={[{ required: true, message: 'Category name is required!' }]}

                        />
                        <ProFormUploadButton
                            name="upload"
                            label="Upload Document"
                            max={1}
                            fieldProps={{
                                name: 'add file',
                                customRequest: customRequest
                            }}
                            title="Upload"
                            width="md"
                            required
                            rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]}
                        />

                    </ProForm.Group>
                </ModalForm>
            </Spin>
        </>
    );
};

export default AddDocumentModal;
