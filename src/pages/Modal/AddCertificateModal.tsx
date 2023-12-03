import {
    ModalForm,
    ProForm,
    ProFormText,
    ProList
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Space, Tag, message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createCertificate, deleteCertificate, updateCertificate } from 'features/certificateSlice';
import CertificateCreated from 'models/certificate.model';
import CertificateOptionI from 'models/certificateOption.model';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';

interface AddCertificateModalProps {
    open: boolean,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchCertificateOption: () => void,
    data: CertificateOptionI[]
}
const AddCertificateModal: FC<AddCertificateModalProps> = ({ open, setOpenCertificateModal, fetchCertificateOption, data }) => {
    const Formatter = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    type DataItem = (typeof data)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(data);
    const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);

    const handleCreatePostTitle = async (value: any) => {
        const payload: CertificateCreated = {
            trainingTypeId: value?.trainingTypeId,
            certificateName: value?.certificateName,
        }
        let result = false;
        try {
            await dispatch(createCertificate(payload)).then((response) => {
                const result2 = unwrapResult(response);
                if (result2.status === 200) {
                    fetchCertificateOption();
                    message.success('Add certificate success!');
                    result = true;
                }
            }
            ).catch((error) => {
                message.error(error);
                result = false;
            })
        } catch (error) {
            message.error('Add certificate fail!');
            result = false;
        }

        return result;
    }
    const handleDeleteCertificate = async (row: DataItem) => {
        const result = await dispatch(deleteCertificate(row.id))
        const response = unwrapResult(result)
        if (response.data.status?.success) {
            message.success(response.data.status?.message);
        } else {
            message.error(response.data.status?.message);
        }
    }
    const handlerSaveChange = async (row: DataItem) => {
        const params = {
            trainingTypeId: row.trainingTypeId,
            certificateName: row.certificateName,
            trainingCertificateId: row?.id
        }
        await dispatch(updateCertificate(params)).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Update certificate success!');
                fetchCertificateOption();
            } else {
                message.error(response?.payload?.message)
            }
        })
    }
    useEffect(() => {
        setDataSource(data)
    }, [data])
    return (
        <>
            <ModalForm
                title="Add more post category"
                open={open}
                onFinish={(value) => handleCreatePostTitle(value)}
                onOpenChange={setOpenCertificateModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={1000}
            >
                <ProList<DataItem>
                    rowKey="id"
                    headerTitle="List Certificate"
                    dataSource={dataSource}
                    editable={{
                        onDelete: async (rows, row) => {
                            setEditingDocumentId(null);
                            handleDeleteCertificate(row);
                        },
                        onSave: async (rows, row) => {
                            setEditingDocumentId(null);
                            handlerSaveChange(row);
                        },
                        onCancel: async (rows) => {
                            setEditingDocumentId(null);
                        },
                    }}
                    metas={{
                        title: {
                            dataIndex: 'certificateName',
                        },
                        description: {
                            dataIndex: 'trainingTypeId',
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
                        name="certificateName"
                        label="Certificate Name"
                        placeholder="Certificate name"
                        tooltip="Enter name of post title"
                        rules={[{ required: true, message: 'Category name is required!' }]}

                    />
                    <ProFormText
                        width="md"
                        name="trainingTypeId"
                        label="Certificate ID"
                        placeholder="Post category ID"
                        rules={[{ required: true, message: 'Post category ID is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default AddCertificateModal;
