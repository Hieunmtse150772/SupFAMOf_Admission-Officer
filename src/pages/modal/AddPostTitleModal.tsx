import {
    ModalForm,
    ProForm,
    ProFormText
} from '@ant-design/pro-components';
import { unwrapResult } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useAppDispatch } from 'app/store';
import { createPostTitle } from 'features/postTitleSlice';
import PostTitleCreated from 'models/postTitle.model';
import { FC } from 'react';

interface AddPostTitleModalProps {
    open: boolean,
    setOpenAddTitleModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchPostTitleOption: () => void
}
const AddPostTitleModal: FC<AddPostTitleModalProps> = ({ open, setOpenAddTitleModal, fetchPostTitleOption }) => {
    console.log('con c', open)
    const dishpatch = useAppDispatch();

    const handleCreatePostTitle = async (value: any) => {
        const payload: PostTitleCreated = {
            postTitleDescription: value?.postTitleDescription,
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
                message.error(error);
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
                title="Add more position Title"
                open={open}
                onFinish={(value) => handleCreatePostTitle(value)}
                onOpenChange={setOpenAddTitleModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="postTitleType"
                        label="Post title type"
                        tooltip="Enter name of post title"
                        placeholder="Post title type"
                        rules={[{ required: true, message: 'Post title type is required!' }]}
                    />
                    <ProFormText
                        width="md"
                        name="postTitleDescription"
                        label="Description of post"
                        placeholder="Description"
                        rules={[{ required: true, message: 'Description is required!' }]}

                    />
                </ProForm.Group>
            </ModalForm>
        </>
    );
};

export default AddPostTitleModal;
