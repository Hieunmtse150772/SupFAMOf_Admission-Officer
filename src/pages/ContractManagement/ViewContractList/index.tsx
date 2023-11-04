import SFAMOGrid from "components/SFAMOGrid";
import CreateContractModal from "../CreateContract";
import useViewContractHook from "./useViewContractHook";

const ViewContract = () => {
    const { handler, props } = useViewContractHook();

    return (
        <>
            {props.contractAPI && (
                <SFAMOGrid
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page} pageSize={props.pageSize}
                    rows={props.rows} columns={props?.columns}
                    isLoading={props.isLoading}
                    action={handler.handleAddContract} />
            )}
            {props.openAddContractModal &&
                <CreateContractModal
                    open={props.openAddContractModal}
                    setOpenAddContractModal={handler.setOpenAddContractModal} />
            }
        </>
    )
}

export default ViewContract;
