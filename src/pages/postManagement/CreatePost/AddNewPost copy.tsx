
import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ProFormText } from '@ant-design/pro-components';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Box,
    Button,
    Checkbox,
    Grid,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    styled
} from "@mui/material";
import { Col, DatePicker, Divider, Input, InputNumber, Row, Slider, TimePicker } from 'antd';
import FlexBox from 'components/FlexBox';
import LightTextField from "components/LightTextField";
import { Small, Tiny } from "components/Typography";
import { Dayjs } from 'dayjs';
import useTitle from "hooks/useTitle";
import DeleteIcon from 'icons/DeleteIcon';
import AddPostTitleModal from 'pages/modal/AddPostTitleModal';
import { FC } from "react";
import { Controller } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { primary } from 'theme/themeColors';
import './styles.scss';
import useAddNewPostHook from './useAddNewPostHook';

// styled components
const SwitchWrapper = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
}));

const initialValues = {
    postTitle: "",
    description: "",
};
const AddNewPost: FC = () => {
    const { handler, props } = useAddNewPostHook();
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };
    const { loading, open, options, control, errors, piority, additionalPositions, error, additionalTrainingPositions, contextHolder, openAddTitleModal } = props
    const { TextArea } = Input;
    const defaultType = 'start'; // Giá trị mặc định cho tham số "type"
    type RangeType = 'start' | 'end';

    const disabledTime: RangeDisabledTime = (now, defaultType) => {
        if (defaultType === 'start') {
            // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn bắt đầu
            return {
                disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
            };
        }
        // Vô hiệu hóa giờ từ 0-3 và từ 21-24 cho lựa chọn kết thúc
        return {
            disabledHours: () => Array.from({ length: 4 }, (_, i) => i).concat(Array.from({ length: 4 }, (_, i) => i + 21)),
        };
    };
    type RangeDisabledTime = (
        now: Dayjs | null,
        type: RangeType,
    ) => {
        disabledHours?: () => number[];
        disabledMinutes?: (selectedHour: number) => number[];
        disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    };
    useTitle("Add New Post");

    const { RangePicker } = DatePicker;
    return (
        <Box>
            <Button type='button' color='primary' variant="contained" style={{ float: 'right', margin: '10px 10px 0px 0px' }} onClick={handler.onOpenAddTitleModal}><PlusOutlined rev={undefined} />Add Title</Button>
            <Box pb={4} className='container'>
                {contextHolder}

                <form onSubmit={handler.handleSubmit(handler.onSubmit)} style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: 5 }}>
                    <Grid padding={5}>
                        <Divider orientation="left">
                            Post infomation
                        </Divider>
                        <Grid spacing={2} container>
                            <Grid item sm={7} xs={12} container>
                                <Grid item sm={12} xs={12}>
                                    <Small display="block" fontWeight={400}>
                                        Postitle
                                    </Small>
                                    {/* <Autocomplete
                                        id="postTitle-option"
                                        open={open}
                                        onOpen={() => {
                                            handler.setOpen(true);
                                        }}
                                        onClose={() => {
                                            handler.setOpen(false);
                                        }}
                                        value={options[0]}
                                        onChange={(event, newValue) => handler.handleChangePosition(newValue)}
                                        isOptionEqualToValue={(option, value) => option.postCategoryDescription === value.postCategoryDescription}
                                        getOptionLabel={(option) => option.postCategoryDescription}
                                        options={options}
                                        loading={loading}
                                        renderInput={(params) => (
                                            <LightTextField
                                                {...params}
                                                value={params.InputProps.endAdornment}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <Fragment>
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    /> */}
                                </Grid>
                                <Grid item sm={12} xs={12} style={{ marginBottom: 20 }}>
                                    <Small display="block" fontWeight={400}>
                                        Description
                                    </Small>
                                    <Controller
                                        name="postDescription"
                                        control={control}
                                        defaultValue={initialValues.description}
                                        render={({ field }) => (
                                            <div>
                                                <ReactQuill
                                                    modules={modules}
                                                    {...field}
                                                    value={field.value || ''} // Ensure value is always a string
                                                    onChange={(newValue: string) => field.onChange(newValue)}
                                                    style={{ height: 260, paddingBottom: 30 }}
                                                />
                                                {errors['postDescription'] && (
                                                    <span className="error">Description is required</span>
                                                )}
                                            </div>
                                        )}
                                        rules={{ required: true }} // Add validation rules here
                                    />
                                </Grid>
                            </Grid>

                            <Grid item md={5} xs={12} container spacing={1.5}>
                                <Grid item sm={12} xs={12}>
                                    <Small display="block" fontWeight={400}>
                                        Choose date from, date to
                                    </Small>
                                    <Controller
                                        name="DateFrom-DateTo"
                                        control={control}
                                        render={({ field }) => (
                                            <div style={{ maxHeight: '100%' }}> <RangePicker size="large" style={{ width: '100%' }}
                                                {...field}
                                            />
                                                {errors['DateFrom-DateTo'] && (
                                                    <span className="error">DateFrom-DateTo is required</span>
                                                )}</div>
                                        )}
                                        rules={{ required: true }} // Add validation rules here
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <Small display="block" fontWeight={400}>
                                        Choose time from, time to
                                    </Small>
                                    <Controller
                                        name="TimeFrom-TimeTo"
                                        control={control}
                                        defaultValue={initialValues.description}
                                        render={({ field }) => (
                                            <div><TimePicker.RangePicker size="large" style={{ width: '100%' }} format={'HH:mm:ss'} disabledTime={(current, type) => disabledTime(current, type)}
                                                {...field}
                                            />{errors['TimeFrom-TimeTo'] && (
                                                <span className="error">TimeFrom-TimeTo is required</span>
                                            )}</div>
                                        )}
                                        rules={{ required: true }} // Add validation rules here
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <Small display="block" fontWeight={400}>
                                        Location
                                    </Small>
                                    <Controller
                                        name="location"
                                        control={control}
                                        defaultValue={initialValues.description}
                                        render={({ field }) => (
                                            <div>
                                                <ProFormText
                                                    width="md"
                                                    placeholder="Location"
                                                    {...field}
                                                />{errors['location'] &&
                                                    (<span className="error">Location is required</span>
                                                    )}
                                            </div>
                                        )}
                                        rules={{ required: true }} // Add validation rules here
                                    />
                                </Grid>
                                <Grid item sm={12} xs={12}>
                                    <Small display="block" fontWeight={400}>
                                        Piority 1 - 5
                                    </Small>
                                    <Row>
                                        <Col span={12}>
                                            <Slider
                                                min={1}
                                                max={5}
                                                onChange={handler.onChangeSliderPiority}
                                                value={typeof piority === 'number' ? piority : 0}
                                            />
                                        </Col>
                                        <Col span={4}>
                                            <InputNumber
                                                min={1}
                                                max={5}
                                                style={{ margin: '0 16px' }}
                                                value={piority}
                                                onChange={handler.onChangeSliderPiority}
                                            />
                                        </Col>
                                    </Row>
                                    <Box maxWidth={250} marginTop={5} marginBottom={1}>
                                        <SwitchWrapper>
                                            <Small display="block" fontWeight={600}>
                                                Is premium show
                                            </Small>
                                            <Switch onChange={handler.onPremiumChange} />
                                        </SwitchWrapper>
                                        <Tiny display="block" color="text.disabled" fontWeight={500}>
                                            Just premium account can see this post
                                        </Tiny>
                                    </Box>
                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid item md={12} xs={12} marginTop={5}>
                            <Divider orientation="left">
                                Position infomation
                            </Divider>
                            <TableContainer>
                                <Table>
                                    <TableHead >
                                        <TableRow style={{ backgroundColor: primary.main, borderRadius: "10px", width: "100%" }}>
                                            <TableCell padding="checkbox">
                                                {/* <Checkbox
                                                color="primary"
                                                checked={selectedAllCryptoOrders}
                                                indeterminate={selectedSomeCryptoOrders}
                                                onChange={handleSelectAllCryptoOrders}
                                            /> */}
                                            </TableCell>
                                            <TableCell style={{ color: 'white' }}>No</TableCell>
                                            <TableCell style={{ color: 'white' }}>Name position</TableCell>
                                            <TableCell style={{ color: 'white' }}>Number</TableCell>
                                            <TableCell style={{ color: 'white' }}>Salary</TableCell>
                                            <TableCell style={{ color: 'white' }}>Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {additionalPositions.map((position, index) => (
                                            <TableRow
                                            // hover
                                            // key={account?.id}
                                            // selected={isCryptoOrderSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                    //   checked={isCryptoOrderSelected}
                                                    //   onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    //     handleSelectOneCryptoOrder(event, account?.id)
                                                    //   }
                                                    //   value={isCryptoOrderSelected}
                                                    />
                                                </TableCell>
                                                <TableCell>

                                                    <Small sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }} fontWeight={600} fontSize={15}> {index}</Small>
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`postPosition${index}`}
                                                        control={control}
                                                        defaultValue={position.positionName}
                                                        render={({ field }) => (
                                                            <div>
                                                                <LightTextField
                                                                    fullWidth
                                                                    size='small'
                                                                    label="Position name"
                                                                    placeholder="Post position"
                                                                    {...field}
                                                                />
                                                                {errors[`postPosition${index}`] && (
                                                                    <span className="error">Position name of position {index} is required</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        rules={{ required: true }} // Add validation rules here
                                                    />
                                                </TableCell>
                                                <TableCell> <Controller
                                                    name={`numberStudent${index}`}
                                                    control={control}
                                                    defaultValue={position.amount}
                                                    render={({ field }) => (
                                                        <div>
                                                            <InputNumber
                                                                style={{ width: '100%' }}
                                                                size="large"
                                                                min={1} max={100} defaultValue={1}
                                                                {...field} />
                                                            {errors[`numberStudent${index}`] && (
                                                                <span className="error">Number of position {index} required</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{ required: true }} // Add validation rules here
                                                /></TableCell>
                                                <TableCell><Controller
                                                    name={`Salary${index}`}
                                                    control={control}
                                                    defaultValue={position.salary}
                                                    render={({ field }) => (
                                                        <div>
                                                            <InputNumber
                                                                prefix='VND'
                                                                style={{ width: '100%' }}
                                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                                {...field}
                                                                size='large'
                                                            />
                                                            {errors[`Salary${index}`] && (
                                                                <span className="error">Salary of position {index} is required</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{ required: true }} // Add validation rules here
                                                /></TableCell>
                                                <TableCell> <Tooltip title={'Click to delete position'} placement="right">
                                                    <DeleteIcon fontSize='medium' color='primary' sx={{ "&:hover": { color: "#F09101" } }} onClick={() => handler.handleDeletePosition(index)} />
                                                </Tooltip>
                                                    <span className="error">{error}</span></TableCell>
                                            </TableRow>
                                        ))}


                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <FlexBox flexWrap="wrap" marginLeft={'40%'}>
                                <Tooltip title={'Click to add more position'} placement="bottom">
                                    <Small sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', "&:hover": { color: "#F09101" } }} display="block" fontWeight={300} fontSize={15} onClick={handler.handleAddPosition} >
                                        <span>Click to add more position</span>
                                        <AddCircleIcon fontSize='large' color='primary' sx={{ "&:hover": { color: "#F09101" } }} />
                                    </Small>
                                </Tooltip>
                            </FlexBox>
                        </Grid>
                        <Grid item md={12} xs={12} container>
                            <Grid item md={12} xs={12}>
                                <Divider orientation="left">
                                    Training position infomation
                                </Divider>
                                <TableContainer>
                                    <Table>
                                        <TableHead >
                                            <TableRow style={{ backgroundColor: primary.main, borderRadius: "10px", width: "100%" }}>
                                                <TableCell padding="checkbox">
                                                    {/* <Checkbox
                                                color="primary"
                                                checked={selectedAllCryptoOrders}
                                                indeterminate={selectedSomeCryptoOrders}
                                                onChange={handleSelectAllCryptoOrders}
                                            /> */}
                                                </TableCell>
                                                <TableCell style={{ color: 'white' }}>No</TableCell>
                                                <TableCell style={{ color: 'white' }}>Training Name position</TableCell>
                                                <TableCell style={{ color: 'white' }}>Number</TableCell>
                                                <TableCell style={{ color: 'white' }}>Salary</TableCell>
                                                <TableCell style={{ color: 'white' }}>Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {additionalTrainingPositions.map((position, index) => (
                                                <TableRow
                                                // hover
                                                // key={account?.id}
                                                // selected={isCryptoOrderSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                        //   checked={isCryptoOrderSelected}
                                                        //   onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                        //     handleSelectOneCryptoOrder(event, account?.id)
                                                        //   }
                                                        //   value={isCryptoOrderSelected}
                                                        />
                                                    </TableCell>
                                                    <TableCell>

                                                        <Small sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }} fontWeight={600} fontSize={15}> {index}</Small>
                                                    </TableCell>
                                                    <TableCell>

                                                        <Controller
                                                            name={`postPositionTraining${index}`}
                                                            control={control}
                                                            defaultValue={position.namePosition}
                                                            render={({ field }) => (
                                                                <div>
                                                                    <LightTextField
                                                                        fullWidth
                                                                        size='small'
                                                                        label="Position name"
                                                                        placeholder="Post position"
                                                                        {...field}
                                                                    />
                                                                    {errors[`postPositionTraining${index}`] && (
                                                                        <span className="error">Position name of training position {index} is required</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                            rules={{ required: true }} // Add validation rules here
                                                        />
                                                    </TableCell>
                                                    <TableCell> <Controller
                                                        name={`numberStudentTraining${index}`}
                                                        control={control}
                                                        defaultValue={position.number}
                                                        render={({ field }) => (
                                                            <div>
                                                                <InputNumber
                                                                    style={{ width: '100%' }}
                                                                    size="large"
                                                                    min={1} max={100} defaultValue={1}
                                                                    {...field} />
                                                                {errors[`numberStudentTraining${index}`] && (
                                                                    <span className="error">Number of training position {index} required</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        rules={{ required: true }} // Add validation rules here
                                                    /></TableCell>
                                                    <TableCell><Controller
                                                        name={`SalaryTraining${index}`}
                                                        control={control}
                                                        defaultValue={position.salary}
                                                        render={({ field }) => (
                                                            <div>
                                                                <InputNumber
                                                                    prefix='VND'
                                                                    style={{ width: '100%' }}
                                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                                    {...field}
                                                                    size='large'
                                                                />
                                                                {errors[`SalaryTraining${index}`] && (
                                                                    <span className="error">Salary of position {index} is required</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        rules={{ required: true }} // Add validation rules here
                                                    /></TableCell>
                                                    <TableCell> <Tooltip title={'Click to delete position'} placement="right">
                                                        <DeleteIcon fontSize='medium' color='primary' sx={{ "&:hover": { color: "#F09101" } }} onClick={() => handler.handleDeleteTrainingPosition(index)} />
                                                    </Tooltip>
                                                        <span className="error">{error}</span></TableCell>
                                                </TableRow>
                                            ))}


                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <FlexBox flexWrap="wrap" marginLeft={'40%'}>
                                    <Tooltip title={'Click to add more position'} placement="bottom">
                                        <Small sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', "&:hover": { color: "#F09101" } }} display="block" fontWeight={300} fontSize={15} onClick={handler.handleAddTrainingPosition}>
                                            <span>Click to add more training position</span>
                                            <AddCircleIcon fontSize='large' color='primary' sx={{ "&:hover": { color: "#F09101" } }} />
                                        </Small>
                                    </Tooltip>
                                </FlexBox>
                            </Grid>
                        </Grid>
                    </Grid>

                    <FooterToolbar>
                        <Button type="button"
                            onClick={() => handler.reset()}>Reset</Button>
                        <Button color='primary' type="submit" variant="contained" onClick={handler.handleSubmit(handler.onSubmit)}>Submit</Button>
                    </FooterToolbar>
                    {openAddTitleModal && <AddPostTitleModal fetchPostTitleOption={handler.fetchPostTitleOption} setOpenAddTitleModal={handler.setOpenAddTitleModal} open={openAddTitleModal} />}

                </form >
            </Box >
        </Box>
    );
};

export default AddNewPost;
