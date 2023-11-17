import SFAMOGrid from 'components/SFAMOGrid';
import ConfirmRegistrationModal from '../ConfirmRegistration/ConfirmRegistrationModal';
import useViewRegistrationHook from './useViewRegistrationHook';

const ViewPostList = () => {
    const { handler, props, expandedRowRender } = useViewRegistrationHook();
    return (
        <>{
            props?.posts && (
                <SFAMOGrid
                    expandedRowRender={expandedRowRender}
                    pageSizeOptions={props.pageSizeOptions}
                    total={props.total}
                    onPageChange={handler.onPageChange}
                    onChangePageSize={handler.onChangePageSize}
                    page={props.page} pageSize={props.pageSize}
                    rows={props.rows} columns={props?.columns}
                    isLoading={props.loading}
                    rowsExpanded={props.rowsExpanded} />
            )
        }
            {(props.openConFirmModal && props.loading !== true && props.collabs !== null) &&
                <ConfirmRegistrationModal
                    total={props.totalCollab}
                    open={props.openConFirmModal}
                    setOpenConfirmModal={handler.setOpenConfirmModal}
                    registerAmount={props.registerAmount}
                    collabList={props.registrationList.data}
                    amountUnConfirmed={props.amountUnConfirmed}
                    positionId={props.positionId}
                />
            }
        </>
    )
}

export default ViewPostList;
