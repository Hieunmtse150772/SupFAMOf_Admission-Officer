import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import AttendenceDto from "dtos/Attendence/attendence.dto";
import { FC } from "react";
import useViewRequest from "./useViewAttendanceHook";

interface ViewAttendanceModalProps {
    open: boolean,
    setOpenCheckAttendanceModal: React.Dispatch<React.SetStateAction<boolean>>,
    positionId: string,
    fetchPost: () => void,
    attendanceList: AttendenceDto
}

const ViewAttendanceModal: FC<ViewAttendanceModalProps> = ({ open, setOpenCheckAttendanceModal, positionId, fetchPost, attendanceList }) => {
    const { handler, props } = useViewRequest(positionId, fetchPost, setOpenCheckAttendanceModal);

    const rows = attendanceList.data.map((attendence, index) => ({
        count: index,
        key: attendence?.id,
        id: attendence?.id,
        name: attendence?.account?.name,
        email: attendence?.account?.email,
        phone: attendence?.postRegistration?.post?.account?.phone,
        imgUrl: attendence?.account?.imgUrl,
        idStudent: attendence?.postRegistration?.post?.account?.accountInformation?.idStudent,
        isPremium: attendence?.postRegistration?.post?.account?.isPremium,
        status: attendence?.status,
        checkInTime: attendence.checkInTime,
        checkOutTime: attendence.checkOutTime,
        positionName: attendence.postRegistration.position.positionName
    }));
    console.log('rows: ', rows);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenCheckAttendanceModal}
            onFinish={async (value) => {
                handler.handleConfirmCheckAttendance(value)
            }}
            loading={props.loading}
            title='Attendance'
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'
                }
            }}
        >
            {
                attendanceList && (
                    <SFAMOGridForModal
                        handleSearch={handler.handleSearch}
                        handleTableChange={handler.handleActionChange}
                        pageSizeOptions={props.pageSizeOptions}
                        total={props.total}
                        onPageChange={handler.onPageChange}
                        onChangePageSize={handler.onChangePageSize}
                        page={props.page}
                        pageSize={props.pageSize}
                        rows={rows}
                        columns={props?.columns}
                        isLoading={props.loading}
                    />
                )
            }
        </ModalForm>

    )
}

export default ViewAttendanceModal;
