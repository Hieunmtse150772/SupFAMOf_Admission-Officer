import { EditOutlined, QuestionCircleFilled, SafetyCertificateOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns } from "@ant-design/pro-components";
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { Drawer, Image, Popconfirm, Table, TableColumnsType } from 'antd';
import Link from 'antd/es/typography/Link';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from 'enums/status.enum';
import { deletePostById, getPostByAccountId, getPostByPostId } from "features/postSlice";
import { ListPositionI } from 'models/post.model';
import moment from "moment";
import { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser';


interface ExpandedDataType {
  id: number,
  postId: number,
  positionName: string,
  amount: number,
  salary: number
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
function useViewPostList() {
  const Formatter = 'DD/MM/YYYY'
  const [currentRow, setCurrentRow] = useState<any>();
  // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
  const [editPostModalId, setEditPostModalId] = useState<string>('');
  const { posts, loading, isDeleted } = useAppSelector(state => state.post);
  const postInfoAPI = useAppSelector(state => state.post.postInfo);
  const isLoading = useAppSelector(state => state.post.loading);
  const [postInfo, setPostInfo] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
  const total = posts?.metadata?.total
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);

  const columns: ProColumns[] = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      width: 5,
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
      hideInTable: true
    },
    {
      title: 'Date From',
      dataIndex: 'dateFrom',
      key: 'dateFrom',
      width: 30,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'Date To',
      dataIndex: 'dateTo',
      key: 'dateTo',
      width: 30,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      width: 20,
      render: (value) => {

        if (value !== '') {
          return (ReactHtmlParser(String(value)));
        }
        return <span></span>;

      },
      hideInTable: true,
    },
    {
      title: 'Post Image',
      dataIndex: 'postImg',
      key: 'postImg',
      width: 20,
      render: (value) => {
        return (<Image src={String(value)}></Image>);
      },
      hideInTable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 20,
      valueEnum: {
        1: {
          text: 'Pending',
          status: 'Pending',
        },
        2: {
          text: 'Running',
          status: 'Processing',
        },
        3: {
          text: 'Ending',
          status: 'Success',
        }
      },
      render: (value, valueEnum) => {
        let color = grey[400].toString();
        let statusText = 'Unknown';
        switch (valueEnum?.status) {
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
        return <Box display="flex" alignItems="center">
          <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
          <Typography variant="subtitle1" color={color}>
            {statusText}
          </Typography>
        </Box>
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
          return <span><SafetyCertificateOutlined rev={undefined} /> Private</span>;
        } else
          return <span>Public</span>;

      },
    },
    {
      title: 'Delete/Edit',
      width: 10,
      hideInSearch: true,
      render: (value) => (
        <Box>
          <Popconfirm
            title="Delete the post"
            description="Are you sure to delete this post?"
            icon={<QuestionCircleFilled rev={undefined} style={{ color: 'red' }} />}
            onConfirm={() => handleDeletePost(value)}
          >
            <Link >Delete </Link>
          </Popconfirm>
          <Link onClick={() => handleOpenEditPostModal(value)} >/<EditOutlined rev={undefined} />Edit</Link>

        </Box>

      )
    }
  ];
  const rowsExpanded: ListPositionI[] = posts.data.map(post => ({
    key: post.postCode,
    position: post.postPositions
  }));
  const expandedRowRender = (record: any) => {
    const columnsExpanded: TableColumnsType<ExpandedDataType> = [
      { title: 'Position Name', dataIndex: 'positionName', key: 'positionName' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Register Amount', dataIndex: 'registerAmount', key: 'registerAmount' },
      { title: 'Time From', dataIndex: 'timeFrom', key: 'timeFrom' },
      { title: 'Time To', dataIndex: 'timeTo', key: 'timeTo' },
      { title: 'Address', dataIndex: 'location', key: 'location' },
      { title: 'Bus Option', dataIndex: 'isBusOption', key: 'isBusOption' },
      { title: 'Document', dataIndex: 'documentId', key: 'documentId' },
      { title: 'Training certificate', dataIndex: 'trainingCertificateId', key: 'trainingCertificateId' },
      { title: 'Salary', dataIndex: 'salary', key: 'salary' },
    ];

    const data = rowsExpanded.find((value) => value.key === record?.id);
    console.log('data: ', data)
    return <Table columns={columnsExpanded} dataSource={data?.position} pagination={false} />;
  };
  console.log('currentRow: ', currentRow)
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
        {currentRow && (
          // <ProDescriptions<RuleListItem>
          //   column={2}
          //   title={currentRow?.name}
          //   request={async () => ({
          //     data: currentRow || {},
          //   })}
          //   params={{
          //     id: currentRow?.name,
          //   }}
          //   columns={columns as ProDescriptionsItemProps<RuleListItem>[]}
          // />
          <><span>{currentRow.name}</span>
            <span>{currentRow.status}</span>
            <span>{currentRow.name}</span>

          </>

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
  const handleDeletePost = async (value: any) => {
    console.log('value', value)
    await dispatch(deletePostById(value?.key))
  }
  const onPageChange = (value: any) => {
    setPage(value)
  }
  const onChangePageSize = (value: any) => {
    console.log('pagesize: ', value)
    setPageSize(value)
  }

  const rows = posts.data.map(post => ({
    // Map the properties from PostI to AnyObject as needed
    // For example:
    // ...post,
    key: post?.id,
    id: post?.postCode,
    title: post?.postCategory?.postCategoryDescription,
    titleType: post?.postCategory?.postCategoryType,
    isPremium: post?.isPremium,
    description: post?.postDescription,
    location: post?.location,
    status: post?.status,
    dateFrom: moment(post?.dateFrom).format(Formatter),
    dateTo: moment(post?.dateTo).format(Formatter),
    timeFrom: post?.timeFrom,
    timeTo: post?.timeTo,
    postImg: post?.postImg,
    priority: post?.priority,
    // ...
  }));
  console.log('trainingposition: ', rowsExpanded)
  const fetchPostList = async () => {
    await dispatch(getPostByAccountId({ page: page, PageSize: pageSize }))
  }
  useEffect(() => {
    fetchPostList()
  }, [page, pageSize])
  useEffect(() => {
    fetchPostList()
  }, [isDeleted])
  const fetchPost = async (postId: string) => {
    const reusult = await dispatch(getPostByPostId(postId))
    return unwrapResult(reusult);
  }
  const handler = { setCurrentRow, setShowDetail, setOpenEditPostModal, onPageChange, setPageSize, onChangePageSize }
  const props = { total, columns, posts, loading, rows, showDetail, currentRow, rowsExpanded, openEditPostModal, editPostModalId, postInfo, postInfoAPI, isLoading, page, pageSize, pageSizeOptions }
  return {
    handler,
    props,
    drawerDetail,
    expandedRowRender
  }
}
export default useViewPostList
