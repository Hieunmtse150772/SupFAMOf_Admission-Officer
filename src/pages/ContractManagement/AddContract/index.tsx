import { FooterToolbar, ProCard, ProDescriptions, ProForm, ProFormDatePicker, ProFormDateRangePicker, ProFormMoney, ProFormText, ProFormUploadDragger, ProList, StepsForm } from "@ant-design/pro-components";
import { Box, Grid } from "@mui/material";
import { Button, Result, Space, Spin, Tag } from "antd";
import { Small, Span } from "components/Typography";
import numberToWords from 'number-to-words';
import { useState } from "react";
import ReactHtmlParser from 'react-html-parser';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useNavigate } from "react-router";
import './style.scss';

import useAddContractHook from "./useAddContractHook";
const AddContract = () => {
    const [visible, setVisible] = useState(false);
    const { handler, props } = useAddContractHook();
    const navigate = useNavigate();
    type DataItem = (typeof props.collabLists.data)[number];
    const { isEdit, isLoading } = props
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
        <Spin spinning={props.isLoading} tip="Loading...">
            <Box className='container'>
                <Box padding={5} style={{ backgroundColor: 'white', borderRadius: 5 }}>
                    <StepsForm
                        formProps={{ form: props.form }}
                        submitter={{
                            render: (props) => {
                                if (props.step === 0) {
                                    return (<FooterToolbar>
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
                                            handler.setEdit(!isEdit)
                                            const dateFrom_dateTo = props.form?.getFieldValue('dateFrom_dateTo');
                                            if (dateFrom_dateTo) {
                                                const dateFrom = new Date(dateFrom_dateTo[0]);
                                                handler.setDateFrom(dateFrom);
                                                const dateTo = new Date(dateFrom_dateTo[1]);
                                                handler.setDateTo(dateTo);
                                            }
                                            props.form?.submit()
                                        }}
                                        >Next</Button>
                                    </FooterToolbar>)
                                }
                                if (props.step === 1) {
                                    return (<FooterToolbar>
                                        <Button type="default" onClick={() => props.onPre()}>Previous</Button>
                                        <Button color='primary' type="primary" htmlType="submit" onClick={async (value) => {
                                            const result = await handler.handleSubmitAnt(value)
                                            console.log('result: ', result)
                                        }}
                                        >Submit</Button>
                                    </FooterToolbar>)
                                }
                                if (props.step === 2) {
                                    return (<FooterToolbar>
                                        <Button type="default" onClick={() => props.onPre()} disabled>Previous</Button>
                                        <Button color='primary' type="primary" htmlType="submit" onClick={(value) => handler.handleNext()}
                                        >Submit</Button>
                                    </FooterToolbar>)
                                }
                                if (props.step === 3) {
                                    return (<FooterToolbar>
                                        <Button type="default" disabled={isLoading} onClick={() => props.onPre()}>Previous</Button>
                                        <Button color='primary' type="primary" htmlType="submit" disabled={isLoading} onClick={async () => {
                                            handler.handleConfirm()
                                        }}
                                        >Submit</Button>
                                    </FooterToolbar>)
                                }
                            }
                        }
                        }
                    >
                        <StepsForm.StepForm
                            name="create_contract"
                            title="Create contract"
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
                                            label="Signing date"
                                            width='xl'
                                            fieldProps={{
                                                disabledDate: handler.disabledDate,
                                                onChange: (value) => handler.handleAssignDateChange(value)
                                            }}
                                            tooltip='The contract signing date must be 2 days greater than the current date!'
                                            rules={[{ required: true, message: 'Choose date to assign!' }]} />
                                        {/* <ProFormDateRangePicker
                                        name="dateFrom_dateTo"
                                        label="Starting date - Ending date"
                                        width='xl'
                                        disabled={props.disableDate}
                                        fieldProps={{
                                            disabledDate: handler.disabledDateStart
                                        }}
                                        tooltip='The end date must be within 30 days of the start date!'
                                        rules={[{ required: true, message: 'Choose date from & date to!' }]}
                                    /> */}
                                        <ProFormDateRangePicker
                                            name="dateFrom_dateTo"
                                            label="Starting date"
                                            width='xl'
                                            disabled={props.disableDate}
                                            fieldProps={{
                                                disabledDate: handler.disabledDateStart,
                                            }}
                                            tooltip='The end date must be within 30 days of the start date!'
                                            rules={[{ required: true, message: 'Choose date from & date to!' }]} />
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
                                label="Upload contract file"
                                max={1}
                                fieldProps={{
                                    name: 'add file',
                                    customRequest: handler.customRequest,
                                    onChange: handler.handleChange,
                                }}
                                title="Upload"
                                description='Choose template file contract (docs, prf,..)'
                                required
                                rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]} />
                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="confirm_contract"
                            title="Confirm information"
                            onFinish={async (value) => {
                                handler.handleSubmitAnt(value)
                            }}
                        >
                            <ProDescriptions
                                column={2}
                                title="Contract information"
                                tooltip="Confirm the contract information below"
                            >
                                <ProDescriptions.Item
                                    valueType="text"
                                    contentStyle={{
                                        maxWidth: '80%',
                                        fontWeight: 700,

                                    }}
                                    label="Contract name"
                                >
                                    {props.form?.getFieldValue('contractName')}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item
                                    label="Description"
                                    valueType="text"
                                    contentStyle={{
                                        maxWidth: '80%',
                                        fontWeight: 700
                                    }}
                                >
                                    {ReactHtmlParser(props.form?.getFieldValue('description'))}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item
                                    label="Salary"
                                    tooltip="Number"
                                    valueType="digit"
                                >
                                    {props.form?.getFieldValue('salary')}
                                </ProDescriptions.Item>

                                <ProDescriptions.Item label="Start date" valueType={'date'}>
                                    {props.dateFrom}
                                </ProDescriptions.Item>

                                <ProDescriptions.Item label="Salary word"
                                    valueType={'textarea'}

                                >
                                    {props?.form?.getFieldValue('salary') ? numberToWords.toWords(Number(props?.form?.getFieldValue('salary'))) : props?.form?.getFieldValue('salary')} (Việt Nam đồng)
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="End date" valueType={'date'}>
                                    {props.dateTo}
                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="Signing date" valueType={'date'}>
                                    {props.form?.getFieldValue('signingDate')}

                                </ProDescriptions.Item>
                                <ProDescriptions.Item label="File name" valueType={'text'}>
                                    {props?.fileList[0]?.name}

                                </ProDescriptions.Item>
                            </ProDescriptions>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="Choose_collab"
                            title="Choose collaborator"
                        // onFinish={async () => {
                        //     handleConfirm()
                        // }}
                        >
                            <ProCard
                                title="Collaborator list"
                                bordered
                                headerBordered
                                collapsible
                                style={{
                                    marginBlockEnd: 16,
                                    minWidth: 1000,
                                    maxWidth: '100%',
                                }}
                            >
                                <Span>Choose Collab to confirm</Span>
                                <ProList<DataItem>
                                    loading={props.loading}
                                    rowKey="id"
                                    style={{ width: '100%' }}
                                    headerTitle="List Collab"
                                    dataSource={props.dataSource}

                                    toolbar={{
                                        search: {
                                            onSearch: (value: string) => {
                                                handler.handleSearchCollabByEmail(value);
                                            },
                                            placeholder: 'Enter email'
                                        },
                                    }}
                                    metas={{
                                        id: {
                                            dataIndex: 'id',
                                            search: false
                                        },
                                        title: {
                                            dataIndex: 'row.account.name',
                                            render: (text, row, index, action) => (
                                                <>{row.name}</>
                                            )
                                        },
                                        avatar: {
                                            dataIndex: 'imgUrl',
                                            editable: false,
                                            search: false,
                                            render: (text, row, index, action) => (
                                                <img src={row.imgUrl} alt="Avatar" width={50} />),
                                            valueType: 'avatar'
                                        },
                                        content: {
                                            dataIndex: 'email',
                                            render: (text, row, index, action) => (
                                                <>{row.email}</>
                                            )
                                        },
                                        description: {
                                            dataIndex: 'account.phone',
                                            search: false,
                                            render: (text, row, index, action) => (
                                                <>{row.phone}</>
                                            )
                                        },
                                        subTitle: {
                                            dataIndex: 'isPremium',
                                            render: (text, row, index, action) => {
                                                return row.isPremium ? (
                                                    <Space size={0}>
                                                        <Tag color="yellow">Premium</Tag>
                                                    </Space>
                                                ) : (
                                                    <Space size={0}>
                                                        <Tag color="blue">Normal</Tag>
                                                    </Space>
                                                );
                                            },
                                            search: false
                                        },
                                    }}
                                    pagination={{
                                        showSizeChanger: true,
                                        onChange(page, pageSize) {
                                            handler.setPage(page);
                                            handler.setPageSize(pageSize);
                                        },
                                        pageSizeOptions: props.pageSizeOptions,
                                        defaultPageSize: 5,
                                        total: props.total
                                    }}
                                    rowSelection={props.rowSelection}
                                />
                            </ProCard>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="confirm_collabList"
                            title="Confirm collab list"

                        >
                            <ProCard
                                title="Collaborator list"
                                bordered
                                headerBordered
                                collapsible
                                style={{
                                    marginBlockEnd: 16,
                                    minWidth: 1000,
                                    maxWidth: '100%',
                                }}
                            >
                                <ProList<DataItem>
                                    rowKey="id"
                                    style={{ width: '100%' }}
                                    dataSource={props.collabPicker}
                                    metas={{
                                        title: {
                                            dataIndex: 'name',
                                            search: false,
                                            render: (text, row, index, action) => (
                                                <>{row.name}</>
                                            )
                                        },
                                        avatar: {
                                            dataIndex: 'imgUrl',
                                            editable: false,
                                            search: false,
                                            render: (text, row, index, action) => (
                                                <img src={row.imgUrl} alt="Avatar" width={50} />),
                                            valueType: 'avatar'
                                        },
                                        description: {
                                            dataIndex: 'phone',
                                            search: false,
                                            render: (text, row, index, action) => (
                                                <>{row.phone}</>
                                            )
                                        },
                                        content: {
                                            dataIndex: 'account.email',
                                            render: (text, row, index, action) => (
                                                <>{row.email}</>
                                            )
                                        },
                                        subTitle: {
                                            dataIndex: 'isPremium',
                                            render: (text, row, index, action) => {
                                                return row.isPremium ? (
                                                    <Space size={0}>
                                                        <Tag color="yellow">Premium</Tag>
                                                    </Space>
                                                ) : (
                                                    <Space size={0}>
                                                        <Tag color="blue">Normal</Tag>
                                                    </Space>
                                                );
                                            },
                                            search: false
                                        },
                                    }}
                                    pagination={{
                                        pageSize: 5,
                                    }}
                                />
                            </ProCard>

                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="success"
                            title="Success"
                        >
                            <Result
                                status="success"
                                title="Send contract successful"
                                subTitle=""
                                extra={[
                                    <Button type="primary" key="console" onClick={() => { navigate('/dashboard/contract-list') }}>
                                        Go to contract management
                                    </Button>,
                                    <Button key="buy" onClick={() => { window.location.reload() }}>Create more contract</Button>,
                                ]}
                            />
                        </StepsForm.StepForm>
                    </StepsForm>

                </Box>
            </Box>
        </Spin >
    )
}

export default AddContract;
