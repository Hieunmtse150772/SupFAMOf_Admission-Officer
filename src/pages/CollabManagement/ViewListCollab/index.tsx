import SFAMOGrid from "components/SFAMOGrid";
import useViewCollabListHook from "./useViewCollabListHook";

const ViewCollabList = () => {
    const { handler, props } = useViewCollabListHook();

    return (
        <>
            {props.collabAPI && (
                <SFAMOGrid
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page}
                    pageSize={props.pageSize}
                    rows={props.rows}
                    columns={props?.columns}
                    isLoading={props.isLoading} />
            )}
        </>
    )
}

export default ViewCollabList;
