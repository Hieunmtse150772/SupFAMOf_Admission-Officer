import { PlusOutlined } from "@ant-design/icons";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { TableLocale } from "antd/es/table/interface";
import { ListPositionI } from "models/post.model";
import { useState } from "react";
import { useNavigate } from "react-router";
import './style.scss';
interface SFAMOGridProps {
    isLoading: boolean;
    rows: any[];
    columns: ProColumns[];
    rowsExpanded?: ListPositionI[];
    page: number;
    total?: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onChangePageSize: (size: number) => void;
    pageSizeOptions: number[];
    expandedRowRender?: (record: any) => JSX.Element | null;
}
const SFAMOGrid = ({ isLoading, rows, columns, rowsExpanded, page, total, pageSize, onPageChange, onChangePageSize, pageSizeOptions, expandedRowRender }: SFAMOGridProps) => {
    const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
    let navigate = useNavigate();

    console.log('total: ', total)
    const customLocale: TableLocale = {
        filterTitle: 'Custom Filter Title',
        filterConfirm: 'Custom Confirm',
        filterReset: 'Custom Reset',
        selectAll: 'Select all'
        // Add more customizations as needed...
    };
    const handleSubmit = (value: any) => {
        console.log(value)
    }


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
                expandable={{ expandedRowRender }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            navigate('/dashboard/add-post');
                        }}
                    >
                        <PlusOutlined rev={undefined} />New
                    </Button>,
                ]}
                onSubmit={value => handleSubmit(value)}
                dataSource={rows} columns={columns} loading={isLoading}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
                locale={customLocale}
                pagination={customPagination}

            >
            </ProTable>
        </>
    )
}

export default SFAMOGrid;
