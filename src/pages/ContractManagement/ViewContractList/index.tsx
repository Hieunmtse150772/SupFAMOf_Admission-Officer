import { PlusOutlined } from "@ant-design/icons";
import { Button, Descriptions, DescriptionsProps, Drawer } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import moment from "moment";
import ReactHtmlParser from 'react-html-parser';
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
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Title',
            children: props.currentRow?.contractName,
            span: 2
        },
        {
            key: '2',
            label: 'Description',
            children: ReactHtmlParser(props.currentRow?.contractDescription ? props.currentRow?.contractDescription : ''),
            span: 2
        },
        {
            key: '3',
            label: 'Salary',
            children: Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
            }).format(props.currentRow?.totalSalary ? props.currentRow?.totalSalary : 0),
            span: 2

        },
        {
            key: '4',
            label: 'Create at',
            children: moment(props.currentRow?.createAt).format('YYYY-MM-DD'),
            span: 2

        },
        {
            key: '5',
            label: 'Starting date',
            children: moment(props.currentRow?.startDate).format('YYYY-MM-DD'),
            span: 2

        },
        {
            key: '6',
            label: 'Ending date',
            children: moment(props.currentRow?.endDate).format('YYYY-MM-DD'),
            span: 2
        },
    ];
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
            <Drawer
                width={1000}
                open={props.showDetail}
                onClose={() => {
                    handler.setCurrentRow(null);
                    handler.setShowDetail(false);
                }}
                closable={false}
            >
                {props.currentRow && (
                    (() => {
                        return (
                            <>
                                <Descriptions style={{ marginTop: 20 }} title={props.currentRow?.contractName} bordered items={items} />
                            </>
                        );
                    })()
                )}
            </Drawer>
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
