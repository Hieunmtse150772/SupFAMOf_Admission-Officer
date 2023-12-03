import SFAMOGrid from "components/SFAMOGrid";
import { useNavigate, useParams } from "react-router";
import useViewClassHook from "./useViewClassHook";

const Index = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { props, handler } = useViewClassHook();
    // Use the id or perform other logic here

    return (
        <div
            style={{
                backgroundColor: "#eee",
                margin: -24,
                padding: 24,
            }}
        >

            {
                props?.posts && (
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
                        rowsExpanded={props.rowsExpanded} />
                )
            }
        </div>
    );
};

export default Index;
