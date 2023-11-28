import { FilterOutlined } from '@ant-design/icons';
import { LightFilter, ProFormRadio } from '@ant-design/pro-components';
import SFAMOGrid from 'components/SFAMOGrid';
import { useEffect, useRef } from 'react';
import ConfirmRegistrationModal from '../ConfirmRegistration/ConfirmRegistrationModal';
import ViewRequestChangePositionModal from '../ViewRequestChangePosition';
import useViewRegistrationHook from './useViewRegistrationHook';

const ViewPostList = () => {
    const yourRef = useRef(null);

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
    const { handler, props, expandedRowRender } = useViewRegistrationHook();
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
        </>
    )
}

export default ViewPostList;
