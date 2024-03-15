import { CheckCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { LightFilter, ProFormRadio } from "@ant-design/pro-components";
import { Button } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import AssignClassModal from "../AssignClassModal";
import UseViewClassHook from "./useViewClassHook";

const Index = () => {
    const navigate = useNavigate();
    const yourRef = useRef(null);

    const { id } = useParams<{ id: string }>();
    const { props, handler } = UseViewClassHook();
    // Use the id or perform other logic here
    const AssignRegistration = (
        <Button
            type="primary"
            key="primary"
            disabled={props.selectedRowKeys.length === 0 || props.statusFilter === 3}
            onClick={handler.hanldeOpenAssignClass}
        >
            < CheckCircleOutlined rev={undefined} /> Assign room
        </Button >
    )
    useEffect(() => {

    }, [props.statusFilter])
    console.log('first: ', props.selectedRowKeys)
    const LightFilterCustom = (
        <div ref={yourRef}>
            <LightFilter
                key="light-filter2"
                bordered
                collapseLabel={<FilterOutlined rev={undefined} />}
                onFinish={async (values) => handler.handleSetStatus(values)}
            >
                <ProFormRadio.Group
                    name="radio"
                    radioType="button"
                    initialValue={props.statusFilter}
                    options={[
                        {
                            value: 0,
                            label: 'All',
                        },
                        {
                            value: 1,
                            label: 'Pending',
                        },
                        {
                            value: 2,
                            label: 'Assigned',
                        },
                        {
                            value: 3,
                            label: 'Passed',
                        },
                        {
                            value: 4,
                            label: 'Not passed',
                        },
                    ]}
                />
            </LightFilter>
        </div>

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
                        title={props.title}
                        toolbar={[LightFilterCustom, AssignRegistration]}
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
                        rowSelection={props.rowSelection}
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
