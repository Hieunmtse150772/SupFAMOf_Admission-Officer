import SFAMOGrid from "components/SFAMOGrid";
import useViewAdmissionListHook from "./useViewAdmissionListHook";

function ViewAdmissionList() {
    const { handler, props } = useViewAdmissionListHook();
    return (
        <>
            {props.admissionList && (
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
        </>
    )
}

export default ViewAdmissionList;
