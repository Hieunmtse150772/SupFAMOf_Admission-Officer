import {
    ModalForm,
    ProForm,
    ProFormText,
    ProList
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Space, Tag, message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createCertificate } from 'features/certificateSlice';
import CertificateCreated from 'models/certificate.model';
import CertificateOptionI from 'models/certificateOption.model';
import { FC, useState } from 'react';

interface AddCertificateModalProps {
    open: boolean,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchCertificateOption: () => void,
    data: CertificateOptionI[]
}
const AddCertificateModal: FC<AddCertificateModalProps> = ({ open, setOpenCertificateModal, fetchCertificateOption, data }) => {
    console.log('con c', open)
    const dispatch = useAppDispatch();
    type DataItem = (typeof data)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(data);


    const handleCreatePostTitle = async (value: any) => {
        const payload: CertificateCreated = {
            trainingTypeId: value?.postTitleDescription,
            certificateName: value?.postTitleType
        }
        let result = false;
        try {
            await dispatch(createCertificate(payload)).then((response) => {
                console.log('response111: ', response.meta.requestStatus)
                const result2 = unwrapResult(response);
                console.log('first: ', result2)
                if (result2.status === 200) {
                    fetchCertificateOption();
                    message.success('Add certificate success!');
                    result = true;
                }
            }
            ).catch((error) => {
                console.log('error: ', error)
                message.error(error);
                result = false;
            })
        } catch (error) {
            message.error('Add certificate fail!');
            result = false;
        }

        return result;
    }

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
                    headerTitle="List Document"
                    dataSource={dataSource}
                    // editable={{ onDelete: async (rows) => { handleDeleteDocument(rows) } }}
                    metas={{
                        title: {
                            dataIndex: 'certificateName',
                            editable: false
                        },
                        description: {
                            dataIndex: 'trainingTypeId',
                            editable: false
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
