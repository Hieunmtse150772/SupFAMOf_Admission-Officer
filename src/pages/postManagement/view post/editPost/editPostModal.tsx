import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTextArea, ProFormTimePicker } from "@ant-design/pro-components";
import { message } from "antd";
import { PostInfo } from "models/postInfo.model";
import { FC, useState } from "react";
import UseEditPostModal from "./useEditPostModal";

interface EditPostModalProps {
    open: boolean,
    setOpenEditPostModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: string,
    postInfo: PostInfo | null,
}
const EditPostModal: FC<EditPostModalProps> = ({ open, setOpenEditPostModal, postId, postInfo }) => {
    console.log('post information: ', postInfo)
    console.log('post information: ', postInfo?.data?.postCode)
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
    const [isEdited, setIsEdited] = useState<boolean>(false);

    const { handler, props } = UseEditPostModal();
    // const { postInfo } = props;
    const handleCreatePostTitle = async (value: any) => {
        if (!isEdited) {
            message.warning('Nothing was change!')
        } else message.success('Post is updated!')
        console.log(value)
    }
    // useEffect(() => {
    //     handler.fetchPost(postId)
    // }, [])

    const handleEdit = () => {
        setIsEdited(true);
    }
    return (
        <ModalForm
            width={1190}
            title={`Edit post ${postInfo?.data?.postCode}`}
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
                    initialValue={postInfo?.data?.postTitleId}
                    debounceTime={5}
                    label="Post Title"
                    tooltip="Chose one options of post title"
                    rules={[{ required: true, message: 'Chose one options of post title!' }]}
                    onChange={() => handleEdit()}
                />
                <ProFormDateRangePicker
                    name="dateFrom-dateTo"
                    label="Date From-To"
                    width='xl'
                    rules={[{ required: true, message: 'Chose date from & date to!' }]}
                    initialValue={[postInfo?.data.dateFrom, postInfo?.data.dateTo]}
                    onMetaChange={onchange = () => handleEdit()}
                />
                <ProFormTextArea
                    name="description"
                    label="Description"
                    width="xl"
                    placeholder="Description"
                    initialValue={postInfo?.data?.postDescription}
                    rules={[{ required: true, message: 'Description is required!' }]}
                    onMetaChange={onchange = () => handleEdit()}
                />
                <ProFormTimePicker.RangePicker
                    name="timeFrom-timeTo"
                    label="TimeForm-To"
                    width='xl'
                    rules={[{ required: true, message: 'Chose time from & time to!' }]}
                    initialValue={[postInfo?.data.timeFrom, postInfo?.data.timeTo]}
                    onMetaChange={onchange = () => handleEdit()}
                />

                <ProFormText
                    name="location"
                    label="Location"
                    width="xl"
                    initialValue={postInfo?.data?.location}
                    placeholder="Location"
                    rules={[{ required: true, message: 'Location is required!' }]}
                    onMetaChange={onchange = () => handleEdit()}
                />
                <ProFormSlider
                    name="piority"
                    label="Piority 1-5"
                    width="lg"
                    placeholder="Piority"
                    initialValue={postInfo?.data?.priority}
                    rules={[{ required: true, message: 'Piority is required!' }]}
                    max={5}
                    onMetaChange={onchange = () => handleEdit()}
                />
                <ProFormSwitch name="isPremium" label="Is Premium show" initialValue={postInfo?.data?.isPremium}
                    onMetaChange={onchange = () => handleEdit()}
                />
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
                    initialValue={postInfo?.data?.postPositions}
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
                            onMetaChange={onchange = () => handleEdit()}
                        />
                        <ProFormDigit
                            name="amount"
                            label="Number of colab"
                            width="md"
                            onMetaChange={onchange = () => handleEdit()}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                        <ProFormMoney
                            label="Salary"
                            name="salary"
                            width="md"
                            customSymbol="vnd"
                            onMetaChange={onchange = () => handleEdit()}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    </ProFormGroup>
                </ProFormList>
            </ProForm.Group>

        </ModalForm>
    )
}

export default EditPostModal;
