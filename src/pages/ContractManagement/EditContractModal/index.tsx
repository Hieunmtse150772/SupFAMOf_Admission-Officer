import { ModalForm, ProForm, ProFormDatePicker, ProFormDateRangePicker, ProFormMoney, ProFormText, ProFormUploadDragger } from "@ant-design/pro-components";
import { Grid } from "@mui/material";
import { Small } from "components/Typography";
import ContractInfo from "models/contract.model";
import { FC } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './style.scss';

import { Button } from "antd";
import useEditContractModalHook, { ContractFormValue } from "./useEditContractModalHook";
interface EditContractModalProps {
    open: boolean,
    setOpenEditContractModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchContractList: () => void,
    contractInfo: ContractInfo
}
const EditContractModal: FC<EditContractModalProps> = ({ open, setOpenEditContractModal, fetchContractList, contractInfo }) => {
    const { handler, props } = useEditContractModalHook(fetchContractList, setOpenEditContractModal, contractInfo);
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };
    props.form.setFieldValue('description', contractInfo?.contractDescription);

    return (
        <>
            <ModalForm
                form={props.form}
                title="Edit contract"
                open={open}
                onFinish={(value) => handler.handleSubmitEditContract(value as ContractFormValue)}
                onOpenChange={setOpenEditContractModal}
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
                // loading={props.loading}
                width={1190}
            >
                <ProForm.Group>
                    <Grid container spacing={1}>
                        <Grid item sm={5.2}>
                            <ProForm.Group>
                                <ProFormText
                                    width="xl"
                                    name="contractName"
                                    label="Contract name"
                                    required
                                    initialValue={contractInfo?.contractName}
                                    rules={[{ required: true, message: 'Please enter Name!' }]}
                                />
                                <ProFormDatePicker
                                    name="signingDate"
                                    label="Signing date"
                                    width='xl'
                                    initialValue={contractInfo?.signingDate}
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
                                    label="Start date - end date"
                                    width='xl'
                                    initialValue={[contractInfo?.startDate, contractInfo?.endDate]}
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
                                    initialValue={contractInfo?.totalSalary}
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
                                        defaultValue={contractInfo?.contractDescription}
                                        onChange={(newValue: string) => field.setFieldValue('description', newValue)}
                                        style={{ paddingBottom: 30, paddingTop: 9, height: 300 }}
                                    />
                                    </div>

                                )}
                            </ProForm.Item>
                            <span className="error">{props.error}</span>
                        </Grid>
                    </Grid>
                </ProForm.Group>
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
                    initialValue={props.fileList}
                    title="Upload"
                    description='Choose template file contract (docs, prf,..)'
                    required
                    rules={[{ required: true, message: 'Add 1 file docs, pdf!' }]} />
            </ModalForm>
        </>
    )
}

export default EditContractModal
