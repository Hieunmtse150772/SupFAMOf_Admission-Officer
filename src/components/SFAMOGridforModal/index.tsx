import { ActionType, ProColumns, ProTable, RequestData } from "@ant-design/pro-components";
import { SortOrder, TableLocale } from "antd/es/table/interface";
import React, { useRef } from "react";
import { useNavigate } from "react-router";
import './style.scss';
interface SFAMOGridProps {
    isLoading: boolean;
    rows: any[];
    columns: ProColumns[];
    rowsExpanded?: any[];
    page: number;
    total?: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onChangePageSize: (size: number) => void;
    pageSizeOptions: number[];
    expandedRowRender?: (record: any) => JSX.Element | null;
    action?: () => void;
    toolbar?: React.ReactNode;
    handleTableChange?: (
        params: any,
        sort: Record<string, SortOrder>,
        filter: Record<string, (string | number)[] | null>
    ) => Promise<Partial<RequestData<any>>>;
    handleSearch: (value: any) => void,
}
const SFAMOGridForModal = ({ isLoading, rows, columns, rowsExpanded, page, total, pageSize, onPageChange, onChangePageSize, pageSizeOptions, expandedRowRender, action, toolbar, handleTableChange, handleSearch }: SFAMOGridProps) => {
    let navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    console.log('total: ', total)
    const customLocale: TableLocale = {
        filterTitle: 'Custom Filter Title',
        filterConfirm: 'Custom Confirm',
        filterReset: 'Custom Reset',
        selectAll: 'Select all'
        // Add more customizations as needed...
    };
    const customPagination = {
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: pageSizeOptions,
        onChange: (page: number) => onPageChange(page),
        onShowSizeChange: (current: number, size: number) => onChangePageSize(size),
    };
    return (
        <>
            <ProTable
                search={false}
                actionRef={actionRef}
                request={handleTableChange}
                expandable={{ expandedRowRender }}
                toolBarRender={() => [toolbar]}
                scroll={{ x: 900 }}
                onSubmit={value => handleSearch(value)}
                dataSource={rows} columns={columns}
                loading={isLoading}
                locale={customLocale}
                pagination={customPagination}
            >
            </ProTable>
        </>
    )
}

export default SFAMOGridForModal;
