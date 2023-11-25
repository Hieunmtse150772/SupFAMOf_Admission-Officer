import { FooterToolbar, ProForm, ProFormDatePicker, ProFormMoney, ProFormText, ProFormUploadDragger } from "@ant-design/pro-components";
import { Box, Grid } from "@mui/material";
import { Button, Spin } from "antd";
import { Small } from "components/Typography";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './style.scss';
import useAddContractHook from "./useAddContractHook";
const AddContract = () => {
    const [visible, setVisible] = useState(false);

    const { handler, props } = useAddContractHook();
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
        <Spin spinning={false} tip="Loading...">
            <Box className='container'>
                <Box padding={5} style={{ backgroundColor: 'white', borderRadius: 5 }}>
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
                        <Grid container spacing={1}>
                            <Grid item sm={5.2}>
                                <ProForm.Group>
                                    <ProFormText
                                        width="xl"
                                        name="contractName"
                                        label="Contract name"
                                        required
                                        rules={[{ required: true, message: 'Please enter Name!' }]}

                                    />
                                    <ProFormDatePicker
                                        name="signingDate"
                                        label="Assign date"
                                        width='xl'
                                        fieldProps={{
                                            disabledDate: handler.disabledDate,
                                            onChange: (value) => handler.handleAssignDateChange(value)
                                        }}
                                        tooltip='The contract signing date must be 2 days greater than the current date!'
                                        rules={[{ required: true, message: 'Chose date to assign!' }]} />
                                    {/* <ProFormDateRangePicker
                                        name="dateFrom_dateTo"
                                        label="Starting date - Ending date"
                                        width='xl'
                                        disabled={props.disableDate}
                                        fieldProps={{
                                            disabledDate: handler.disabledDateStart
                                        }}
                                        tooltip='The end date must be within 30 days of the start date!'
                                        rules={[{ required: true, message: 'Chose date from & date to!' }]}
                                    /> */}
                                    <ProFormDatePicker
                                        name="startingDate"
                                        label="Starting date"
                                        width='xl'
                                        disabled={props.disableDate}
                                        fieldProps={{
                                            disabledDate: handler.disabledDateStart
                                        }}
                                        tooltip='The end date must be within 30 days of the start date!'
                                        rules={[{ required: true, message: 'Chose date from & date to!' }]} />

                                    {/* <ProFormUploadButton
                                        name="upload"
                                        label="Upload Document"
                                        max={1}
                                        fieldProps={{
                                            name: 'add file',
                                            customRequest: handler.customRequest
                                        }}
                                        title="Upload"
                                        width="xl"
                                        required
                                        rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]}
                                    /> */}
                                    <ProFormMoney
                                        label="Salary"
                                        name="salary"
                                        width='xl'
                                        customSymbol="đ"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter Salary!'
                                            },
                                        ]}
                                        locale="en-VN"
                                    />
                                    <span></span>
                                </ProForm.Group>


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
                                            style={{ paddingBottom: 30, paddingTop: 9, height: 290 }}
                                        />
                                        </div>

                                    )}
                                </ProForm.Item>
                                <span className="error">{props.error}</span>

                            </Grid>

                        </Grid>
                        <ProFormUploadDragger
                            width='md'
                            name="upload"
                            label="Upload Document"
                            max={1}
                            fieldProps={{
                                name: 'add file',
                                customRequest: handler.customRequest,
                                onChange: handler.handleChange,
                            }}
                            title="Upload"
                            description='Chose template file contract (docs, prf,..)'
                            required
                            rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]} />
                        <span className="error">{props.errorUrl}</span>

                    </ProForm>
                </Box>
            </Box>
        </Spin>
    )
}

export default AddContract;
