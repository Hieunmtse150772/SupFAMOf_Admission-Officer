import { DeleteOutlined, EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, ProDescriptions, ProDescriptionsItemProps } from "@ant-design/pro-components";
import { Box } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Drawer } from 'antd';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { getPostByAccountId, getPostByPostId } from "features/postSlice";
import { ListPositionI } from 'models/post.model';
import moment from "moment";
import { useEffect, useState } from "react";

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
function useViewPostList() {
  const Formatter = 'DD/MM/YYYY'
  const [currentRow, setCurrentRow] = useState<RuleListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
  const [editPostModalId, setEditPostModalId] = useState<string>('');
  const { posts, loading } = useAppSelector(state => state.post)
  const postInfoAPI = useAppSelector(state => state.post.postInfo)
  const [postInfo, setPostInfo] = useState<any>()
  const columns: ProColumns[] = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      width: 10,
      render: (dom, entity) => {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            onClick={() => {
              console.log('dom', dom)
              console.log('entity', entity)
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'titleType',
      key: 'titleType',
      width: 10,
    },
    {
      title: 'Address',
      dataIndex: 'location',
      key: 'location',
      width: 10
    },
    {
      title: 'Date',
      dataIndex: 'dateFrom_dateTo',
      key: 'dateFrom',
      width: 30,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'Time',
      dataIndex: 'timeFrom_timeTo',
      key: 'timeFrom',
      width: 20,
      sorter: true,
      hideInSearch: true,

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      width: 20,
      hideInTable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 20,
      valueEnum: {
        0: {
          text: 'Pending',
          status: 'Pending',
        },
        1: {
          text: 'Running',
          status: 'Processing',
        },
        2: {
          text: 'Ending',
          status: 'Success',
        }
      },
    },
    {
      title: 'Premium',
      dataIndex: 'isPremium',
      key: 'isPremium',
      hideInSearch: true,
      width: 20,
      render: (value) => {

        if (value === true) {
          return <SafetyCertificateOutlined rev={undefined} />;
        }
        return <></>;

      },
    },
    {
      title: 'Option',
      width: 20,
      hideInSearch: true,
      render: (value) => (
        <Box>
          <Button danger={true} icon={<DeleteOutlined rev={undefined} onClick={() => handleDeletePost(value)} />}>Delete</Button>
          <Button onClick={() => handleOpenEditPostModal(value)} icon={<EditOutlined rev={undefined} />}>Edit</Button>
        </Box>

      )
    },
  ];
  const drawerDetail = () => {
    return (
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<RuleListItem>[]}
          />
        )}
      </Drawer>
    )
  }
  const dispatch = useAppDispatch();
  const handleOpenEditPostModal = (value: any) => {
    console.log('open modal: ', value)
    const result = fetchPost(value.id);
    setPostInfo(result);
    setOpenEditPostModal(true);
    setEditPostModalId(value?.id)
  }
  const handleDeletePost = (value: any) => {

  }

  const rows = posts.data.map(post => ({
    // Map the properties from PostI to AnyObject as needed
    // For example:
    // ...post,
    key: post?.postCode,
    id: post?.postCode,
    title: post?.postTitle?.postTitleDescription,
    titleType: post?.postTitle?.postTitleType,
    isPremium: post?.isPremium,
    description: post?.postDescription,
    location: post?.location,
    status: post?.isActive,
    dateFrom_dateTo: ` ${moment(post?.dateFrom).format(Formatter)}-${moment(post?.dateTo).format(Formatter)}`,
    timeFrom_timeTo: `${post?.timeFrom}-${post?.timeTo}`,
    priority: post?.priority,
    // ...
  }));
  const rowsExpanded: ListPositionI[] = posts.data.map(post => ({
    key: post.postCode,
    position: post.postPositions
  }));
  console.log('trainingposition: ', rowsExpanded)
  const fetchPostList = async () => {
    await dispatch(getPostByAccountId())
  }
  useEffect(() => {
    fetchPostList()
  }, [])
  const fetchPost = async (postId: string) => {
    const reusult = await dispatch(getPostByPostId(postId))
    return unwrapResult(reusult);
  }
  const handler = { setCurrentRow, setShowDetail, setOpenEditPostModal }
  const props = { columns, posts, loading, rows, showDetail, currentRow, rowsExpanded, openEditPostModal, editPostModalId, postInfo, postInfoAPI }
  return {
    handler,
    props,
    drawerDetail
  }
}
export default useViewPostList
