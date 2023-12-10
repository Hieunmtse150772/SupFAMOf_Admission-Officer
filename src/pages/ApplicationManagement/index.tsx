import SFAMOGrid from "components/SFAMOGrid";
import ReplyApplicationModal from "./ReplyApplicationModal";
import useViewApplicationHook from "./useViewApplicationHook";

function ViewApplicationList() {
    const { props, handler } = useViewApplicationHook()
    return (
        <>
            {props.applications && (
                <SFAMOGrid
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
                    isLoading={props.loading} />
            )}
            {props.applicationId && props.isApprove !== undefined && props.openReplyApplicationModal &&
                <ReplyApplicationModal
                    fetchApplicationList={handler.fetchApplicationList}
                    open={props.openReplyApplicationModal}
                    setOpenReplyModal={handler.setOpenReplyApplicationModal}
                    applicationId={props.applicationId}
                    status={props.isApprove}
                >

                </ReplyApplicationModal>
            }
        </>
    )
}

export default ViewApplicationList;
