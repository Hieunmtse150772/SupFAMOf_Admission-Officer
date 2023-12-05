import {
    ModalForm,
    ProForm,
    ProFormText,
    ProList
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Space, Tag, message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createPostTitle, deletePostTitle, updatePostTitle } from 'features/postTitleSlice';
import PostOptionI from 'models/postOption.model';
import PostTitleCreated from 'models/postTitle.model';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';

interface AddPostTitleModalProps {
    open: boolean,
    setOpenAddTitleModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchPostTitleOption: () => void,
    data: PostOptionI[],
}
const AddPostTitleModal: FC<AddPostTitleModalProps> = ({ open, setOpenAddTitleModal, fetchPostTitleOption, data }) => {
    const Formatter = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    type DataItem = (typeof data)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(data);
    const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);

    const handleCreatePostTitle = async (value: any) => {
        const payload: PostTitleCreated = {
            postCategoryDescription: value?.postTitleDescription,
            postCategoryType: value?.postTitleType
        }
        let result = false;
        try {
            await dispatch(createPostTitle(payload)).then((response) => {
                const result2 = unwrapResult(response);
                if (result2.status === 200) {
                    fetchPostTitleOption();
                    message.success('Add position title success!');
                    result = true;
                }
            }
            ).catch((error) => {
                message.error('Server internal error');
                result = false;
            })
        } catch (error) {
            message.error('Add position title fail!');
            result = false;
        }

        return result;
    }
    const handleDeletPostTitle = async (row: DataItem) => {
        await dispatch(deletePostTitle(row.id)).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Update certificate success!');
                fetchPostTitleOption();
            } else {
                message.error(response?.payload?.message);
            }
        })
    }
    const handlerSaveChange = async (row: DataItem) => {
        const params = {
            postCategoryDescription: row.postCategoryDescription,
            postCategoryType: row.postCategoryType,
            postCategoryId: row.id
        }
        await dispatch(updatePostTitle(params)).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Update certificate success!');
                fetchPostTitleOption();
            } else {
                message.error(response?.payload?.message);
            }
        })
    }
    useEffect(() => {
        setDataSource(data)
    }, [data])
    return (
        <>
            <ModalForm
                title="Category management"
                open={open}
                onFinish={(value) => handleCreatePostTitle(value)}
                onOpenChange={setOpenAddTitleModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={1000}        >
                <ProList<DataItem>
                    rowKey="id"
                    headerTitle="List Category"
                    dataSource={dataSource}
                    editable={{
                        onDelete: async (rows, row) => {
                            handleDeletPostTitle(row)
                            setEditingDocumentId(null);
                        },
                        onSave: async (rows, row) => {
                            handlerSaveChange(row);
                            setEditingDocumentId(null);
                        },
                        onCancel: async () => {
                            setEditingDocumentId(null);
                        }
                    }}
                    metas={{
                        title: {
                            dataIndex: 'postCategoryDescription',
                        },
                        description: {
                            dataIndex: 'postCategoryType',
                        },
                        content: {
                            dataIndex: 'createAt',
                            render: (rows, row) => (<span>{moment(row.creatAt).format(Formatter)}</span>),
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
                        name="postTitleDescription"
                        label="Post category name"
                        placeholder="Category name"
                        tooltip="Enter name of post title"
                        rules={[{ required: true, message: 'Category name is required!' }]}

                    />
                    <ProFormText
                        width="md"
                        name="postTitleType"
                        label="Post category ID"
                        placeholder="Post category ID"
                        rules={[{ required: true, message: 'Post category ID is required!' }]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default AddPostTitleModal;
