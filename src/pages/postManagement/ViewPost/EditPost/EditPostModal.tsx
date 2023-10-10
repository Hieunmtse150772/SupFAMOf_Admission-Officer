import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProCard, ProForm, ProFormCheckbox, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTimePicker } from "@ant-design/pro-components";
import { Grid } from "@mui/material";
import { Modal, Upload } from "antd";
import { Small } from "components/Typography";
import { PostInfo } from "models/postInfo.model";
import { FC, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import useEditPostModalHook from "./useEditPostModalHook";

interface EditPostModalProps {
    open: boolean,
    setOpenEditPostModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: string,
    postInfo: PostInfo | null,
}
const EditPostModal: FC<EditPostModalProps> = ({ open, setOpenEditPostModal, postId, postInfo }) => {
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

    const { handler, props } = useEditPostModalHook();
    // const { postInfo } = props;

    // useEffect(() => {
    //     handler.fetchPost(postId)
    // }, [])
    const uploadButton = (
        <div>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };

    return (
        <ModalForm
            width={1190}
            title={`Edit post ${postInfo?.data?.postCode}`}
            open={open}
            onFinish={(value) => handler.handleUpdatePost(value)}
            onOpenChange={setOpenEditPostModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
        >
            <Grid container spacing={1}>
                <Grid item sm={5}>
                    <ProForm.Group>
                        <ProFormSelect
                            width="xl"
                            options={props.options}
                            name="postCategory"
                            initialValue={postInfo?.data?.postCategoryId}
                            debounceTime={5}
                            label="Post Title"
                            tooltip="Chose one options of post title"
                            rules={[{ required: true, message: 'Chose one options of post title!' }]}
                            onChange={() => handler.handleEdit()}
                        />
                        <ProFormDateRangePicker
                            name="dateFrom-dateTo"
                            label="Date From-To"
                            disabled
                            width='xl'
                            rules={[{ required: true, message: 'Chose date from & date to!' }]}
                            initialValue={[postInfo?.data.dateFrom, postInfo?.data.dateTo]}
                            onMetaChange={onchange = () => handler.handleEdit()}
                        />
                        {/* <ProFormTextArea
                    name="description"
                    label="Description"
                    width="xl"
                    placeholder="Description"
                    initialValue={postInfo?.data?.postDescription}
                    rules={[{ required: true, message: 'Description is required!' }]}
                    onMetaChange={onchange = () => handleEdit()}
                /> */}

                        <ProFormSlider
                            name="piority"
                            label="Piority 1-5"
                            width="lg"
                            placeholder="Piority"
                            initialValue={postInfo?.data?.priority}
                            rules={[{ required: true, message: 'Piority is required!' }]}
                            max={5}
                            onMetaChange={onchange = () => handler.handleEdit()}
                        />
                        <ProFormSwitch name="isPremium" label="Is Premium show" initialValue={postInfo?.data?.isPremium}
                            onMetaChange={onchange = () => handler.handleEdit()}
                        />
                        <Upload
                            customRequest={handler.customRequest}
                            listType="picture-card"
                            fileList={props.fileList}
                            maxCount={1}
                            onPreview={handler.handlePreview}
                            onChange={handler.handleChange}
                            onRemove={handler.removeImage}
                        >
                            {props.fileList.length >= 1 ? null : uploadButton}

                        </Upload>
                        <Modal open={props.previewOpen} title={props.previewTitle} footer={null} onCancel={handler.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
                        </Modal>

                    </ProForm.Group>
                </Grid>
                <Grid item sm={6.8}>
                    <Small fontSize={15}>
                        Description
                    </Small>
                    <ProForm.Item key={'description'}
                        initialValue={postInfo?.data?.postDescription}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.description !== currentValues.description
                        }
                        rules={[{ required: true, message: 'Description is required!' }]}
                    >
                        {(field) => (
                            <div className="parent-scroll"><ReactQuill
                                modules={modules}
                                defaultValue={postInfo?.data?.postDescription}
                                onChange={(newValue: string) => handler.setDescription(newValue)}
                                style={{ paddingBottom: 30, paddingTop: 9, height: 300 }}
                            />
                            </div>

                        )}
                    </ProForm.Item>
                    {/* <span className="error">{props.error}</span> */}
                </Grid>
            </Grid>
            <ProFormList
                name="postPositions"
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
                    name: 'position',
                }}
                initialValue={postInfo?.data?.postPositions}
                itemRender={({ listDom, action }, { index }) => (
                    <ProCard
                        bordered
                        style={{ marginBlockEnd: 8 }}
                        title={`Position${index + 1}`}
                        extra={action}
                        bodyStyle={{ paddingBlockEnd: 0, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                    >
                        {listDom}
                    </ProCard>
                )}
            >
                <ProFormGroup >

                    <ProFormText
                        label="Position Name"
                        width="sm"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionName"
                    />


                    <ProFormText
                        label="School Name"
                        width="sm"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="schoolName"
                    />
                    <ProFormText
                        label="Location"
                        width="sm"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="location"
                    />


                    <ProFormSelect
                        label="Document"
                        width="sm"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="documentOption"
                        options={props.documentOptions}
                        debounceTime={5}
                        tooltip="That field optional" />
                    <ProFormSelect
                        label="Certificate"
                        width="sm"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="certificateOption"
                        options={props.certificateOptions}
                        debounceTime={5}
                        tooltip="That field optional"
                    />
                    <ProFormTimePicker
                        label="Time From"
                        width="xs"
                        disabled
                        name="timeFrom"
                        // initialValue={['timeFrom', 'timeTo']}
                        rules={[{ required: true, message: 'Chose time from & time to!' }]}
                    />
                    <ProFormTimePicker
                        label="Time To"
                        width="xs"
                        disabled
                        name="timeTo"
                        // initialValue={['timeFrom', 'timeTo']}
                        rules={[{ required: true, message: 'Chose time from & time to!' }]}
                    />
                    <ProFormDigit
                        label="Amount"
                        width="sm"
                        name="amount"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    />


                    <ProFormMoney
                        label="Salary"
                        name="salary"
                        width="sm"
                        customSymbol="đ"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        locale="en-VN"
                    />
                    <ProFormCheckbox
                        label="Bus option"
                        width="sm"
                        tooltip="That field optional"
                        name="isBusService"
                        initialValue={false}
                    >Yes/No</ProFormCheckbox>
                </ProFormGroup>

            </ProFormList>



        </ModalForm >
    )
}

export default EditPostModal;
