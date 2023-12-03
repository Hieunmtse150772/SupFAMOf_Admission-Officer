import { EditableProTable, ModalForm, ProColumns } from "@ant-design/pro-components";
import { TimePicker } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getClassTraining } from "features/classSlice";
import { ClassTrainingViewI } from "models/classTraining.model";
import { FC, Key, useEffect, useState } from "react";

interface ConfirmRegistrationModalProps {
    open: boolean,
    setOpenAssignClassModal: React.Dispatch<React.SetStateAction<boolean>>,
}

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
type DataSourceType = {
    id: React.Key;
    title?: string;
    readonly?: string;
    decs?: string;
    state?: string;
    created_at?: number;
    update_at?: number;
    children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        title: '活动名称一',
        readonly: '活动名称一',
        decs: '这个活动真好玩',
        state: 'open',
        created_at: 1590486176000,
        update_at: 1590486176000,
    },
    {
        id: 624691229,
        title: '活动名称二',
        readonly: '活动名称二',
        decs: '这个活动真好玩',
        state: 'closed',
        created_at: 1590481162000,
        update_at: 1590481162000,
    },
];

const AssignClassModal: FC<ConfirmRegistrationModalProps> = (
    {
        open,
        setOpenAssignClassModal,
    }
) => {
    const dispatch = useAppDispatch();
    const { classList, loading } = useAppSelector(state => state.class)
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly ClassTrainingViewI[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [timeFrom, setTimeFrom] = useState<Date | null>(null)
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
        'bottom',
    );
    console.log('classList: ', classList.data)
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys)
        },
    };
    const fetchClass = async () => {
        await dispatch(getClassTraining())
    }
    useEffect(() => {
        fetchClass()
    }, [])
    useEffect(() => {
        setDataSource(classList.data)
    }, [classList])
    const columns: ProColumns<ClassTrainingViewI>[] = [
        {
            title: 'Class Name',
            dataIndex: 'class',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: 'Class name is required' }] : [],
                };
            },
            editable: (text, record, index) => {
                return index !== 0;
            },
            width: '15%',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            valueType: 'date',
            tooltip: 'Start date',
            width: '15%',
        },
        {
            title: 'Starting Time',
            dataIndex: 'timeFrom',
            valueType: 'time',
            tooltip: 'Starting time',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: 'Starting Time is required' }] : [],
                };
            },
            width: '15%',
            renderFormItem: (_, { record }) => {
                const handleSelect = (value: any) => {
                    if (value) {
                        setTimeFrom(value);
                    } else setTimeFrom(null);

                    console.log('Selected value:', value);
                };

                return (
                    <TimePicker
                        onChange={handleSelect}
                    // Other TimePicker props...
                    />
                );
            },
        },
        {
            title: 'Ending Time',
            dataIndex: 'timeTo',
            valueType: 'time',
            tooltip: 'Ending time',
            width: '15%',
            renderFormItem: (_, { record }) => {
                const handleSelect = (value: any) => {
                    console.log('Selected value:', value);
                };

                return (
                    <TimePicker
                        disabled={Boolean(timeFrom === null)}
                        onSelect={handleSelect}
                    // Other TimePicker props...
                    />
                );
            },
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            readonly: true
        },
        {
            title: 'Action',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    Edit
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    Delete
                </a>,
            ],
        },
    ];

    return (
        <ModalForm
            title="Chose class to assign"
            open={open}
            // onFinish={(value) => handleCreatePostTitle(value)}
            onOpenChange={setOpenAssignClassModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
            width={1000}
        >
            <EditableProTable<ClassTrainingViewI>
                rowKey="id"
                headerTitle="Class training"
                scroll={{
                    x: 960,
                }}
                loading={false}
                rowSelection={rowSelection}
                columns={columns}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                        await waitTime(2000);
                    },
                    onChange: setEditableRowKeys,
                }}
                recordCreatorProps={{
                    newRecordType: 'dataSource',
                    record: (index, dataSource) => ({
                        id: (Math.random() * 1000000).toFixed(0),
                    }),
                }}
            />
        </ModalForm>

    )
}

export default AssignClassModal;
