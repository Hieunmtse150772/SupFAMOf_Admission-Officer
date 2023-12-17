import { FileExcelOutlined } from "@ant-design/icons";
import { Button, Descriptions, DescriptionsProps, Drawer, Image, Space, Tag } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import BanCollaboratorModal from "../BanCollaboratorModal";
import CertificateModal from "../CertificateModal/CertificateModal";
import ExportModal from "../ExportModal";
import UnBanCollaboratorModal from "../UnBanCollaboratorModal";
import useViewCollabListHook from "./useViewCollabListHook";

const ViewCollabList = () => {
    const { handler, props } = useViewCollabListHook();
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Full name',
            children: props.currentRow?.name,
        },
        {
            key: '2',
            label: 'Email',
            children: props.currentRow?.email,
        },

        {
            key: '3',
            label: 'Id Student',
            children: props.currentRow?.idStudent,
        },

        {
            key: '4',
            label: 'Avatar',
            children:
                <Image
                    src={props.currentRow?.imgUrl}
                    style={{ width: 100, height: 100, borderRadius: 50 }}

                />
        },

        {
            key: '5',
            label: 'Phone',
            children: props.currentRow?.phone,
        },
        {
            key: '6',
            label: 'Premium',
            children: props.currentRow?.isPremium === true ? (
                <Space size={0}>
                    <Tag color="yellow">Premium</Tag>
                </Space>
            ) : (
                <Space size={0}>
                    <Tag color="blue">Public</Tag>
                </Space>
            ),
        },
        {
            key: '7',
            label: 'Tax Number',
            children: props.currentRow?.taxNumber,
        },
        {
            key: '8',
            label: 'Certificate',
            children:
                Array.isArray(props.currentRow?.certificates) && props.currentRow?.certificates.filter((certificate: any) => certificate.status === 1).length !== 0 ?
                    (
                        props.currentRow?.certificates.map((value: any) => (
                            <Space size={0} key={value.id}>
                                <Tag color="green">{value?.certificateName}</Tag>
                            </Space>
                        ))
                    ) : (
                        <Space size={0}>
                            <Tag color="red">No certificate</Tag>
                        </Space>
                    )


        }
    ];
    const ButtonExportExcel = (
        <Space>
            <Button
                type="default"
                color="green"
                style={{ color: 'green' }}
                key="primary"
                onClick={handler.handleExportAccountReportExcel}
            >
                <FileExcelOutlined rev={undefined} /> Account report
            </Button >
            <Button
                type="default"
                color="green"
                style={{ color: 'green' }}
                key="primary"
                onClick={() => handler.handleOpenExportExcel('openday')}
            >
                <FileExcelOutlined rev={undefined} /> OpenDay report
            </Button >
            <Button
                type="default"
                color="green"
                style={{ color: 'green' }}
                key="primary"
                onClick={() => handler.handleOpenExportExcel('tuyen-sinh')}
            >
                <FileExcelOutlined rev={undefined} /> Tuyen Sinh report
            </Button >
        </Space>
    )
    return (
        <>
            {props.collabList && (
                <SFAMOGrid
                    toolbar={ButtonExportExcel}
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
                    isLoading={props.loading} />
            )}
            {props.excelFile && <button onClick={handler.downloadExcelFile}>Download Received Excel</button>}

            <Drawer
                width={1000}
                open={props.showDetail}
                onClose={() => {
                    handler.setCurrentRow(undefined);
                    handler.setShowDetail(false);
                }}
                closable={false}
            >
                {props.currentRow && (
                    (() => {
                        return (
                            <>
                                <Descriptions style={{ marginTop: 20 }} title={props.currentRow?.title} bordered items={items} />
                            </>
                        );
                    })()
                )}

            </Drawer >
            {props.accountIdBan && props.accountName && <BanCollaboratorModal
                fetchCollabList={handler.fetchCollabList}
                accountName={props.accountName}
                accountId={props.accountIdBan}
                open={props.openDisableAccountModal}
                setOpenBanCollaborator={handler.setOpendisableAccountModal}
            ></BanCollaboratorModal>}
            {props.accountIdBan && props.accountName && <UnBanCollaboratorModal
                fetchCollabList={handler.fetchCollabList}
                accountName={props.accountName}
                accountId={props.accountIdBan}
                open={props.openUnbanAccountModal}
                setOpenUnBanCollaborator={handler.setOpenUnbanAccountModal}
            ></UnBanCollaboratorModal>}
            {props.accountId &&
                <CertificateModal
                    accountId={props.accountId}
                    certificateOption={props.certificateOptions}
                    open={props.openCertificateModal}
                    setOpenCertificateModal={handler.setOpenCertificateModal}
                    certificateList={props.certificateList}
                    fetchCollabList={handler.fetchCollabList}
                >
                </CertificateModal>
            }

            {props.nameFileExport && <ExportModal
                open={props.openExportModal}
                setOpenExportModal={handler.setOpenExportModal}
                nameFile={props.nameFileExport}
            >

            </ExportModal>}

        </>
    )
}

export default ViewCollabList;
