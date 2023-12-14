import { FilterOutlined } from '@ant-design/icons';
import { LightFilter, ProFormRadio } from '@ant-design/pro-components';
import { green, grey, red, yellow } from '@mui/material/colors';
import { Badge, Descriptions, DescriptionsProps, Drawer, Image, Rate, Space, Tag } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import Status from 'enums/status.enum';
import moment from 'moment';
import Map from 'pages/Map/map';
import { useEffect, useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import ViewAttendanceModal from '../ConfirmAttendance';
import ConfirmRegistrationModal from '../ConfirmRegistration/ConfirmRegistrationModal';
import ViewRequestChangePositionModal from '../ViewRequestChangePosition';
import useViewRegistrationHook from './useViewRegistrationHook';

const ViewPostList = () => {
    const { handler, props, expandedRowRender } = useViewRegistrationHook();
    const yourRef = useRef(null);
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
    useEffect(() => {
        // Access the DOM node using the ref
        const domNode = yourRef.current;
        // Perform actions with the DOM node here...
    }, []);
    const LightFilterCustom = (
        <div ref={yourRef}>
            <LightFilter
                key="light-filter"
                initialValues={{
                    sex: 1,
                }}
                bordered
                collapseLabel={<FilterOutlined rev={undefined} />}
                onFinish={async (values) => handler.handleSetStatus(values)}
            >
                <ProFormRadio.Group
                    name="radio"
                    radioType="button"
                    initialValue={0}
                    options={[
                        {
                            value: 0,
                            label: 'All',
                        },
                        {
                            value: 1,
                            label: 'Opening',
                        },
                        {
                            value: 2,
                            label: 'Closed',
                        },
                        {
                            value: 3,
                            label: 'Ended',
                        },
                        {
                            value: 4,
                            label: 'Re-open',
                        },
                    ]}
                />
            </LightFilter>
        </div>

    )
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
            children: <Badge status="processing" text={statusText} color={color} />,
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
    return (
        <>{
            props?.posts && (
                <SFAMOGrid
                    handleSearch={handler.handleSearch}
                    handleTableChange={handler.handleActionChange}
                    toolbar={LightFilterCustom}
                    expandedRowRender={expandedRowRender}
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page}
                    pageSize={props.pageSize}
                    rows={props.rows}
                    columns={props?.columns}
                    isLoading={props.isLoading}
                    rowsExpanded={props.rowsExpanded} />
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
            </Drawer>
            {(props.openConFirmModal && props.loading !== true && props.collabs !== null) &&
                <ConfirmRegistrationModal
                    fetchPostList={handler.fetchPostList}
                    total={props.totalCollab}
                    open={props.openConFirmModal}
                    setOpenConfirmModal={handler.setOpenConfirmModal}
                    registerAmount={props.registerAmount}
                    collabList={props.registrationList.data}
                    amountUnConfirmed={props.amountUnConfirmed}
                    positionId={props.positionId}
                />
            }
            {(props.openViewRequestModal && props.postId !== null) &&
                <ViewRequestChangePositionModal
                    fetchPost={handler.fetchPostList}
                    open={props.openViewRequestModal}
                    setOpenViewRequestModal={handler.setOpenViewRequestModal}
                    postId={props.postId}
                />
            }
            {(props.openViewAttendenceModal && props.positionId !== null) &&
                <ViewAttendanceModal
                    fetchPost={handler.fetchPostList}
                    open={props.openViewAttendenceModal}
                    setOpenViewRequestModal={handler.setOpenViewAttendenceModal}
                    positionId={props.positionId}
                />
            }
        </>
    )
}

export default ViewPostList;
