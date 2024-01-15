import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProCard, ProForm, ProFormCheckbox, ProFormDatePicker, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSwitch, ProFormText, ProFormTimePicker } from "@ant-design/pro-components";
import { Grid } from "@mui/material";
import { Button, Modal, Upload } from "antd";
import { Small } from "components/Typography";
import PostInfoDto from "dtos/Post/Post View/postInfo.dto";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './style.scss';
import useEditPostModalHook from "./useEditPostModalHook";
interface EditPostModalProps {
    open: boolean,
    setOpenEditPostModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: string,
    postInfo: PostInfoDto | null,
    fetchPostList: () => void
}
const EditPostModal: FC<EditPostModalProps> = ({ open, setOpenEditPostModal, postId, postInfo, fetchPostList }) => {
    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

    const { handler, props } = useEditPostModalHook(setOpenEditPostModal, fetchPostList);
    props.form.setFieldValue('description', postInfo?.data.postDescription)
    // const { postInfo } = props;

    // useEffect(() => {
    //     handler.fetchPost(postId)
    // }, [])
    useEffect(() => {
        const dateFrom = new Date(postInfo?.data.dateFrom ? postInfo?.data.dateFrom : '');
        const dateTo = new Date(postInfo?.data.dateTo ? postInfo?.data.dateTo : '');
        let dateArray = [];
        if (dateFrom && dateTo) {
            let currentDate = new Date(dateFrom);
            while (currentDate <= dateTo) {
                dateArray.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            const optionDatePicker: any[] = dateArray?.map((date) => ({
                value: moment(date).format('YYYY-MM-DD'),
                label: moment(date).format('YYYY-MM-DD'),
            }));
            console.log('optionDatePicker', optionDatePicker)
            handler.setOptionDate(optionDatePicker);
        }

    }, [])
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
            loading={props.isloading}
            form={props.form}
            title={`Edit post information`}
            open={open}
            onFinish={(value) => handler.handleUpdatePost(value)}
            onOpenChange={setOpenEditPostModal}
            // submitter={{
            //     searchConfig: {
            //         submitText: 'Submit',
            //         resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
            //     }
            // }}
            submitter={{
                render: (props) => (
                    <Button color='primary' type="primary" htmlType="submit" onClick={() => {
                        if (props.form?.getFieldValue('description')) {
                            handler.setDescription(props.form?.getFieldValue('description') === '<p><br></p>' ? '' : props.form?.getFieldValue('description'))
                        } else {
                            handler.setDescription('')
                        }
                        props.form?.submit()
                    }}
                    >Submit</Button>
                )
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
                            tooltip="Choose one options of post title"
                            rules={[{ required: true, message: 'Choose one options of post title!' }]}
                            onChange={() => handler.handleEdit()}
                        />
                        <ProFormDateRangePicker
                            name="dateFrom-dateTo"
                            label="Date From-To"
                            disabled={postInfo?.data?.anyRegister}
                            width='xl'
                            rules={[{ required: true, message: 'Choose date from & date to!' }]}
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
                        <ProFormSwitch name="isPremium" label="Is Premium show" initialValue={postInfo?.data?.isPremium}
                            onMetaChange={onchange = () => handler.handleEdit()} disabled={postInfo?.data?.anyRegister}

                        />
                    </ProForm.Group>
                    <Upload
                        customRequest={handler.customRequest}
                        listType="picture-card"
                        fileList={props.fileList}
                        onPreview={handler.handlePreview}
                        onChange={handler.handleChange}
                        onRemove={handler.removeImage}
                    >
                        {props.fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <span className="error">{props.errorUrl}</span>
                    <Modal open={props.previewOpen} title={props.previewTitle} footer={null} onCancel={handler.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
                    </Modal>

                </Grid>
                <Grid item sm={7}>
                    <Small fontSize={15}>
                        Description
                    </Small>
                    <ProForm.Item key={'description'}
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.description !== currentValues.description
                        }
                        rules={[{ required: true, message: 'Description is required!' }]}
                    >
                        {(field) => (
                            <div className="parent-scroll"><ReactQuill
                                modules={modules}
                                defaultValue={postInfo?.data?.postDescription}
                                onChange={(newValue: string) => field.setFieldValue('description', newValue)}
                                style={{ paddingBottom: 30, paddingTop: 9, height: 300 }}
                            />
                            </div>

                        )}
                    </ProForm.Item>
                    <span className="error">{props.error}</span>
                </Grid>
            </Grid>
            <ProFormList
                name="postPositions"
                initialValue={postInfo?.data?.postPositions}
                creatorButtonProps={
                    false
                }
                itemRender={({ listDom, action }, { index }) => (
                    <ProCard
                        bordered
                        style={{ marginBlockEnd: 8 }}
                        title={`Position ${index + 1}`}
                        bodyStyle={{ paddingBlockEnd: 0, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                    >
                        {listDom}
                    </ProCard>
                )}
            >
                <ProFormGroup >
                    <ProFormText
                        label="Position Name"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionName"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormText
                        label="Position Description"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionDescription"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />

                    <ProFormText
                        label="School Name"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="schoolName"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    {/* <ProFormText
                        label="Location"
                        width="sm"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="location"
                    /> */}
                    <ProFormSelect
                        name="location"
                        label="Address"
                        showSearch
                        debounceTime={300}
                        width='md'
                        request={async ({ keyWords }) => handler.handleSearchAddressGeoapifi(keyWords)}
                        placeholder="Please select a country"
                        rules={[{ required: true, message: 'Please select your country!' }]}
                        fieldProps={{
                            filterOption: false
                        }}
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormDatePicker
                        label="Date"
                        width="md"
                        disabled={postInfo?.data?.anyRegister}
                        name="date"
                        rules={[{ required: true, message: 'Choose Date!' }]} />

                    <ProFormSelect
                        label="Document"
                        width="md"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="documentId"
                        options={props.documentOptions}
                        debounceTime={5}
                        tooltip="That field optional"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormSelect
                        label="Certificate"
                        width="md"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="trainingCertificateId"
                        options={props.certificateOptions}
                        debounceTime={5}
                        tooltip="That field optional"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />

                    <ProFormTimePicker
                        label="Time From"
                        width="xs"
                        name="timeFrom"
                        disabled={postInfo?.data?.anyRegister}
                        // initialValue={['timeFrom', 'timeTo']}
                        rules={[{ required: true, message: 'Choose time from & time to!' }]}
                    />

                    <ProFormTimePicker
                        label="Time To"
                        width="xs"
                        disabled={postInfo?.data?.anyRegister}
                        name="timeTo"
                        // initialValue={['timeFrom', 'timeTo']}
                        rules={[{ required: true, message: 'Choose time from & time to!' }]}
                    />
                    <ProFormDigit
                        label="Amount"
                        width="xs"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                min: 1,
                                validator: async (_, value) => {
                                    if (value > 0) {
                                        return;
                                    }
                                    throw new Error('Amount must be minimum 1!');
                                },
                            },
                        ]}
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormMoney
                        label="Salary"
                        name="salary"
                        width="xs"
                        customSymbol="đ"
                        disabled={postInfo?.data?.anyRegister}
                        rules={[
                            {
                                required: true,
                                min: 100000,
                                validator: async (_, value) => {
                                    if (value > 100000) {
                                        return;
                                    }
                                    throw new Error('Salary must be minimum 100,000 đ');
                                },
                            }
                        ]}
                        locale="en-VN"
                        onMetaChange={onchange = () => handler.handleEdit()}

                    />
                    <ProFormCheckbox
                        label="Bus option"
                        width="xs"
                        tooltip="That field optional"
                        name="isBusService"
                        initialValue={false}
                        onMetaChange={onchange = () => handler.handleEdit()}

                    >Yes/No</ProFormCheckbox>
                </ProFormGroup>
            </ProFormList>
            <ProFormList
                name="newPostPositions"
                creatorButtonProps={{
                    position,
                    creatorButtonText: 'Add new position'
                }}
                creatorRecord={{
                    name: 'position',
                }}
                itemRender={({ listDom, action }, { index }) => (
                    <ProCard
                        extra={action}
                        bordered
                        style={{ marginBlockEnd: 8 }}
                        title={`New position ${index + 1}`}
                        bodyStyle={{ paddingBlockEnd: 0, boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                    >
                        {listDom}
                    </ProCard>
                )}
            >
                <ProFormGroup >
                    <ProFormText
                        label="Position Name"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionName"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormText
                        label="Position Description"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="positionDescription"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormText
                        label="School Name"
                        width="md"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="schoolName"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    {/* <ProFormText
                        label="Location"
                        width="sm"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="location"
                    /> */}
                    <ProFormSelect
                        name="location"
                        label="Address"
                        showSearch
                        debounceTime={300}
                        width='md'
                        request={async ({ keyWords }) => handler.handleSearchAddressGeoapifi(keyWords)}
                        placeholder="Please select a country"
                        rules={[{ required: true, message: 'Please select your country!' }]}
                        fieldProps={{
                            filterOption: false
                        }}
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormSelect
                        width="sm"
                        options={props.optionDate}
                        name="date"
                        label="Working date"
                        tooltip="Choose one options of Date"
                        rules={[{ required: true, message: 'Choose one options of Date!' }]}
                    />
                    <ProFormSelect
                        label="Document"
                        width="md"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="documentId"
                        options={props.documentOptions}
                        debounceTime={5}
                        tooltip="That field optional"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />
                    <ProFormSelect
                        label="Certificate"
                        width="md"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        name="trainingCertificateId"
                        options={props.certificateOptions}
                        debounceTime={5}
                        tooltip="That field optional"
                        onMetaChange={onchange = () => handler.handleEdit()}
                    />

                    <ProFormTimePicker.RangePicker
                        label="Time"
                        width="sm"
                        name="timeFrom_timeTo"
                        fieldProps={{
                            disabledTime: (current, type) => handler.disabledTime(current, type)
                        }}
                        rules={[{ required: true, message: 'Choose time from & time to!' }]}
                    />
                    <ProFormDigit
                        label="Amount"
                        width="xs"
                        name="amount"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        onMetaChange={onchange = () => handler.handleEdit()}

                    />
                    <ProFormMoney
                        label="Salary"
                        name="salary"
                        width="xs"
                        customSymbol="đ"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        locale="en-VN"
                        onMetaChange={onchange = () => handler.handleEdit()}

                    />
                    <ProFormCheckbox
                        label="Bus option"
                        width="xs"
                        tooltip="That field optional"
                        name="isBusService"
                        initialValue={false}
                        onMetaChange={onchange = () => handler.handleEdit()}

                    >Yes/No</ProFormCheckbox>
                </ProFormGroup>
            </ProFormList>
        </ModalForm >
    )
}

export default EditPostModal;
