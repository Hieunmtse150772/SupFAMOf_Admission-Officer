import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { ActionType, EditableProTable, ModalForm, ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, Popconfirm, Space, Tag, TimePicker, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { RowSelectionType } from "antd/es/table/interface";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import dayjs, { Dayjs } from "dayjs";
import { createClass, deleteClassById, getClassTraining } from "features/classSlice";
import ClassCreated from "models/classCreated.model";
import { ClassTrainingViewI, ClassTrainingViewI2 } from "models/classTraining.model";
import moment, { Moment } from "moment";
import { FC, Key, useEffect, useRef, useState } from "react";

interface ConfirmRegistrationModalProps {
    open: boolean,
    setOpenAssignClassModal: React.Dispatch<React.SetStateAction<boolean>>,
    hanldeAssignClass: (id: Key[]) => void,
}
type RangeType = 'start' | 'end';
type RangeDisabledTime = (
    now: Dayjs | null,
    type: RangeType,
) => {
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
type TableType = {
    id: string | number,
    date?: Date | string,
    class?: string,
    timeFrom?: Date | string,
    timeTo?: Date | string,
    status?: number,
    timeFrom_timeTo?: Moment[],
    disable?: boolean
}

const AssignClassModal: FC<ConfirmRegistrationModalProps> = (
    {
        open,
        setOpenAssignClassModal,
        hanldeAssignClass,
    }
) => {
    const dispatch = useAppDispatch();
    const { classList, loading } = useAppSelector(state => state.class)
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly ClassTrainingViewI[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [timeFrom, setTimeFrom] = useState<Date | null>(null)
    const [dateString, setDateString] = useState<string>('');
    const actionRef = useRef<ActionType>();
    const [page, setPage] = useState<number>(1);
    const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
    const total = classList?.metadata?.total;
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>(
        'bottom',
    );
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
    const rowSelection = {
        type: "radio" as RowSelectionType,
        selectedRowKeys,
        onChange: (keys: Key[]) => {
            setSelectedRowKeys(keys)
        },
        getCheckboxProps: (record: TableType) => ({
            disabled: record.disable, // Column configuration not to be checked
            name: record.class
        }),
    };
    const onPageChange = (value: any) => {
        setPage(value)
    }
    const onChangePageSize = (value: any) => {
        setPageSize(value)
    }
    const handleSave = async (data: ClassTrainingViewI2, rowKey: any) => {
        if (data) {
            const params: ClassCreated = {
                date: data.date as string, // Assuming date is a string type
                class: data.class as string, // Assuming class is a string type
                timeFrom: moment(data.timeFrom_timeTo[0]).format('HH:mm:ss'), // Get hours from timeFrom
                timeTo: moment(data.timeFrom_timeTo[1]).format('HH:mm:ss'), // Assuming timeTo is a moment type
            };
            dispatch(createClass(params)).then((response: any) => {
                console.log('response: ', response)
                if (response?.payload?.data?.status?.success) {
                    message.success('Create room success');
                    fetchClass();
                } else {
                    message.error(response?.payload?.message);
                    fetchClass();
                }
            }).catch((error) => {
                console.log("Error in getting the data", error)
            })
        }
    }
    const disabledTime: RangeDisabledTime = (now, defaultType) => {
        if (defaultType === 'start') {
            // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn bắt đầu
            return {
                disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
            };
        }
        // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn kết thúc
        return {
            disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
        };
    };
    const handleDelete = async (data: ClassTrainingViewI) => {
        await dispatch(deleteClassById(String(data?.id))).then((response: any) => {
            if (response?.payload?.data?.status?.success) {
                message.success('Delete success!');
                fetchClass();
            } else {
                message.error(response?.payload?.message)
            }
        })
    }
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    const fetchClass = async () => {
        await dispatch(getClassTraining({ status: 1, page: page, PageSize: pageSize })).catch((error) => {
            console.log("Error in getting the data", error)
        })
    }
    useEffect(() => {
        fetchClass()
    }, [page, pageSize])
    useEffect(() => {
        setDataSource(classList.data)
    }, [classList])
    const columns: ProColumns<ClassTrainingViewI>[] = [
        {
            title: 'Room Name',
            dataIndex: 'class',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: 'Room name is required' }] : [],
                };
            },
            width: 100,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            valueType: 'date',
            tooltip: 'Start date',
            width: 100,
            renderFormItem: (_, { record }) => {
                return (
                    <DatePicker
                        name="date"
                        disabledDate={disabledDate}
                    />
                );
            },
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: 'Date is required' }] : [],
                };
            },
        },
        {
            title: 'Starting Time - Ending Time',
            dataIndex: 'timeFrom_timeTo',
            valueType: 'time',
            tooltip: 'Starting time',
            render: (value, valueEnum, record) => {
                return <p>
                    {valueEnum.timeFrom
                    } - {valueEnum.timeTo}
                </p>
            },
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules:
                        rowIndex > 1 ? [{ required: true, message: 'Starting Time is required' }] : [],
                };
            },
            renderFormItem: (_, { record }) => {
                return (
                    <TimePicker.RangePicker
                        name="timeFrom_timeTo"
                        disabledTime={(current, type) => disabledTime(current, type)}
                    // Other TimePicker props...
                    />
                );
            },
            width: 200
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            readonly: true,
            editable: false,
            render: (value, valueEnum) => {
                switch (valueEnum.status) {
                    case 1:
                        return (
                            <Space size={0}>
                                <Tag color="green">Opening</Tag>
                            </Space>
                        )
                    case 2:
                        return (
                            <Space size={0}>
                                <Tag color="red">Deleted</Tag>
                            </Space>
                        )
                    case 3:
                        return (
                            <Space size={0}>
                                <Tag color="blue">Completed</Tag>
                            </Space>
                        )
                    default:
                        break;
                }
            },
            width: 100
        },
        {
            title: 'Action',
            valueType: 'option',
            width: 120,
            render: (text, record, _, action) => {
                return <Popconfirm
                    style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
                    title="Delete the task"
                    description="Are you sure to delete this room?"
                    onConfirm={() => handleDelete(record as ClassTrainingViewI)}
                    icon={<QuestionCircleOutlined rev={undefined} style={{ color: 'red' }} />}
                >
                    <Button style={{ alignContent: 'center', }} danger icon={<DeleteOutlined rev={undefined} />} />
                </Popconfirm>
            },
            align: 'center'
        },
    ];
    const hanldeAssignClass2 = async (value: any) => {
        console.log('value: ', value)
    }
    return (
        <ModalForm
            title="Room interview"
            open={open}
            onFinish={async () => {
                if (selectedRowKeys.length === 0) {
                    message.warning('Select one class to assign!');
                } else {
                    console.log('select: ', selectedRowKeys)
                    hanldeAssignClass(selectedRowKeys)
                }
            }}
            onOpenChange={setOpenAssignClassModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
            width={1000}
        >
            {/* <Button
                type="primary"
                onClick={() => {
                    actionRef.current?.addEditRecord?.({
                        id: (Math.random() * 1000000).toFixed(0),
                    });
                }}
                icon={<PlusOutlined rev={undefined} />}
            >
                AddNew
            </Button> */}
            <EditableProTable<ClassTrainingViewI>
                rowKey="id"
                headerTitle="Choose one room to assign"
                scroll={{
                    x: 900,
                }}
                actionRef={actionRef}
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                value={dataSource}
                onChange={setDataSource}
                pagination={customPagination}
                editable={{
                    type: 'single',
                    formProps: {

                    },
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        console.log(rowKey, data, row);
                        const result = await handleSave(data as ClassTrainingViewI2, rowKey);
                    },
                    onCancel: async () => {
                        fetchClass()
                    },
                    onChange: setEditableRowKeys,
                    onlyAddOneLineAlertMessage: 'Only Add One Line!',
                    onlyOneLineEditorAlertMessage: 'Only Add One Line!'

                }}
                revalidateOnFocus={true}
                recordCreatorProps={{
                    position: 'bottom',
                    newRecordType: 'dataSource',
                    record: (index, dataSource) => ({
                        id: (Math.random() * 1000000).toFixed(0),
                        disable: true
                    }),
                    creatorButtonText: 'Create New Room', // Text for the creation button

                }}
            />

        </ModalForm>

    )
}

export default AssignClassModal;
