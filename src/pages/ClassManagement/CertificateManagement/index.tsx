import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import { useNavigate, useParams } from "react-router";
import AssignClassModal from "../AssignClassModal";
import UseViewClassHook from "./useViewClassHook";

const Index = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { props, handler } = UseViewClassHook();
    // Use the id or perform other logic here
    const AssignRegistration = (
        <Button
            type="primary"
            key="primary"
            disabled={props.selectedRowsState.length === 0}
            onClick={handler.hanldeOpenAssignClass}
        >
            < CheckCircleOutlined rev={undefined} /> Assign class
        </Button >
    )
    return (
        <div
            style={{
                backgroundColor: "#eee",
                margin: -24,
                padding: 24,
            }}
        >
            {
                props?.certificateRegistrationList && (
                    <SFAMOGrid
                        toolbar={[AssignRegistration]}
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
                        setSelectedRows={handler.setSelectedRows}
                    />
                )

            }
            {props.openAssignClassModal && <AssignClassModal
                hanldeAssignClass={handler.handleAssignClass}
                open={props.openAssignClassModal}
                setOpenAssignClassModal={handler.setOpenAssignClassModal}>
            </AssignClassModal>}
        </div>
    );
};

export default Index;
