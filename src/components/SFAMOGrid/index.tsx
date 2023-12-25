import { ActionType, ProColumns, ProTable, RequestData } from "@ant-design/pro-components";
import { RowSelectionType, SortOrder, TableLocale } from "antd/es/table/interface";
import React, { Key, useRef } from "react";
import { useNavigate } from "react-router";
import './style.scss';
interface SFAMOGridProps {
    title?: string,
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
    rowSelection?: {
        type: RowSelectionType,
        selectedRowKeys: any[],
        onChange: (keys: Key[]) => void,
        getCheckboxProps: (record: any) => {
            disabled: boolean, // Column configuration not to be checked
            name: string,
        },
    }
}
const SFAMOGrid = ({ title, isLoading, rows, columns, rowsExpanded, page, total, pageSize, onPageChange, onChangePageSize, pageSizeOptions, expandedRowRender, action, toolbar, handleTableChange, handleSearch, rowSelection }: SFAMOGridProps) => {
    let navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    console.log('total: ', total)
    const customLocale: TableLocale = {
        filterTitle: 'Custom Filter Title',
        filterConfirm: 'Search',
        filterReset: 'Reset',
        selectAll: 'Select all',
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
                actionRef={actionRef}
                bordered={true}
                headerTitle={title ? title : ''}
                request={handleTableChange}
                scroll={{ x: 900 }}
                expandable={{ expandedRowRender }}
                toolBarRender={() => [toolbar]}
                onSubmit={value => handleSearch(value)}
                dataSource={rows}
                columns={columns}
                loading={isLoading}
                locale={customLocale}
                pagination={customPagination}
                rowSelection={rowSelection}
            >
            </ProTable>
        </>
    )
}

export default SFAMOGrid;
