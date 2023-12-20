import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC } from "react";
import useViewRequest from "./useViewAttendanceHook";

interface ViewAttendanceModalProps {
    open: boolean,
    setOpenCheckAttendanceModal: React.Dispatch<React.SetStateAction<boolean>>,
    positionId: string,
    fetchPost: () => void
}

const ViewAttendanceModal: FC<ViewAttendanceModalProps> = ({ open, setOpenCheckAttendanceModal, positionId, fetchPost }) => {
    const { handler, props } = useViewRequest(positionId, fetchPost, setOpenCheckAttendanceModal);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenCheckAttendanceModal}
            onFinish={async (value) => {
                handler.handleConfirmCheckAttendance(value)
            }}

            title='Attendance'
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'
                }
            }}
        >
            {
                props?.attendenceList && (
                    <SFAMOGridForModal
                        handleSearch={handler.handleSearch}
                        handleTableChange={handler.handleActionChange}
                        pageSizeOptions={props.pageSizeOptions}
                        total={props.total}
                        onPageChange={handler.onPageChange}
                        onChangePageSize={handler.onChangePageSize}
                        page={props.page}
                        pageSize={props.pageSize}
                        rows={props.rows}
                        columns={props?.columns}
                        isLoading={props.loading}
                    />
                )
            }
        </ModalForm>

    )
}

export default ViewAttendanceModal;
