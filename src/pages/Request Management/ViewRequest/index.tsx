import { PlusOutlined } from '@ant-design/icons';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Badge, Button, DescriptionsProps, Image, Rate, Space, Tag } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import Status from 'enums/status.enum';
import ReactHtmlParser from 'react-html-parser';
import useViewRequest from './useViewRequest';
interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}
const ViewPostList = () => {
    const { handler, props } = useViewRequest();
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
            statusText = 'Pending';
            break;

        case Status.closed:
            color = green[500];
            statusText = 'Running';
            break;

        case Status.ended:
            color = red[500];
            statusText = 'Ending';
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
            children: props.currentRow?.dateFrom,
        },
        {
            key: '6',
            label: 'Date To',
            children: props.currentRow?.dateTo,
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
            props?.requests && (
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
                />
            )
        }
        </>
    )
}

export default ViewPostList;
