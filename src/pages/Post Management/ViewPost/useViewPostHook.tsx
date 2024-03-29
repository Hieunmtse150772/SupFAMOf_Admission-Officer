import { DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleFilled, FolderOpenOutlined, MoreOutlined, SafetyCertificateOutlined } from '@ant-design/icons'; // Import the icon from the library
import { ProColumns, RequestData } from "@ant-design/pro-components";
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Button, Drawer, Dropdown, Image, MenuProps, Modal, Space, Table, TableColumnsType, Tag, message } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Status from 'enums/status.enum';
import { getCertificate } from 'features/certificateSlice';
import { getDocument } from 'features/documentSlice';
import { deletePositionById, deletePostById, getPostByAccountId, getPostByPostId } from "features/postSlice";
import { getPostTitle } from 'features/postTitleSlice';
import { ListPositionI } from 'models/post.model';
import moment from "moment";
import { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
import { useNavigate } from 'react-router';
import useSessionTimeOut from 'utils/useSessionTimeOut';

interface ExpandedDataType {
  id: number,
  postId: number,
  trainingCertificateId: number;
  positionName: string,
  documentId: number;
  isBusService: boolean;
  latitude: string;
  date: Date;
  longtitude: string;
  timeFrom: Date;
  timeTo: Date;
  positionRegisterAmount: number;
  totalPositionRegisterAmount: number,
  amount: number,
  salary: number,
  status: number,
  schoolName: string,
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
type SortModalI = {
  Sort: string,
  Order: string
}
type SearchParamsI = {
  postName?: string,
  postCode?: string,
  dateFrom?: Date,
  dateTo?: Date,
  status?: string,
  postCategoryId?: number,
  createAt?: Date
}
function useViewPostList() {
  const Formatter = 'YYYY-MM-DD'
  const [currentRow, setCurrentRow] = useState<any>();
  const { confirm } = Modal;
  const { SessionTimeOut } = useSessionTimeOut();
  // const [selectedRowsState, setSelectedRows] = useState<boolean>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [openEditPostModal, setOpenEditPostModal] = useState<boolean>(false);
  const [editPostModalId, setEditPostModalId] = useState<string>('');
  const { posts, loading, isDeleted } = useAppSelector(state => state.post);
  const postInfoAPI = useAppSelector(state => state.post.postInfo);
  const isLoading = useAppSelector(state => state.post.loading);
  const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption);
  const certificateList = useAppSelector(state => state.certificate.certificateOption);
  const documentList = useAppSelector(state => state.document.documentOption);
  const [postInfo, setPostInfo] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const valueEnum: { [key: number]: { text: string } } = {};
  postTitleOptionsAPI.forEach((option) => {
    valueEnum[option.id] = { text: option.postCategoryDescription };
  });
  const [sortModel, setSortModel] = useState<SortModalI>({
    Sort: 'createAt',
    Order: 'desc'
  });
  const [searchParams, setSearchParams] = useState<SearchParamsI>()

  const pageSizeOptions = [10, 20, 30]; // Các tùy chọn cho pageSize
  const total = posts?.metadata?.total
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0]);
  let navigate = useNavigate();

  const columns: ProColumns[] = [
    // {
    //   dataIndex: 'count',
    //   key: 'count',
    //   valueType: 'index',
    //   hideInSearch: true,
    //   fixed: 'left',
    // },
    {
      title: 'Post Code',
      dataIndex: 'postCode',
      key: 'postCode',
      fixed: 'left',
      render: (dom, entity) => {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'postCategoryId',
      key: 'postCategoryId',
      valueType: 'select',
      valueEnum: valueEnum,
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'titleType',
      key: 'titleType',
      hideInTable: true,
      hideInSearch: true,
      width: 100,

    },
    {
      title: 'Create at',
      dataIndex: 'createAt',
      key: 'createAt',
      valueType: 'date',
      sorter: true,
      width: 100,
    },
    {
      title: 'Date From',
      dataIndex: 'dateFrom',
      key: 'dateFrom',
      valueType: 'date',
      sorter: true,
      width: 120,
    },
    {
      title: 'Date To',
      dataIndex: 'dateTo',
      key: 'dateTo',
      valueType: 'date',
      sorter: true,
      width: 100,

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'Description',
      hideInSearch: true,
      width: 100,
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
      hideInSearch: true,
      render: (value) => {
        return (<Image src={String(value)}></Image>);
      },
      hideInTable: true,
      width: 100,
    },

    {
      title: 'Premium',
      dataIndex: 'isPremium',
      key: 'isPremium',
      hideInSearch: true,
      render: (value) => {

        if (value === true) {
          return <Tag icon={<SafetyCertificateOutlined rev={undefined} />} color="default">Private</Tag>;
        } else
          return <Tag icon={<FolderOpenOutlined rev={undefined} />} color="default">Public</Tag>;

      },
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      valueEnum: {
        1: {
          text: 'Opening',
          status: 'Opening',
        },
        2: {
          text: 'Closed',
          status: 'Closed',
        },
        3: {
          text: 'Ending',
          status: 'Success',
        },
        4: {
          text: 'Canceled',
          status: 'Canceled',
        },
        5: {
          text: 'Deleted',
          status: 'Deleted',
        },
        6: {
          text: 'Re-open',
          status: 'Re-open',
        },
      },
      render: (value, valueEnum) => {
        let color = grey[400].toString();
        let statusText = 'Unknown';
        switch (valueEnum?.status) {
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
            statusText = 'Canceled';
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
      width: 120,
    },
    // {
    //   title: 'Delete/Edit',
    //   width: 10,
    //   hideInSearch: true,
    //   render: (value) => (
    //     <Box>
    //       <Popconfirm
    //         title="Delete the post"
    //         description="Are you sure to delete this post?"
    //         icon={<QuestionCircleFilled rev={undefined} style={{ color: 'red' }} />}
    //         onConfirm={() => handleDeletePost(value)}
    //       >
    //         <Link >Delete </Link>
    //       </Popconfirm>
    //       <Link onClick={() => handleOpenEditPostModal(value)} >/<EditOutlined rev={undefined} />Edit</Link>

    //     </Box>

    //   )
    // },
    {
      title: 'Action',
      align: 'center',
      hideInSearch: true,
      fixed: 'right',
      width: 80,
      render: (value, valueEnum) => {
        const items: MenuProps['items'] = [
          {
            label: 'Delete',
            key: '1',
            icon: <DeleteOutlined color='red' rev={undefined} />,
            onClick: () => handleDeletePost(value),
            disabled: Boolean(valueEnum.status === 5),
            danger: true
          },
          {
            label: 'Edit',
            key: '2',
            icon: <EditOutlined color='green' rev={undefined} />,
            onClick: () => handleOpenEditPostModal(value),
            disabled: Boolean(valueEnum.status === 5 || valueEnum.status === 3),
          },
        ];
        const menuProps = {
          items,
        };
        return <Box>
          <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
            <Button icon={<MoreOutlined rev={undefined} />}></Button>
          </Dropdown>
        </Box>
      },
    },
  ];
  const rowsExpanded: ListPositionI[] = posts.data.map(post => ({
    key: post.postCode,
    position: post.postPositions
  }));
  const expandedRowRender = (record: any) => {
    const columnsExpanded: TableColumnsType<ExpandedDataType> = [
      { title: 'Position Name', dataIndex: 'positionName', key: 'positionName' },
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Register Amount', dataIndex: 'positionRegisterAmount', key: 'positionRegisterAmount' },
      { title: 'Date', dataIndex: 'date', key: 'date', render: (value) => <span>{moment(value).format(Formatter)}</span> },
      { title: 'Time From', dataIndex: 'timeFrom', key: 'timeFrom' },
      { title: 'Time To', dataIndex: 'timeTo', key: 'timeTo' },
      { title: 'Address', dataIndex: 'schoolName', key: 'schooName' },
      { title: 'Bus Option', dataIndex: 'isBusService', key: 'isBusService', render: (value) => { return value ? <span>Yes</span> : <span>No</span> } },
      // {
      //   title: 'Document', dataIndex: 'documentId', key: 'documentId', render: (value) => {
      //     const documentName = documentList.find((document) => document.id === Number(value))?.docName
      //     return documentName ? <Tag color='green'>{documentName}</Tag> : <Tag color='red'>No document</Tag>
      //   }
      // },
      {
        title: 'Training certificate', dataIndex: 'trainingCertificateId', key: 'trainingCertificateId', render: (value) => {
          const certificateName = certificateList.find((certificate) => certificate.id === Number(value))?.certificateName
          return certificateName ? <Tag color='green'>{certificateName}</Tag> : <Tag color='red'>No certificate</Tag>
        }
      },
      { title: 'Salary', dataIndex: 'salary', key: 'salary' },
      {
        title: 'Status', dataIndex: 'status', key: 'status', render: (rows) => {
          return rows === 1 ? (
            <Space size={0}>
              <Tag color="blue">Active</Tag>
            </Space>
          ) : (
            <Space size={0}>
              <Tag color="red">Deleted</Tag>
            </Space>
          );
        }
      },
      // {
      //   title: 'Action',
      //   key: 'action',
      //   fixed: 'right',
      //   render: (value) => <Button icon={<DeleteOutlined rev={undefined} />} onClick={() => {
      //     confirm({
      //       title: 'Do you want to delete this position?',
      //       icon: <ExclamationCircleFilled rev={undefined} />,
      //       onOk: () => {
      //         handleDeletePosition(value)
      //       },
      //       onCancel() {
      //       },
      //     });
      //   }} danger>Delete</Button>,
      // },
      {
        title: 'Action',
        align: 'center',
        fixed: 'right',
        render: (value, valueEnum) => {
          const items: MenuProps['items'] = [
            {
              label: 'Delete',
              key: '1',
              icon: <DeleteOutlined rev={undefined} />,
              onClick: () => handleDeletePosition(valueEnum),
              danger: true,
              disabled: Boolean(valueEnum.status === 2)
            },
          ];
          const menuProps = {
            items,
          };
          return <Box>
            <Dropdown menu={menuProps} trigger={['click']} placement='bottomLeft'>
              <Button icon={<DownOutlined rev={undefined} />}></Button>
            </Dropdown>
          </Box>
        },
        width: 80
      },
    ];

    const data = rowsExpanded.find((value) => value.key === record?.id);
    return <Table columns={columnsExpanded} dataSource={data?.position} pagination={false} />;
  };

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
    const result = fetchPost(value.id);
    setPostInfo(result);
    setOpenEditPostModal(true);
    setEditPostModalId(value?.id)
  }
  const handleDeletePosition = async (value: any) => {
    confirm({
      title: 'Do you want to delete this position?',
      icon: <ExclamationCircleFilled rev={undefined} />,
      onOk: async () => {
        await dispatch(deletePositionById(value?.id)).then((response: any) => {
          console.log('response: ', response)
          if (response?.payload?.status === 200) {
            message.success('Delete position success!');
            fetchPostList();
          } else if (response?.payload?.statusCode === 401) {
            SessionTimeOut();
          } else {
            message.warning(response?.payload?.message)
          }
        })
      },
      onCancel() {
      },
    });

  }
  const handleDeletePost = async (value: any) => {
    confirm({
      title: 'Do you want to delete the post?',
      icon: <ExclamationCircleFilled rev={undefined} />,
      onOk: async () => {
        await dispatch(deletePostById(value?.key)).then((response: any) => {
          console.log('response: ', response)
          if (response?.payload?.status === 200) {
            message.success('Delete post success!');
            fetchPostList();
          } else if (response?.payload?.statusCode === 401) {
            SessionTimeOut();
          } else {
            message.warning(response?.payload?.message)
          }
        })
      },
      onCancel() {
      },
    });
  }

  const handleSearch = async (value: any) => {
    if (value) {
      setSearchParams(value)
      await dispatch(getPostByAccountId({
        page: page,
        PageSize: pageSize,
        Sort: sortModel?.Sort,
        Order: sortModel?.Order,
        dateFrom: value?.dateFrom,
        dateTo: value?.dateTo,
        postCode: value?.postCode,
        postName: value?.postName,
        postCategoryId: value?.postCategoryId,
        createAt: value?.createAt
      })).then((response: any) => {
        if (response?.payload?.statusCode === 401) {
          SessionTimeOut();
        }
      })
    }
  }
  const handleActionChange = async (params: any,
    sorter: Record<string, SortOrder>,
    filter: Record<string, (string | number)[] | null>): Promise<Partial<RequestData<any>>> => {
    if (sorter && Object.keys(sorter).length > 0) {
      const keys = Object.keys(sorter);
      const fieldName = keys[0];
      const sortOrder = sorter[fieldName] === 'ascend' ? 'asc' : 'desc';

      setSortModel({ Sort: fieldName, Order: String(sortOrder) })
    } else setSortModel({ Sort: 'createAt', Order: 'desc' })


    return {
      data: [],
      success: true,
      total: 10,
    };
  }
  const onPageChange = (value: any) => {
    setPage(value)
  }
  const onChangePageSize = (value: any) => {
    setPageSize(value)
  }

  const rows = posts.data.map((post, index) => ({
    // ...post,
    count: index,
    key: post?.id,
    id: post?.postCode,
    postCode: post?.postCode,
    title: post?.postCategory?.postCategoryDescription,
    titleType: post?.postCategory?.postCategoryType,
    isPremium: post?.isPremium,
    description: post?.postDescription,
    location: post?.location,
    status: post?.status,
    dateFrom: post?.dateFrom,
    dateTo: post?.dateTo,
    timeFrom: post?.timeFrom,
    timeTo: post?.timeTo,
    postImg: post?.postImg,
    priority: post?.priority,
    position: post?.postPositions,
    createAt: post?.createAt,
    totalUpdateRegisterAmount: post?.totalUpdateRegisterAmount,
    postCategoryId: post?.postCategory?.postCategoryDescription,

    // ...
  }));
  const fetchPostList = async () => {
    await dispatch(getPostByAccountId({
      page: page,
      PageSize: pageSize,
      Sort: sortModel?.Sort,
      Order: sortModel?.Order,
      dateFrom: searchParams?.dateFrom,
      dateTo: searchParams?.dateTo,
      postCode: searchParams?.postCode,
      postName: searchParams?.postName,
      postCategoryId: searchParams?.postCategoryId,
      createAt: searchParams?.createAt
    })).then((response: any) => {
      if (response?.payload?.statusCode === 401) {
        SessionTimeOut();
      }
    })
  }
  const handleAddPost = () => {
    navigate('/dashboard/add-post')
  }
  const fetchPostTitleOption = async () => {
    await dispatch(getPostTitle()).then((response: any) => {
      if (response?.payload?.statusCode === 401) {
        SessionTimeOut();
      }
    });
  }
  const fetchCertificateOption = async () => {
    await dispatch(getCertificate()).then((response: any) => {
      if (response?.payload?.statusCode === 401) {
        SessionTimeOut();
      }
    });
  }
  const fetchDocumentOption = async () => {
    await dispatch(getDocument()).then((response: any) => {
      if (response?.payload?.statusCode === 401) {
        SessionTimeOut();
      }
    });
  }
  useEffect(() => {
    const fetch = async () => {
      await fetchPostTitleOption();
      await fetchCertificateOption();
      await fetchDocumentOption();
    }
    fetch();
  }, [])

  useEffect(() => {
    fetchPostList()
  }, [page, pageSize, sortModel])
  useEffect(() => {
    fetchPostList()
  }, [isDeleted])
  const fetchPost = async (postId: string) => {
    await dispatch(getPostByPostId(postId)).then((response: any) => {
      if (response?.payload?.statusCode === 401) {
        SessionTimeOut();
      }
      return response?.payload;
    }).catch((error) => {
      console.log('Error :', error);
    })
  }
  const handler = {
    setCurrentRow,
    setShowDetail,
    setOpenEditPostModal,
    onPageChange,
    setPageSize,
    onChangePageSize,
    handleAddPost,
    handleActionChange,
    handleSearch,
    fetchPostList
  }
  const props = {
    total,
    columns,
    posts,
    loading,
    rows,
    showDetail,
    currentRow,
    rowsExpanded,
    openEditPostModal,
    editPostModalId,
    postInfo,
    postInfoAPI,
    isLoading,
    page,
    pageSize,
    pageSizeOptions,
    documentList,
    certificateList
  }
  return {
    handler,
    props,
    drawerDetail,
    expandedRowRender
  }
}
export default useViewPostList
