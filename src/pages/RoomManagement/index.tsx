import SFAMOGrid from 'components/SFAMOGrid';
import ViewCollabListModal from './ViewCollabListModal';
import useViewTrainingHook from './useViewTrainingRoomHook';

const ViewTrainingRoomList = () => {
    const { handler, props } = useViewTrainingHook();
    return (
        <>{
            props?.rooms && (
                <SFAMOGrid
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
                    eventDayId={props.eventDayId}
                    collabList={props.collabList}
                    open={props.openViewCollabListModal}
                    setOpenViewCollabListModal={handler.setOpenViewCollabListModal}
                >

                </ViewCollabListModal>
            }

        </>
    )
}

export default ViewTrainingRoomList;
