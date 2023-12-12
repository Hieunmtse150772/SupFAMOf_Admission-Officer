import { ExclamationCircleFilled } from "@ant-design/icons";
import { ProForm } from "@ant-design/pro-components";
import { Modal, message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { updateClass } from "features/classSlice";
import { ClassTrainingI, ClassTrainingViewI2 } from "models/classTraining.model";
import ClassUpdated from "models/classUpdated.model";

function useEditRoomModalHook(fetchClass: () => void, setOpenEditPostModal: React.Dispatch<React.SetStateAction<boolean>>, classInfo: ClassTrainingI) {
    const dispatch = useAppDispatch();
    const [form] = ProForm.useForm();
    const { confirm } = Modal;
    const { loading } = useAppSelector(state => state.class)
    const handleAddRoom = async (value: ClassTrainingViewI2) => {
        confirm({
            title: `Do you want to edit room?`,
            icon: <ExclamationCircleFilled rev={undefined} />,
            onOk: async () => {
                if (value) {
                    console.log('timeFrom_timeTo: ', value?.timeFrom_timeTo)
                    const params: ClassUpdated = {
                        id: classInfo.id,
                        date: value.date as string, // Assuming date is a string type
                        class: value.class as string, // Assuming class is a string type
                        timeFrom: value.timeFrom_timeTo[0], // Get hours from timeFrom
                        timeTo: value.timeFrom_timeTo[1], // Assuming timeTo is a moment type
                    };
                    dispatch(updateClass(params)).then((response: any) => {
                        console.log('response: ', response)
                        if (response?.payload?.data?.status?.success) {
                            message.success('Update class success');
                            setOpenEditPostModal(false);
                            form.resetFields();
                            fetchClass();
                        } else {
                            message.error(response?.payload?.message);
                        }
                    })
                }
            },
            onCancel() {
            },
        });

    }
    const handler = {
        handleAddRoom
    }
    const props = {
        form,
        loading
    }
    return { handler, props }
}

export default useEditRoomModalHook