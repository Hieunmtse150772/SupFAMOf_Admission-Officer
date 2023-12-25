import { ModalForm, ProForm, ProFormDatePicker, ProFormText, ProFormTimePicker } from "@ant-design/pro-components";
import { ClassTrainingI, ClassTrainingViewI2 } from "models/classTraining.model";
import { FC } from "react";
import useEditRoomModalHook from "./useEditRoomModalHook";

interface AddMoreRoomModalProps {
    open: boolean,
    setOpenEditRoomModal: React.Dispatch<React.SetStateAction<boolean>>,
    fetchRoomList: () => void,
    classInfo: ClassTrainingI
}
const EditRoomModal: FC<AddMoreRoomModalProps> = ({ open, setOpenEditRoomModal, fetchRoomList, classInfo }) => {
    const { handler, props } = useEditRoomModalHook(fetchRoomList, setOpenEditRoomModal, classInfo);
    return (
        <>
            <ModalForm
                form={props.form}
                title="Edit room"
                open={open}
                onFinish={(value) => handler.handleAddRoom(value as ClassTrainingViewI2)}
                onOpenChange={setOpenEditRoomModal}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
                loading={props.loading}
                width={600}
            >
                <ProForm.Group>
                    <ProFormDatePicker
                        width="xl"
                        name="date"
                        label="Date"
                        fieldProps={{
                            disabledDate: props.disabledDate
                        }}
                        rules={[{ required: true, message: 'Date is required!' }]}
                        initialValue={classInfo?.date}
                    />
                    <ProFormText
                        width="xl"
                        name="class"
                        label="Class name"
                        rules={[{ required: true, message: 'Class name is required!' }]}
                        initialValue={classInfo?.class}

                    />
                    <ProFormTimePicker.RangePicker
                        width="xl"
                        name="timeFrom_timeTo"
                        label="Starting time - ending time"
                        rules={[{ required: true, message: 'Time is required!' }]}
                        initialValue={[classInfo?.timeFrom, classInfo?.timeTo]}
                    />
                </ProForm.Group>
            </ModalForm>
        </>
    )
}

export default EditRoomModal
