import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { LightFilter, ModalForm, ProFormRadio } from "@ant-design/pro-components";
import { Button } from "antd";
import SFAMOGridForModal from "components/SFAMOGridforModal";
import { FC, useRef } from "react";
import './style.scss';
import useViewRequest from "./useViewRequest";
interface ViewRequestChangePositionModalProps {
    open: boolean,
    setOpenViewRequestModal: React.Dispatch<React.SetStateAction<boolean>>,
    postId: number,
    postCode: string,
    fetchPost: () => void,
}

const ViewRequestChangePositionModal: FC<ViewRequestChangePositionModalProps> = ({ open, setOpenViewRequestModal, postCode, postId, fetchPost }) => {
    const { handler, props } = useViewRequest(postId, fetchPost);
    const yourRef = useRef(null);

    const LightFilterCustom = (
        <div ref={yourRef}>
            <LightFilter
                key="light-filter"
                initialValues={{
                    sex: 1,
                }}
                bordered
                collapseLabel={<FilterOutlined rev={undefined} />}
                onFinish={async (values) => handler.handleSetStatus(values)}
            >
                <ProFormRadio.Group
                    name="radio"
                    radioType="button"
                    initialValue={1}
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
                            label: 'Approved',
                        },
                        {
                            value: 3,
                            label: 'Rejected',
                        },
                    ]}
                />
            </LightFilter>
        </div>

    )
    const ButtonAddNew = (
        <Button
            type="primary"
            key="primary"
        // onClick={handler.handleAddPost}
        >
            < PlusOutlined rev={undefined} /> New
        </Button >
    )
    return (
        <ModalForm
            width={1190}
            open={open}
            onOpenChange={setOpenViewRequestModal}
            onFinish={async () => {
                setOpenViewRequestModal(false)
            }}
            className="request-modal"
            title={`Request change position post code: ${postCode}`}
            submitter={{
                searchConfig: {
                    submitText: 'Ok',
                }
            }}
        >
            {
                props?.requests && (
                    <SFAMOGridForModal
                        toolbar={LightFilterCustom}
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
                    />
                )
            }
        </ModalForm>

    )
}

export default ViewRequestChangePositionModal;
