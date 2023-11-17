import { Descriptions, DescriptionsProps, Drawer, Image, Space, Tag } from "antd";
import SFAMOGrid from "components/SFAMOGrid";
import CertificateModal from "../CertificateModal/CertificateModal";
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
            children: Array.isArray(props.currentRow?.certificate) && props.currentRow?.certificate.length !== 0 ? (
                props.currentRow?.certificate.map((value: any) => (
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
    return (
        <>
            {props.collabAPI && (
                <SFAMOGrid
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page}
                    pageSize={props.pageSize}
                    rows={props.rows}
                    columns={props?.columns}
                    isLoading={props.isLoading} />
            )}
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
            <CertificateModal open={props.openCertificateModal} setOpenCertificateModal={handler.setOpenCertificateModal} certificateList={props.certificateList}></CertificateModal>
        </>
    )
}

export default ViewCollabList;
