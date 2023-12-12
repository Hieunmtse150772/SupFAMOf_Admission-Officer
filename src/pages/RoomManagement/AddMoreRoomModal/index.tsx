import { ModalForm, ProForm, ProFormDatePicker, ProFormText, ProFormTimePicker } from "@ant-design/pro-components";
import { ClassTrainingViewI2 } from "models/classTraining.model";
import { FC } from "react";
import useAddMoreRoomModalHook from "./useAddMoreRoomModalHook";

interface AddMoreRoomModalProps {
    open: boolean,
    setOpenAddMoreRoomModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchRoomList: () => void,
}
const AddMoreRoomModal: FC<AddMoreRoomModalProps> = ({ open, setOpenAddMoreRoomModal, fetchRoomList }) => {
    const { handler, props } = useAddMoreRoomModalHook(fetchRoomList, setOpenAddMoreRoomModal);
    return (
        <>
            <ModalForm
                form={props.form}
                title="Add room"
                open={open}
                onFinish={(value) => handler.handleAddRoom(value as ClassTrainingViewI2)}
                onOpenChange={setOpenAddMoreRoomModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                width={600}
            >
                <ProForm.Group>
                    <ProFormDatePicker
                        width="xl"
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Date is required!' }]}

                    />
                    <ProFormText
                        width="xl"
                        name="class"
                        label="Class name"
                        rules={[{ required: true, message: 'Class name is required!' }]}
                    />
                    <ProFormTimePicker.RangePicker
                        width="xl"
                        name="timeFrom_timeTo"
                        label="Starting time - ending time"
                        rules={[{ required: true, message: 'Time is required!' }]}

                    />
                </ProForm.Group>
            </ModalForm>
        </>
    )
}

export default AddMoreRoomModal
