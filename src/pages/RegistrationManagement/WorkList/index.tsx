import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC } from "react";
import useViewWorkListHook from "./useViewWorkListHook";

interface ViewWorkListModalProps {
    open: boolean,
    setOpenViewWorkListModal: React.Dispatch<React.SetStateAction<boolean>>,
    positionId: string,
    fetchPost: () => void
}

const ViewWorkListModal: FC<ViewWorkListModalProps> = ({ open, setOpenViewWorkListModal, positionId, fetchPost }) => {
    const { handler, props } = useViewWorkListHook(positionId, fetchPost);

    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewWorkListModal}
            onFinish={async (value) => {
                setOpenViewWorkListModal(false);
            }}
            title={`Work list of ${props.workLists?.data[0]?.position?.positionName}`}
            submitter={{
                searchConfig: {
                    submitText: 'Ok',
                    resetText: 'Cancel'
                }
            }}
        >
            {
                props?.workLists && (
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

export default ViewWorkListModal;
