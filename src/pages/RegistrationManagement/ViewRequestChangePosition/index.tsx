import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC } from "react";
import useViewRequest from "./useViewRequest";

interface ViewRequestChangePositionModalProps {
    open: boolean,
    setOpenViewRequestModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: number
}

const ViewRequestChangePositionModal: FC<ViewRequestChangePositionModalProps> = ({ open, setOpenViewRequestModal, postId }) => {
    const { handler, props } = useViewRequest(postId);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewRequestModal}
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

export default ViewRequestChangePositionModal;
