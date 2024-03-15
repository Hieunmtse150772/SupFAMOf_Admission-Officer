import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import SFAMOGrid from 'components/SFAMOGrid';
import AddMoreRoomModal from './AddMoreRoomModal';
import EditRoomModal from './EditRoomModal';
import ViewCollabListModal from './ViewCollabListModal';
import useViewTrainingHook from './useViewTrainingRoomHook';

const ViewTrainingRoomList = () => {
    const { handler, props } = useViewTrainingHook();
    const AddMoreRoomButton = (
        <Button
            type="primary"
            key="primary"
            onClick={handler.handleOpenAddMoreRoom}
        >
            < PlusOutlined rev={undefined} /> New Room
        </Button >
    )
    return (
        <>{
            props?.rooms && (
                <SFAMOGrid
                    toolbar={[AddMoreRoomButton]}
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
                    isLoading={props.isLoading}
                />
            )
        }
            {props.collabList && props.eventDayId &&
                <ViewCollabListModal
                    fetchRooms={handler.fetchRooms}
                    eventDayId={props.eventDayId}
                    collabList={props.collabList}
                    open={props.openViewCollabListModal}
                    setOpenViewCollabListModal={handler.setOpenViewCollabListModal}
                >

                </ViewCollabListModal>
            }

            <AddMoreRoomModal
                fetchRoomList={handler.fetchRooms}
                open={props.openAddMoreClassModal}
                setOpenAddMoreRoomModal={handler.setOpenAddMoreClassModal}
            />

            {props.roomId && props.classInfo && props.isLoading !== true &&
                <EditRoomModal
                    classInfo={props.classInfo}
                    fetchRoomList={handler.fetchRooms}
                    open={props.openEditRoom}
                    setOpenEditRoomModal={handler.setOpenEditRoom}
                />
            }
        </>
    )
}

export default ViewTrainingRoomList;
