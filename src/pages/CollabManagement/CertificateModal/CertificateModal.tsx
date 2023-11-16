import { ModalForm, ProCard, ProList } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import CertificateOptionI from "models/certificateOption.model";
import { FC, useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import useEditPostModalHook from "./useCertificateModalHook";

interface CertificateModalProps {
    open: boolean,
    setOpenCertificateModal: React.Dispatch<React.SetStateAction<boolean>>,
    certificateList: CertificateOptionI[]
}
const CertificateModal: FC<CertificateModalProps> = ({ open, setOpenCertificateModal, certificateList }) => {
    type DataItem = (typeof certificateList)[number];
    const [dataSource, setDataSource] = useState<DataItem[]>(certificateList);
    const { handler, props } = useEditPostModalHook();

    useEffect(() => { setDataSource(certificateList) }, [certificateList])
    console.log('certificateList 111', certificateList)
    return (
        <ModalForm
            width={1190}
            open={open}
            // onFinish={(value) => handler.handleUpdatePost(value)}
            onOpenChange={setOpenCertificateModal}
            submitter={{
                searchConfig: {
                    submitText: 'Submit',
                    resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                }
            }}
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
                    dataSource={dataSource}
                    metas={{
                        id: {
                            dataIndex: 'id'
                        },
                        title: {
                            dataIndex: 'certificateName',
                            search: false,
                            render: (text, row, index, action) => {
                                console.log('row: ', row.certificateName)
                                return (

                                    <>{row.certificateName}</>
                                )
                            }
                        },
                        description: {
                            dataIndex: 'createAt',
                            search: false,
                            render: (text, row, index, action) => (
                                <>{row.createAt}</>
                            )
                        },
                        subTitle: {
                            render: (text, row, index, action) => (
                                console.log('row', row),
                                row?.status === 1 ? (
                                    <Space size={0}>
                                        <Tag color="blue">isActive</Tag>
                                    </Space>
                                ) : (
                                    <Space size={0}>
                                        <Tag color="blue">inActive</Tag>
                                    </Space>
                                )

                            ),
                            search: false
                        },
                    }}
                    pagination={{
                        pageSize: 5,
                    }}
                // rowSelection={rowSelection}
                />
            </ProCard>
        </ModalForm >
    )
}

export default CertificateModal;
