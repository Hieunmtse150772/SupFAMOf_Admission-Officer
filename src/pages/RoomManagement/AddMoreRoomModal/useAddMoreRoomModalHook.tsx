import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProForm } from "@ant-design/pro-components";
import { Modal, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { useAppDispatch } from "app/store";
import dayjs from "dayjs";
import { createClass } from "features/classSlice";
import ClassCreated from "models/classCreated.model";
import { ClassTrainingViewI2 } from "models/classTraining.model";

function useAddMoreRoomModalHook(fetchClass: () => void, setOpenAddMoreRoomModal: React.Dispatch<React.SetStateAction<boolean>>) {
    const dispatch = useAppDispatch();
    const [form] = ProForm.useForm();
    const { confirm } = Modal;
    const handleAddRoom = async (value: ClassTrainingViewI2) => {
        confirm({
            title: `Do you want to create room?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                if (value) {
                    console.log('timeFrom_timeTo: ', value?.timeFrom_timeTo)
                    const params: ClassCreated = {
                        date: value.date as string, // Assuming date is a string type
                        class: value.class as string, // Assuming class is a string type
                        timeFrom: value.timeFrom_timeTo[0], // Get hours from timeFrom
                        timeTo: value.timeFrom_timeTo[1], // Assuming timeTo is a moment type
                    };
                    dispatch(createClass(params)).then((response: any) => {
                        console.log('response: ', response)
                        if (response?.payload?.data?.status?.success) {
                            message.success('Create class success');
                            setOpenAddMoreRoomModal(false);
                            form.resetFields();
                            fetchClass();
                        } else {
                            message.error(response?.payload?.message);
                        }
                    }).catch((error) => {
                        console.log("Error in getting the data", error)
                    })
                }
            },
            onCancel() {
            },
        });

    }
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    const handler = {
        handleAddRoom
    }
    const props = {
        form,
        disabledDate
    }
    return { handler, props }
}

export default useAddMoreRoomModalHook
