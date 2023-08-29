
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
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
import { Col, DatePicker, InputNumber, Row, Slider, TimePicker } from 'antd';
import LightTextField from "components/LightTextField";
import { Small, Tiny } from "components/Typography";
import useTitle from "hooks/useTitle";
import DeleteIcon from 'icons/DeleteIcon';
import { FC, Fragment } from "react";
import { Controller } from "react-hook-form";
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
    const { loading, open, options, control, errors, piority, additionalPositions, error, additionalTrainingPositions } = props

    useTitle("Add New Post");

    const { RangePicker } = DatePicker;
    return (
        <Box pt={2} pb={4} >

            <form onSubmit={handler.handleSubmit(handler.onSubmit)}>

                <Grid container spacing={1}>
                    <Grid item md={5} xs={12} >
                        <Grid container spacing={1}>
                            <Grid item sm={12} xs={12}>

                                <Autocomplete
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
                                    isOptionEqualToValue={(option, value) => option.postTitleDescription === value.postTitleDescription}
                                    getOptionLabel={(option) => option.postTitleDescription}
                                    options={options}
                                    loading={loading}
                                    renderInput={(params) => (
                                        <LightTextField
                                            {...params}
                                            label="Post title Options"
                                            value={params.InputProps.endAdornment}
                                            fullWidth
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
                                />
                            </Grid>
                            <Grid item sm={12} xs={12}>
                                <Controller
                                    name="postDescription"
                                    control={control}
                                    defaultValue={initialValues.description}
                                    render={({ field }) => (
                                        <div>
                                            <LightTextField
                                                multiline
                                                fullWidth
                                                rows={10}
                                                label="Description"
                                                placeholder="Description"
                                                {...field}
                                            />
                                            {errors['description'] && (
                                                <span className="error">Description is required</span>
                                            )}
                                        </div>
                                    )}
                                    rules={{ required: true }} // Add validation rules here
                                />
                            </Grid>

                            <Grid item sm={12} xs={12}>
                                <Small display="block" fontWeight={400}>
                                    Choose date from, date to
                                </Small>
                                <Controller
                                    name="DateFrom-DateTo"
                                    control={control}
                                    render={({ field }) => (
                                        <RangePicker size="large" style={{ width: '100%' }}
                                            {...field}
                                        />
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
                                        <TimePicker.RangePicker size="large" style={{ width: '100%' }}
                                            {...field}
                                        />
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
                            </Grid>

                        </Grid>

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
                        <Grid item xs={12} alignItems={'end'}>
                            <Button type="submit" variant="contained">
                                Create Post
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item md={7} xs={12} container>

                        <Grid item md={12} xs={12}>
                            <TableContainer>
                                <Table >
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#F09101' }}>
                                            <TableCell padding="checkbox">
                                                {/* <Checkbox
                                                color="primary"
                                                checked={selectedAllCryptoOrders}
                                                indeterminate={selectedSomeCryptoOrders}
                                                onChange={handleSelectAllCryptoOrders}
                                            /> */}
                                            </TableCell>
                                            <TableCell>No</TableCell>
                                            <TableCell>Name position</TableCell>
                                            <TableCell>Number</TableCell>
                                            <TableCell>Salary</TableCell>
                                            <TableCell>Delete</TableCell>

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
                                                    defaultValue={position.number}
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
                            <Box style={{ marginLeft: '45%' }} sx={{ "&:hover": { color: "#F09101" } }}>
                                <Tooltip title={'Click to add more position'} placement="bottom">
                                    <AddCircleIcon fontSize='large' color='primary' sx={{ "&:hover": { color: "#F09101" } }} onClick={handler.handleAddPosition} />
                                </Tooltip>
                            </Box>
                        </Grid>

                        {/* <Grid item md={6} xs={12}>


                            {additionalTrainingPositions.map((position, index) => (
                                <>
                                    <Small sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }} fontWeight={600} fontSize={15}> Training position {index}</Small>
                                    <Tooltip title={'Click to delete position'} placement="right">
                                        <DeleteIcon fontSize='large' color='error' sx={{ "&:hover": { color: "#F09101" } }} onClick={() => handler.handleDeletePosition(index)} />
                                    </Tooltip>
                                    <span className="error">{error}</span>
                                    <Grid container spacing={3}>
                                        <Grid item sm={12} xs={12}>
                                                    <Controller
                                                        name={`postPosition${index}`}
                                                        control={control}
                                                        defaultValue={position.namePosition}
                                                        render={({ field }) => (
                                                            <div>
                                                                <LightTextField
                                                                    fullWidth
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
                                                </Grid>
                                        <Grid item sm={4} xs={12}>
                                            <Controller
                                                name={`numberTrainingStudent${index}`}
                                                control={control}
                                                defaultValue={position.number}
                                                render={({ field }) => (
                                                    <div>
                                                        <InputNumber
                                                            style={{ width: '100%' }}
                                                            size="large"
                                                            min={1} max={100} defaultValue={1}
                                                            {...field} />
                                                        {errors[`numberTrainingStudent${index}`] && (
                                                            <span className="error">Number of position {index} required</span>
                                                        )}
                                                    </div>
                                                )}
                                                rules={{ required: true }} // Add validation rules here
                                            /></Grid>
                                        <Grid item sm={8} xs={12}>
                                            <Controller
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
                                                            <span className="error">Salary Training of position {index} is required</span>
                                                        )}
                                                    </div>
                                                )}
                                                rules={{ required: true }} // Add validation rules here
                                            />
                                        </Grid>
                                    </Grid>

                                </>))}

                            <Box style={{ marginLeft: '45%' }} sx={{ "&:hover": { color: "#F09101" } }}>
                                <Tooltip title={'Click to add more position'} placement="top">
                                    <AddCircleIcon fontSize='large' color='primary' sx={{ "&:hover": { color: "#F09101" } }} onClick={handler.handleAddTrainingPosition} />
                                </Tooltip>
                            </Box>

                        </Grid> */}

                    </Grid>

                </Grid >

            </form >
        </Box >
    );
};

export default AddNewPost;
