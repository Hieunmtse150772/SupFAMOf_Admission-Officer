import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC } from "react";
import useViewRequest from "./useViewAttendanceHook";

interface ViewAttendenceModalProps {
    open: boolean,
    setOpenViewRequestModal: React.Dispatch<React.SetStateAction<boolean>>,
    positionId: string,
    fetchPost: () => void
}

const ViewAttendanceModal: FC<ViewAttendenceModalProps> = ({ open, setOpenViewRequestModal, positionId, fetchPost }) => {
    const { handler, props } = useViewRequest(positionId, fetchPost);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewRequestModal}
            onFinish={async (value) => {
                handler.handleConfirmCheckAttendance(value)
            }}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'
                }
            }}
        >
            {
                props?.requests && (
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
                        isLoading={props.isLoading}
                    />
                )
            }
        </ModalForm>

    )
}

export default ViewAttendanceModal;
