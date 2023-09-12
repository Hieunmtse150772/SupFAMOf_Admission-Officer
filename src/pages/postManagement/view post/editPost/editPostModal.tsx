import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTextArea, ProFormTimePicker } from "@ant-design/pro-components";
import Post from "models/post.model";
import { FC, useState } from "react";
import UseEditPostModal from "./useEditPostModal";

interface EditPostModalProps {
    open: boolean,
    setOpenEditPostModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: string,
    postInfo: Post,
}
const EditPostModal: FC<EditPostModalProps> = ({ open, setOpenEditPostModal, postId, postInfo }) => {
    console.log('post information: ', postInfo?.account?.email)
    const { handler, props } = UseEditPostModal();
    // const { postInfo } = props;
    const handleCreatePostTitle = async (value: any) => {
        console.log(value)
    }
    // useEffect(() => {
    //     handler.fetchPost(postId)
    // }, [])
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

    return (
        <ModalForm
            width={1190}
            title={`Edit post ${postInfo?.postCode}`}
            open={open}
            onFinish={(value) => handleCreatePostTitle(value)}
            onOpenChange={setOpenEditPostModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
        >
            <ProForm.Group>
                <ProFormSelect
                    width="xl"
                    options={props.options}
                    name="postDescription"
                    initialValue={postInfo?.postTitle}
                    debounceTime={5}
                    label="Post Title"
                    tooltip="Chose one options of post title"
                    rules={[{ required: true, message: 'Chose one options of post title!' }]}

                />
                <ProFormDateRangePicker
                    name="dateFrom-dateTo"
                    label="Date From - To"
                    width='xl'
                    rules={[{ required: true, message: 'Chose date from & date to!' }]}
                />

                <ProFormTextArea
                    name="description"
                    label="Description"
                    width="xl"
                    placeholder="Description"
                    initialValue={postInfo?.postDescription}
                    rules={[{ required: true, message: 'Description is required!' }]}
                />
                <ProFormTimePicker.RangePicker
                    name="timeFrom-timeTo"
                    label="TimeForm-To"
                    width='xl'
                    rules={[{ required: true, message: 'Chose time from & time to!' }]} />
                <ProFormText
                    name="location"
                    label="Location"
                    width="xl"
                    initialValue={postInfo?.location}
                    placeholder="Location"
                    rules={[{ required: true, message: 'Location is required!' }]} />
                <ProFormSlider
                    name="piority"
                    label="Piority 1-5"
                    width="lg"
                    placeholder="Piority"
                    initialValue={postInfo?.priority}
                    rules={[{ required: true, message: 'Piority is required!' }]}
                    max={5}
                />
                <ProFormSwitch name="isPremium" label="Is Premium show" />
            </ProForm.Group>
            <ProFormList
                name="postPositions"
                label="Position"
                rules={[
                    {
                        required: true,
                        validator: async (_, value) => {
                            console.log(value);
                            if (value && value.length > 0) {
                                return;
                            }
                            throw new Error('Need at least one position to create post!');
                        },
                    },
                ]}
                creatorButtonProps={{
                    position,
                }}
                creatorRecord={{
                    name: 'test',
                }}
                initialValue={postInfo?.postPositions}
            >
                <ProFormGroup key="group">
                    <ProFormText
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionName"
                        label="Position name"
                        width="md"
                    />
                    <ProFormDigit name="amount" label="Number of colab" width="md" />
                    <ProFormMoney
                        label="Salary"
                        name="salary"
                        width="md"
                    />

                </ProFormGroup>
            </ProFormList>
        </ModalForm>
    )
}

export default EditPostModal;
