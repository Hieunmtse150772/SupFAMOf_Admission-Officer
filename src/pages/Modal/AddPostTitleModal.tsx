import {
    ModalForm,
    ProForm,
    ProFormText,
    ProList
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { Space, Tag, message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createPostTitle } from 'features/postTitleSlice';
import PostOptionI from 'models/postOption.model';
import PostTitleCreated from 'models/postTitle.model';
import { FC, useState } from 'react';

interface AddPostTitleModalProps {
    open: boolean,
    setOpenAddTitleModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchPostTitleOption: () => void,
    data: PostOptionI[],
}
const AddPostTitleModal: FC<AddPostTitleModalProps> = ({ open, setOpenAddTitleModal, fetchPostTitleOption, data }) => {
    console.log('con c', open)
    const dishpatch = useAppDispatch();
    type DataItem = (typeof data)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(data);

    const handleCreatePostTitle = async (value: any) => {
        const payload: PostTitleCreated = {
            PostTitleDescription: value?.postTitleDescription,
            postTitleType: value?.postTitleType
        }
        let result = false;
        try {
            await dishpatch(createPostTitle(payload)).then((response) => {
                console.log('response111: ', response.meta.requestStatus)
                const result2 = unwrapResult(response);
                console.log('first: ', result2)
                if (result2.status === 200) {
                    fetchPostTitleOption();
                    message.success('Add position title success!');
                    result = true;
                }
            }
            ).catch((error) => {
                console.log('error: ', error)
                message.error('Server internal error');
                result = false;
            })
        } catch (error) {
            message.error('Add position title fail!');
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
                    headerTitle="List Document"
                    dataSource={dataSource}
                    // editable={{ onDelete: async (rows) => { handleDeleteDocument(rows) } }}
                    metas={{
                        title: {
                            dataIndex: 'postCategoryDescription',
                            editable: false
                        },
                        description: {
                            dataIndex: 'postCategoryType',
                            editable: false,
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
