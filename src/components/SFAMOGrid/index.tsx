import { ProColumns, ProTable } from "@ant-design/pro-components";
import { PlusOneOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Badge, Table, TableColumnsType } from "antd";
import { TableLocale } from "antd/es/table/interface";
import { ListPositionI } from "models/post.model";
import { useState } from "react";

interface SFAMOGridProps {
    isLoading: boolean;
    rows: any[];
    columns: ProColumns[];
    rowsExpanded: ListPositionI[];
}
interface ExpandedDataType {
    id: number,
    postId: number,
    positionName: string,
    amount: number,
    salary: number
}
const SFAMOGrid = ({ isLoading, rows, columns, rowsExpanded }: SFAMOGridProps) => {
    const [selectedRowsState, setSelectedRows] = useState<any[]>([]);

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
    const expandedRowRender = (record: any) => {
        const columnsExpanded: TableColumnsType<ExpandedDataType> = [
            { title: 'id', dataIndex: 'id', key: 'id' },
            { title: 'postId', dataIndex: 'postId', key: 'postId' },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            { title: 'positionName', dataIndex: 'positionName', key: 'positionName' },
            { title: 'amount', dataIndex: 'amount', key: 'amount' },
            { title: 'salary', dataIndex: 'salary', key: 'salary' },

        ];

        const data = rowsExpanded.find((value) => value.key === record?.id);
        console.log('data: ', data)
        return <Table columns={columnsExpanded} dataSource={data?.position} pagination={false} />;
    };
    return (
        <ProTable
            expandable={{ expandedRowRender }}

            headerTitle={'Post list'}
            toolBarRender={() => [
                <Button color='primary' variant="contained" style={{ float: 'right' }}><PlusOneOutlined />New</Button>

            ]}
            onSubmit={value => handleSubmit(value)}
            dataSource={rows} columns={columns} loading={isLoading}
            rowSelection={{
                onChange: (_, selectedRows) => {
                    setSelectedRows(selectedRows);
                },
            }}
            locale={customLocale}
        >

        </ProTable>
    )
}

export default SFAMOGrid;
