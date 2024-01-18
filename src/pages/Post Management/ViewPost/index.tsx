import { PlusOutlined } from '@ant-design/icons';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Badge, Button, Descriptions, DescriptionsProps, Drawer, Image, Rate, Space, Tag } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import Status from 'enums/status.enum';
import moment from 'moment';
import Map from 'pages/Map/map';
import ReactHtmlParser from 'react-html-parser';
import EditPostModal from './EditPost/EditPostModal';
import useViewPostHook from './useViewPostHook';
interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}
type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
};
const ViewPostList = () => {
    const { handler, props, expandedRowRender } = useViewPostHook();
    const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
    let color = grey[400].toString();
    let statusText = 'Unknown';

    switch (props.currentRow?.status) {
        case Status.opening:
            color = '#1890ff';
            statusText = 'Opening';
            break;

        case Status.closed:
            color = green[500];
            statusText = 'Closed';
            break;

        case Status.ended:
            color = red[500];
            statusText = 'Ended';
            break;
        case Status.canceled:
            color = yellow[500];
            statusText = 'Re-open';
            break;
        case Status.deleted:
            color = red[500];
            statusText = 'Deleted';
            break;
        case Status.reopen:
            color = green[500];
            statusText = 'Re-open';
            break;
        default:
            break;
    }
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Title',
            children: props.currentRow?.title,
        },
        {
            key: '2',
            label: 'Description',
            children: ReactHtmlParser(props.currentRow?.description),
        },
        {
            key: '3',
            label: 'Status',
            children: <Badge status="processing" text={statusText} />,
        },
        {
            key: '4',
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
            key: '5',
            label: 'Date From',
            children: moment(props.currentRow?.dateFrom).format('YYYY-MM-DD'),
        },
        {
            key: '6',
            label: 'Date To',
            children: moment(props.currentRow?.dateFrom).format('YYYY-MM-DD'),
        },
        {
            key: '7',
            label: 'Image',
            children: <Image style={{ width: '200px' }} src={props.currentRow?.postImg} />,
        },
        {
            key: '8',
            label: 'Piority',
            children: <Rate disabled allowHalf defaultValue={props.currentRow?.priority} />
        },
    ];
    const ButtonAddNew = (
        <Button
            type="primary"
            key="primary"
            onClick={handler.handleAddPost}
        >
            < PlusOutlined rev={undefined} /> New
        </Button >
    )
    return (
        <>{
            props?.posts && (
                <SFAMOGrid
                    handleSearch={handler.handleSearch}
                    handleTableChange={handler.handleActionChange}
                    toolbar={ButtonAddNew}
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page}
                    pageSize={props.pageSize}
                    rows={props.rows}
                    columns={props?.columns}
                    isLoading={props.isLoading}
                    rowsExpanded={props.rowsExpanded}
                    expandedRowRender={expandedRowRender}
                />
            )
        }
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
                                {props.currentRow?.position.map((value: any, index: number) => {
                                    const certificateName = props.certificateList.find((certificate) => certificate.id === Number(value.trainingCertificateId))?.certificateName;
                                    const documentName = props.documentList.find((document) => document.id === Number(value.documentId))?.docName;
                                    const salary = new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
                                    }).format(value?.salary)
                                    const items: DescriptionsProps['items'] = [
                                        {
                                            key: '1',
                                            label: 'Position Name',
                                            children: value?.positionName,
                                        },
                                        {
                                            key: '2',
                                            label: 'Address',
                                            children: <Map address={value?.location} id={`map${index}`}></Map>,
                                        },
                                        {
                                            key: '3',
                                            label: 'Date',
                                            children: moment(value?.date).format('YYYY-MM-DD'),
                                        },
                                        {
                                            key: '4',
                                            label: 'Amount',
                                            children: value?.amount,
                                        },
                                        {
                                            key: '5',
                                            label: 'Salary',
                                            children: salary,
                                        },
                                        {
                                            key: '6',
                                            label: 'Bus option',
                                            children: value?.isBusService ? <Tag color='blue'>Yes</Tag> : <Tag color='red'>No Bus Option</Tag>,
                                        },
                                        {
                                            key: '7',
                                            label: 'Document',
                                            children: documentName ? <Tag color='green'>{documentName}</Tag> : <Tag color='red'>No document</Tag>
                                        },
                                        {
                                            key: '8',
                                            label: 'Certificate',
                                            children: certificateName ? <Tag color='green'>{certificateName}</Tag> : <Tag color='red'>No certificate</Tag>
                                        }
                                    ];
                                    return <>
                                        <Descriptions style={{ marginTop: 20 }} title={value?.positionName} bordered items={items} />                                        </>
                                })}
                            </>
                        );
                    })()
                )}

            </Drawer >
            {(props.openEditPostModal && props.postInfoAPI !== null && props.isLoading !== true) &&
                <EditPostModal
                    fetchPostList={handler.fetchPostList}
                    postInfo={props.postInfoAPI}
                    postId={props.editPostModalId}
                    open={props.openEditPostModal}
                    setOpenEditPostModal={handler.setOpenEditPostModal} />
            }
        </>
    )
}

export default ViewPostList;
