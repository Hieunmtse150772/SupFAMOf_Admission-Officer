import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC } from "react";
import useViewRequest from "./useViewAttendanceHook";

interface ViewWorkListModalProps {
    open: boolean,
    setOpenViewWorkListModal: React.Dispatch<React.SetStateAction<boolean>>,
    positionId: string,
    fetchPost: () => void
}

const ViewWorkListModal: FC<ViewWorkListModalProps> = ({ open, setOpenViewWorkListModal, positionId, fetchPost }) => {
    const { handler, props } = useViewRequest(positionId, fetchPost);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewWorkListModal}
            // onFinish={async (value) => {
            //     handler.handleConfirmCheckAttendance(value)
            // }}
            title='Work list'
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

export default ViewWorkListModal;
