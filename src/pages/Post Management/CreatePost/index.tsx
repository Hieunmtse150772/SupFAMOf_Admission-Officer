
import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ProCard, ProForm, ProFormCheckbox, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSwitch, ProFormText, ProFormTimePicker } from '@ant-design/pro-components';
import { Box, Grid, alpha, styled } from '@mui/material';
import { Button, DatePicker, Divider, Modal, Spin, Upload } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { Small } from 'components/Typography';
import dayjs from 'dayjs';
import useTitle from "hooks/useTitle";
import AddCertificateModal from 'pages/Modal/AddCertificateModal';
import AddDocumentModal from 'pages/Modal/AddDocumentModal';
import AddPostTitleModal from 'pages/Modal/AddPostTitleModal';
import { FC, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './styles.scss';
import useAddNewPostHook from './useAddNewPostHook';


const initialValues = {
    postTitle: "",
    description: "",
};
const ButtonWrapper = styled(Box)(({ theme }) => ({
    width: 100,
    height: 100,
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
        theme.palette.mode === "light"
            ? theme.palette.secondary[200]
            : alpha(theme.palette.primary[100], 0.1),
}));

const AddNewPost: FC = () => {
    const { handler, props } = useAddNewPostHook();
    const { RangePicker } = DatePicker;

    const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    });

    const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    };
    const { options, optionDate } = props

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };


    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');


    useTitle("Add New Post");

    const uploadButton = (
        <div>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Spin spinning={props.isloading} tip="Loading...">
            <Button color='primary' style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={handler.onOpenAddTitleModal}><PlusOutlined rev={undefined} />Add Category</Button>
            <Button color='primary' style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={handler.onOpenAddDocumentModal}><PlusOutlined rev={undefined} />Add Document</Button>
            <Button color='primary' style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={handler.onOpenAddCertificateModal}><PlusOutlined rev={undefined} />Add Certificate</Button>
            <Box className='container'>
                <Box padding={5} style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: 5 }}>
                    <ProForm
                        form={props.form}
                        onFinish={(value) => handler.handleSubmitAnt(value)}
                        submitter={{
                            render: (props) => (<FooterToolbar>
                                <Button type="default" htmlType="reset" onClick={() => {
                                    // Thực hiện các xử lý trước khi gửi biểu mẫu (nếu cần)
                                    props.form?.resetFields();
                                }}>Reset</Button>
                                <Button color='primary' type="primary" htmlType="submit" onClick={() => {
                                    if (props.form?.getFieldValue('description')) {
                                        handler.setDescription(props.form?.getFieldValue('description') === '<p><br></p>' ? '' : props.form?.getFieldValue('description'))
                                    } else {
                                        handler.setDescription('')
                                    }
                                    props.form?.submit()
                                }}
                                >Submit</Button>
                            </FooterToolbar>)
                        }}
                    >
                        <Divider orientation="center" style={{ color: '#f09101' }}>
                            POST INFORMATION
                        </Divider>
                        <Grid container spacing={1}>
                            <Grid item sm={5}>
                                <ProForm.Group>
                                    <ProFormSelect
                                        width="xl"
                                        options={options}
                                        name="postCategory"
                                        label="Post category"
                                        initialValue={options[0]?.value}
                                        debounceTime={5}
                                        tooltip="Choose one options of post title"
                                        rules={[{ required: true, message: 'Choose one options of post title!' }]}
                                    />
                                    <ProFormDateRangePicker
                                        name="dateFrom_dateTo"
                                        width='xl'
                                        label="Date From - Date to"
                                        style={{ width: '100%' }}
                                        rules={[{ required: true, message: 'Choose date from & date to!' }]}
                                        fieldProps={{
                                            disabledDate: disabledDate,
                                            disabledTime: disabledRangeTime,
                                            onChange: (event) => { handler.handleChangeDateRangePicker(event) },
                                        }}
                                    ></ProFormDateRangePicker>
                                    <ProFormSwitch name="isPremium" label="Is Premium show" initialValue={false}
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
                                <Modal open={props.previewOpen} title={props.previewTitle} footer={null} onCancel={handler.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
                                </Modal>
                            </Grid>
                            <Grid item sm={0.2}>
                                <Divider type='vertical' style={{ color: '#f09101', height: 320 }} >
                                </Divider>
                            </Grid>

                            <Grid item sm={6.8}>
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
                                            defaultValue=''
                                            onChange={(newValue: string) => field.setFieldValue('description', newValue)}
                                            style={{ paddingBottom: 30, paddingTop: 9, height: 300 }}
                                        />
                                        </div>

                                    )}
                                </ProForm.Item>
                                <span className="error">{props.error}</span>
                            </Grid>

                        </Grid>
                        <Divider style={{ color: '#f09101' }} orientation="center">
                            POSITIONS INFORMATION
                        </Divider>
                        <ProFormList
                            name="postPositions"
                            rules={[
                                {
                                    required: true,
                                    validator: async (_, value) => {
                                        if (value && value.length > 0) {
                                            return;
                                        }
                                        throw new Error('Need at least one position to create post!');
                                    },
                                },
                            ]}
                            deleteIconProps={{
                                tooltipText: 'Delete this position'
                            }}
                            copyIconProps={{
                                tooltipText: 'Copy this position'
                            }}
                            creatorButtonProps={{
                                position,
                                creatorButtonText: 'Add more position',
                            }}

                            creatorRecord={{
                                name: 'position',
                            }}

                            itemRender={({ listDom, action }, { index }) => {
                                const selectedCertificate = props.selectedCertificates[index];
                                return (
                                    <ProCard
                                        bordered
                                        style={{ marginBlockEnd: 8 }}
                                        title={`Position: ${index + 1}`}
                                        extra={action}
                                        bodyStyle={{ paddingBlockEnd: 0, boxShadow: "rgba(0, 0, 0, 0.45) 0px 20px 15px -25px" }}
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
                                                label="Position Description"
                                                width="sm"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                name="positionDescription"
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
                                            <ProFormSelect
                                                name="location"
                                                label="Address"
                                                showSearch
                                                key='key'
                                                valuePropName=''
                                                debounceTime={300}
                                                onChange={(value, option) => { props.form.setFieldValue(`location${index}`, option) }}
                                                width='lg'
                                                request={async ({ keyWords }) => {
                                                    const result = await handler.handleSearchAddressGeoapifi(keyWords);
                                                    return result
                                                }}

                                                getValueFromEvent={(value) => value}
                                                placeholder="Please select a address"
                                                rules={[{ required: true, message: 'Please select your address!' }]}
                                            />
                                            {/* <ProFormText
                                        label="Location"
                                        width="sm"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the address!',
                                                // validator: handler.validateAddress
                                            },
                                        ]}
                                        validateFirst
                                        name="location"
                                    /> */}
                                            <ProFormSelect
                                                width="sm"
                                                options={optionDate}
                                                name="date"
                                                label="Working date"
                                                tooltip="Choose one options of Date"
                                                rules={[{ required: true, message: 'Choose one options of Date!' }]}
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
                                            <ProFormSelect
                                                label="Certificate"
                                                width="sm"
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="certificateOption"
                                                fieldProps={{
                                                    onChange: (value: never) => { handler.handleCertificateChange(index, value) }
                                                }}
                                                options={props.certificateOptions}
                                                debounceTime={5}
                                                tooltip="That field optional"
                                            />
                                            {/* <ProFormSelect
                                                label="Document"
                                                width="sm"
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="documentOption"
                                                options={props.documentOptions}
                                                disabled={Boolean(selectedCertificate)}
                                                debounceTime={5}
                                                tooltip="That field optional" /> */}
                                            <ProFormSelect
                                                label="Document"
                                                width="sm"
                                                name={`documentOption`}
                                                options={props.documentOptions}
                                                // disabled={selectedCertificate ? false : true}
                                                debounceTime={5}
                                                tooltip="That field is optional"
                                            />
                                            <ProFormCheckbox
                                                label="Bus option"
                                                width="xs"
                                                tooltip="That field optional"
                                                name="isBusService"
                                                initialValue={false}
                                            >Yes/No</ProFormCheckbox>
                                            <ProFormDigit
                                                label="Amount"
                                                width="sm"
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
                                            />
                                            <ProFormMoney
                                                label="Salary"
                                                name="salary"
                                                width="sm"
                                                customSymbol="đ"
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
                                                    },
                                                ]}
                                                locale="en-VN"
                                            />

                                        </ProFormGroup>
                                    </ProCard>
                                )
                            }
                            }
                        >
                        </ProFormList>
                        {/* <Divider style={{ color: '#f09101' }} orientation="center">
                            TRAINING POSITION
                        </Divider>
                        <ProFormList
                            name="trainingPosition"
                            // rules={[
                            //     {
                            //         required: true,
                            //         validator: async (_, value) => {
                            //             if (value && value.length > 0) {
                            //                 return;
                            //             }
                            //             throw new Error('Need at least one position to create post!');
                            //         },
                            //     },
                            // ]}
                            creatorButtonProps={{
                                position,
                            }}
                            creatorRecord={{
                                name: 'test',
                            }}
                            itemRender={({ listDom, action }, { index }) => (
                                <ProCard
                                    bordered
                                    style={{ marginBlockEnd: 8 }}
                                    title={`Position${index + 1}`}
                                    extra={action}
                                    bodyStyle={{ paddingBlockEnd: 0 }}
                                >
                                    {listDom}
                                </ProCard>
                            )}
                        >
                            <ProFormGroup >


                                <ProFormText
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    label=""
                                    name="trainingPositionName"
                                />


                                <ProFormText
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    name="schoolNameTraining"
                                />


                                <ProFormCheckbox

                                    name="isBusServiceTraining"
                                    initialValue={false}
                                >Yes/No</ProFormCheckbox>


                                <ProFormText
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    name="locationTraining"
                                />


                                <ProFormSelect
                                    rules={[
                                        {
                                            required: false,
                                        },
                                    ]}
                                    name="documentTrainingOption"
                                    options={props.documentOptions}
                                    debounceTime={5}
                                    tooltip="That field optional" />


                                <ProFormSelect
                                    rules={[
                                        {
                                            required: false,
                                        },
                                    ]}
                                    name="certificateTrainingOption"
                                    options={props.certificateOptions}
                                    debounceTime={5}
                                    tooltip="That field optional"
                                />


                                <ProFormTimePicker.RangePicker
                                    name="trainingTimeFrom_timeTo"
                                    rules={[{ required: true, message: 'Choose time from & time to!' }]}
                                // initialValue={[postInfo?.data.timeFrom, postInfo?.data.timeTo]}
                                />


                                <ProFormDigit
                                    name="traingAmount"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                />


                                <ProFormMoney
                                    name="trainingSalary"
                                    customSymbol="đ"
                                    locale="en-VN"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                />
                            </ProFormGroup>
                        </ProFormList> */}

                    </ProForm>
                    {props.openAddTitleModal && <AddPostTitleModal fetchPostTitleOption={handler.fetchPostTitleOption} setOpenAddTitleModal={handler.setOpenAddTitleModal} open={props.openAddTitleModal} data={props.postTitleOptionsAPI} />}
                    {props.openAddDocumentModal && <AddDocumentModal fetchDocumentOption={handler.fetchDocumentOption} setOpenAddDocumentModal={handler.setOpenAddDocumentModal} open={props.openAddDocumentModal} data={props.documentOptionsAPI} />}
                    {props.openAddCertificateModal && <AddCertificateModal fetchCertificateRegistration={handler.fetchCertificateRegistration} fetchCertificateOption={handler.fetchCertificateOption} setOpenCertificateModal={handler.setOpenAddCertificateModal} open={props.openAddCertificateModal} data={props.certificateOptionsAPI} />}

                </Box >
            </Box >

        </Spin>
    );
};

export default AddNewPost;
