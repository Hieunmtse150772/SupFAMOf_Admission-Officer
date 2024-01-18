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
import { createDocument, deleteDocument, updateDocument } from 'features/documentSlice';
import DocumentCreated from 'models/document.model';
import DocumentOptionI from 'models/documentOption.model';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import useSessionTimeOut from 'utils/useSessionTimeOut';
import { uploadDocs } from '../../firebase';

interface AddDocumentModalProps {
    open: boolean,
    setOpenAddDocumentModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchDocumentOption: () => void,
    data: DocumentOptionI[]
}

const AddDocumentModal: FC<AddDocumentModalProps> = ({ open, setOpenAddDocumentModal, fetchDocumentOption, data }) => {
    type DataItem = (typeof data)[number];
    const Formatter = 'YYYY-MM-DD'
    const [dataSource, setDataSource] = useState<DataItem[]>(data);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
    const [fileDocs, setfileDocs] = useState<any>('');
    const [fileDocsUpdate, setfileDocsUpdate] = useState<any>('');
    const [form] = ProForm.useForm();
    const { SessionTimeOut } = useSessionTimeOut();

    const dispatch = useAppDispatch();
    const handleDeleteDocument = async (id: any) => {
        const result = await dispatch(deleteDocument(id)).then((response) => {
            const result2 = unwrapResult(response);
            if (result2.status === 200) {
                fetchDocumentOption();
                message.success('Delete success!');
            } else if (result2.status === 401) {
                SessionTimeOut();
            }
        }
        ).catch((error) => {
            message.error(error);
        })
    }
    const handlerSaveChange = async (row: DataItem) => {
        try {
            const url = await uploadDocs(fileDocsUpdate, setLoading)
            const params = {
                docName: row.docName,
                docUrl: fileDocsUpdate === '' ? row.docUrl : url,
                documentId: row.id
            }
            await dispatch(updateDocument(params)).then((response: any) => {
                if (response?.payload?.data?.status?.success) {
                    message.success('Update certificate success!');
                    fetchDocumentOption();
                } else if (response?.payload?.statusCode === 401) {
                    SessionTimeOut();
                } else {
                    message.error(response?.payload?.message);
                }
            })
        } catch (error) {
            message.error('Update document fail!');
        }

    }
    useEffect(() => { }, [editingDocumentId])
    const handleCreateDocument = async (value: any) => {
        let result = false;
        try {
            setLoading(true);
            const url = await uploadDocs(fileDocs, setLoading)
            const payload: DocumentCreated = {
                docName: value?.documentName,
                docUrl: url
            }
            await dispatch(createDocument(payload)).then((response) => {
                const result2 = unwrapResult(response);
                if (result2.status === 200) {
                    fetchDocumentOption();
                    message.success('Add Document success!');
                    result = true;
                    setLoading(false);
                } else if (result2.status === 401) {
                    SessionTimeOut()
                };
            }
            ).catch((error) => {
                message.error(error);
                setLoading(false);
                result = false;
            })
        } catch (error) {
            message.error('Add documents fail!');
            result = false;
        }

        return result;
    }
    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            setTimeout(() => {
                setfileDocs(file);
                onSuccess();
            }, 2000);
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    const customRequest2 = async ({ file, onSuccess, onError }: any) => {
        try {
            setTimeout(() => {
                setfileDocsUpdate(file);
                onSuccess();
            }, 2000);
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    const handleRemoveDocs = () => {
        setfileDocs('')
    }
    useEffect(() => {
        setDataSource(data)
    }, [data])
    return (
        <>
            <Spin spinning={isLoading} tip="Loading...">
                <ModalForm
                    form={form}
                    title="Document management"
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
                        editable={{
                            onDelete: async (rows) => { handleDeleteDocument(rows) }, onCancel: async (rows) => {
                                setEditingDocumentId(null);
                                setfileDocsUpdate('');
                                form.setFieldsValue({ uploadUpdate: null }); // Reset the value of uploadUpdate field to null
                                form.resetFields()
                            }, onSave: async (rows, row) => {
                                handlerSaveChange(row);
                                setEditingDocumentId(null)
                                setfileDocsUpdate('');
                                form.resetFields() // Reset the value of uploadUpdate field to null

                            },
                        }}

                        metas={{
                            title: {
                                dataIndex: 'docName',
                            },
                            description: {
                                dataIndex: 'docUrl',
                                render: (value, doc) => {
                                    const isEditing = doc.id === editingDocumentId; // Assume 'editingDocumentId' holds the ID of the currently edited document
                                    return isEditing ? (
                                        <ProForm.Group>
                                            <ProFormUploadButton
                                                name="uploadUpdate"
                                                label="Upload Document"
                                                max={1}
                                                fieldProps={{
                                                    name: 'add file',
                                                    customRequest: customRequest2
                                                }}
                                                title="Upload"
                                                width="md"
                                            />
                                        </ProForm.Group>
                                    ) : (
                                        <a href={doc.docUrl}>Document link</a>
                                    );
                                },
                                editable: false
                            },
                            content: {
                                dataIndex: 'createAt',
                                render: (rows, row) => (<span>{moment(row.createAt).format(Formatter)}</span>),
                                editable: false
                            },
                            subTitle: {
                                render: (rows, row) => {
                                    return (
                                        <Space size={0}>
                                            {row?.isActive ? <Tag color="blue">isActive</Tag> : <Tag color="red">inActive</Tag>}
                                        </Space>
                                    );
                                },
                                editable: false
                            },
                            actions: {
                                render: (text, row, index, action) => [
                                    <span
                                        onClick={() => {
                                            if (editingDocumentId === null) {
                                                setEditingDocumentId(row.id);
                                                action?.startEditable(row.id);
                                            } else {
                                                message.warning('Only one row can be edited at a time!');
                                            }
                                        }}
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
                                customRequest: customRequest,
                                onRemove: handleRemoveDocs
                            }}
                            title="Upload"
                            width="md"
                            required
                            rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]}
                        />

                    </ProForm.Group>
                </ModalForm>
            </Spin >
        </>
    );
};

export default AddDocumentModal;
