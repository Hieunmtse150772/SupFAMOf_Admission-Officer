import SFAMOGrid from "components/SFAMOGrid";
import useViewCollablistHook from "./useViewCollablistHook";

const ViewCollabList = () => {
    const { handler, props } = useViewCollablistHook();

    return (
        <>
            {props.collabAPI && (<SFAMOGrid pageSizeOptions={props.pageSizeOptions} total={props.total} onPageChange={handler.onPageChange} onChangePageSize={handler.onChangePageSize} page={props.page} pageSize={props.pageSize} rows={props.rows} columns={props?.columns} isLoading={props.isLoading} />
            )}
        </>
    )
}

export default ViewCollabList;
