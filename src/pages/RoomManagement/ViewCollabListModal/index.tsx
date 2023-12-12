import { ModalForm } from "@ant-design/pro-components";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { TrainingRegistrationsI } from "models/classTraining.model";
import { FC } from "react";
import useViewCollabListModalHook from "./useViewCollabListModalHook";

interface ViewCollabListProps {
    open: boolean,
    setOpenViewCollabListModal: React.Dispatch<React.SetStateAction<boolean>>,
    collabList: TrainingRegistrationsI[],
    eventDayId: string,
    fetchRooms: () => void
}

const ViewCollabListModal: FC<ViewCollabListProps> = ({
    open,
    setOpenViewCollabListModal,
    collabList,
    eventDayId,
    fetchRooms
}) => {
    const { handler, props } = useViewCollabListModalHook(collabList, eventDayId, setOpenViewCollabListModal, fetchRooms);
    console.log('collabList: ', collabList)
    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewCollabListModal}
            loading={props.isLoading}
            onFinish={async (value) => {
                handler.handleConfirmCheckAttendance(value)
            }}
            title='Collaborator list'
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'
                }
            }}
        >
            {
                collabList && (
                    <SFAMOGridForModal
                        handleSearch={handler.handleSearch}
                        handleTableChange={handler.handleActionChange}
                        pageSizeOptions={props.pageSizeOptions}
                        total={collabList.length}
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

export default ViewCollabListModal;
