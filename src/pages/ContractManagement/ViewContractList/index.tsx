import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import { useNavigate } from "react-router";
import useViewContractHook from "./useViewContractHook";

const ViewContract = () => {
    const { handler, props } = useViewContractHook();
    const navigate = useNavigate()
    const AddContractButton = (
        <Button
            type="primary"
            key="primary"
            onClick={() => navigate('/add-contract')}
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
                    action={handler.handleAddContract} />
            )}
        </>
    )
}

export default ViewContract;
