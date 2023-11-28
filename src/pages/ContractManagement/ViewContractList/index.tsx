import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import { useNavigate } from "react-router";
import AddContractModal from "../AddContractModal";
import useViewContractHook from "./useViewContractHook";

const ViewContract = () => {
    const { handler, props, expandedRowRender } = useViewContractHook();
    const navigate = useNavigate()
    const AddContractButton = (
        <Button
            type="primary"
            key="primary"
            onClick={() => navigate('/dashboard/add-contract')}
        >
            < PlusOutlined rev={undefined} /> New
        </Button >)

    return (
        <>
            {props.contractAPI && (
                <SFAMOGrid
                    handleSearch={handler.handleSearch}
                    toolbar={AddContractButton}
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page} pageSize={props.pageSize}
                    rows={props.rows} columns={props?.columns}
                    isLoading={props.isLoading}
                    action={handler.handleAddContract}
                    expandedRowRender={expandedRowRender}
                    rowsExpanded={props.rowsExpanded}
                />
            )}
            {(props.addCollabModal && props.loading !== true && props.accountList !== null) &&
                <AddContractModal
                    fetchContractList={handler.fetchContractList}
                    open={props.addCollabModal}
                    setOpenAddCollabModal={handler.setAddCollabModal}
                    collabList={props.accountList}
                    amountUnConfirmed={props.accountList.length}
                    contractId={props.contractId}
                />
            }
        </>
    )
}

export default ViewContract;
