import { ModalForm, ProForm, ProFormDateRangePicker, ProFormMoney, ProFormText, ProFormTextArea, ProFormUploadButton } from "@ant-design/pro-components";
import { Grid } from "@mui/material";
import { FC } from "react";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import useAddContractModalHook from "./useAddContractModalHook";

interface AddContractProps {
    open: boolean,
    setOpenAddContractModal: React.Dispatch<React.SetStateAction<boolean>>,
}
const CreateContractModal: FC<AddContractProps> = ({ open, setOpenAddContractModal }) => {

    const { handler, props } = useAddContractModalHook();

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
            title={'Create contract'}
            open={open}
            // onFinish={(value) => handler.handleUpdatePost(value)}
            onOpenChange={setOpenAddContractModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'
                }
            }}
        >
            <Grid container spacing={1}>
                <Grid item sm={6}>
                    <ProForm.Group>
                        <ProFormText
                            width="xl"
                            name="contractName"
                            label="Contract name"
                            required
                            rules={[{ required: true, message: 'Name is requird!' }]}

                        />
                        <ProFormDateRangePicker
                            name="dateFrom-dateTo"
                            label="Date From-To"
                            width='xl'
                            rules={[{ required: true, message: 'Chose date from & date to!' }]}
                        />
                        <ProFormUploadButton
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
                        />
                        <ProFormMoney
                            label="Salary"
                            name="salary"
                            width="md"
                            customSymbol="đ"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            locale="en-VN"
                        />
                    </ProForm.Group>
                </Grid>
                <Grid item sm={6}>
                    <ProForm.Group>
                        <ProFormTextArea
                            width="xl"
                            name="contractDescription"
                            label="Contract description"
                            rules={[{ required: true, message: 'Description is requird!' }]}
                        />

                    </ProForm.Group>

                </Grid>
            </Grid>
        </ModalForm >
    )
}

export default CreateContractModal;
