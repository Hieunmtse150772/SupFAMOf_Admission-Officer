import { FiberManualRecord } from '@mui/icons-material';
import { Box } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Col, Drawer, Image, Row, Typography } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import Status from 'enums/status.enum';
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
    console.log('post: ', props.posts)
    return (
        <>{
            props?.posts && (
                <SFAMOGrid
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total} onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page}
                    pageSize={props.pageSize}
                    rows={props.rows}
                    columns={props?.columns}
                    isLoading={props.loading} rowsExpanded={props.rowsExpanded}
                    expandedRowRender={expandedRowRender}
                    action={handler.handleAddPost} />
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
                        let color = grey[400].toString();
                        let statusText = 'Unknown';

                        switch (props.currentRow.status) {
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

                        return (
                            <>
                                <Typography itemType="danger">{props.currentRow.title}</Typography>
                                <Image src={props.currentRow.postImg} />
                                <Box display="flex" alignItems="center">
                                    <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
                                    <Typography color={color}>{statusText}</Typography>
                                </Box>
                                {ReactHtmlParser(props.currentRow?.description)}
                                <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                                    User Profile
                                </p>
                                <p className="site-description-item-profile-p">Personal</p>
                                <Row>
                                    <Col span={12}>
                                        <DescriptionItem title="Full Name" content="Lily" />
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem title="Account" content="AntDesign@example.com" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <DescriptionItem title="City" content="HangZhou" />
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem title="Country" content="China🇨🇳" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <DescriptionItem title="Birthday" content="February 2,1900" />
                                    </Col>
                                    <Col span={12}>
                                        <DescriptionItem title="Website" content="-" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <DescriptionItem
                                            title="Message"
                                            content="Make things as simple as possible but no simpler."
                                        />
                                    </Col>
                                </Row></>
                        );
                    })()
                )}

            </Drawer >
            {(props.openEditPostModal && props.postInfoAPI !== null && props.isLoading !== true) &&
                <EditPostModal
                    postInfo={props.postInfoAPI}
                    postId={props.editPostModalId}
                    open={props.openEditPostModal}
                    setOpenEditPostModal={handler.setOpenEditPostModal} />
            }
        </>
    )
}

export default ViewPostList;
