import { ModalForm, ProCard, ProFormGroup, ProFormSelect, ProList } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import { Certificate } from "models/collabListInfo.model";
import { FC } from "react";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import useEditPostModalHook from "./useCertificateModalHook";

interface CertificateModalProps {
    open: boolean,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    certificateList: Certificate[],
    certificateOption: {
        id: number,
        value: number,
        label: string,
    }[],
    accountId: string,
    fetchCollabList: () => void
}
const CertificateModal: FC<CertificateModalProps> = ({ open, setOpenCertificateModal, certificateList, certificateOption, accountId, fetchCollabList }) => {
    type DataItem = (typeof certificateList)[number];
    console.log('certificateList: ', certificateList);
    const { handler, props } = useEditPostModalHook(certificateList, accountId, setOpenCertificateModal, fetchCollabList);
    const certificateListFilter = certificateList?.filter((certificate) => certificate?.status === 1)
    const option = certificateOption?.filter((item) => !certificateListFilter?.some(cert => cert?.trainingCertificateId === item.id))
    console.log('options: ', option)
    return (
        <ModalForm
            width={1190}
            open={open}
            onFinish={(value) => handler.handleGiveCertificateByAccountId(value)}
            onOpenChange={setOpenCertificateModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
            title='CERTIFICATE'
        >
            <ProCard
                title="Certificate list"
                bordered
                headerBordered
                collapsible
                style={{
                    marginBlockEnd: 16,
                    minWidth: 1000,
                    maxWidth: '100%',
                }}
            >
                <ProList<DataItem>
                    rowKey="id"
                    style={{ width: '100%' }}
                    dataSource={props.dataSource}
                    toolbar={{
                        actions: [
                            <Button type="dashed" disabled={Boolean(props.selectedRowKeys.length === 0)} danger onClick={() => handler.handleRemoveCertificateByAccountId()}>
                                Remove certificate
                            </Button>,
                        ],
                    }}
                    metas={{
                        key: {
                            dataIndex: 'id'
                        },
                        title: {
                            dataIndex: 'certificateName',
                        },
                        description: {
                            dataIndex: 'trainingTypeId',
                        },
                        content: {
                            valueType: 'date',
                            dataIndex: 'createAt',
                            editable: false
                        },
                        subTitle: {
                            render: (rows, row) => {
                                return (
                                    <Space size={0}>
                                        {row?.status === 1 ? <Tag color="green">Completed</Tag> : <Tag color="red">Rejected</Tag>}
                                    </Space>
                                );
                            },
                            editable: false
                        },
                    }}
                    pagination={{
                        pageSize: 5,
                    }}
                    rowSelection={props.rowSelection}
                    key='trainingCertificateId'
                />
                <ProFormGroup>
                    <ProFormSelect
                        name="trainingCertificateId"
                        label="Certificate"
                        options={option}
                        width='lg'
                        fieldProps={{
                            mode: 'multiple',
                        }}
                        placeholder="Please choose certificate to give collaborator"
                        rules={[
                            {
                                required: true,
                                message: 'Please select atleast one certificate to give',
                                type: 'array',
                            },
                        ]}
                    />
                </ProFormGroup>
            </ProCard>

        </ModalForm >
    )
}

export default CertificateModal;
