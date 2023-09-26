import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import EditPostModal from './editPost/editPostModal';
import useViewPostList from './useViewPostList';

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
    const { handler, props } = useViewPostList();

    return (
        <>{
            props?.posts && (<SFAMOGrid rows={props.rows} columns={props?.columns} isLoading={props.loading} rowsExpanded={props.rowsExpanded} />
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
                    <ProDescriptions<RuleListItem>
                        column={2}
                        title={props.currentRow?.name}
                        request={async () => ({
                            data: props.currentRow || {},
                        })}
                        params={{
                            id: props.currentRow?.name,
                        }}
                        columns={props.columns as ProDescriptionsItemProps<RuleListItem>[]}
                    />
                )}
            </Drawer>
            {(props.openEditPostModal && props.postInfoAPI !== null) && <EditPostModal postInfo={props.postInfoAPI} postId={props.editPostModalId} open={props.openEditPostModal} setOpenEditPostModal={handler.setOpenEditPostModal} ></EditPostModal>}
        </>
    )
}

export default ViewPostList;
