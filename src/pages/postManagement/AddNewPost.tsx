
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CircularProgress,
    Grid,
    Switch,
    Tooltip,
    styled
} from "@mui/material";
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import background from 'assets/background/background-1.jpg';
import LightTextField from "components/LightTextField";
import { Small, Tiny } from "components/Typography";
import { createPost } from 'features/postSlice';
import { getPostTitle } from 'features/postTitleSlice';
import useTitle from "hooks/useTitle";
import PostOptionI from 'models/postOption.model';
import { FC, Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import './styles.scss';
// styled components
const SwitchWrapper = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
}));
interface AdditionalPosition {
    postPosition: string;
    number: number;
    salary: number;
}
const initialValues = {
    postTitle: "",
    description: "",
};
const AddNewPost: FC = () => {
    const dispatch = useAppDispatch();
    // change navbar title
    useTitle("Add New User");
    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues, trigger
    } = useForm();
    const postTitleOptionsAPI = useAppSelector(state => state.postTitle.postTitleOption)
    const [postTitleOptions, setPostTitleOptions] = useState<Pick<PostOptionI, 'id' | 'postTitleDescription' | 'postTitleType'>[]>([])
    console.log("postTitleOptions: ", postTitleOptions)
    const [error, setError] = useState<String>('');
    const onSubmit = (data: any) => {
        const result = dispatch(createPost(data)).then(() => {
            console.log(result);
        })
        console.log("data: ", data);
        // You can perform your submission logic here
    };
    const [additionalPositions, setAdditionalPositions] = useState<AdditionalPosition[]>([{
        postPosition: '',
        number: 0,
        salary: 0,
    }]);

    const handleAddPosition = () => {
        const newPosition = {
            postPosition: '',
            number: 0,
            salary: 0,
        };
        setError('');
        setAdditionalPositions([...additionalPositions, newPosition]);
    };
    const handleDeletePosition = (indexToDelete: number) => {
        if (additionalPositions.length === 1) {
            setError('Need at least 1 position to make a post')
        } else {
            setError('')
            const updatedPositions = additionalPositions.filter((_, index) => index !== indexToDelete);
            setAdditionalPositions(updatedPositions);
        }

    };
    const featchPostTitleOption = async () => {
        const result = await dispatch(getPostTitle());
        unwrapResult(result)
        if (result) {
            setPostTitleOptions(postTitleOptionsAPI);
        }
        console.log('postTitleOption', result)
    }
    const mappedOptions = postTitleOptionsAPI?.map((option) => ({
        label: option.postTitleDescription,
        id: option.id
    }));
    useEffect(() => {
        featchPostTitleOption()
        // setPostTitleOption1(postTitleOptionsAPI?.map((option) => ({
        //     label: option.postTitleDescription,
        //     id: option.id
        // })))
        console.log("posssss: ", postTitleOptionsAPI?.map((option) => ({
            label: option.postTitleDescription,
            id: option.id
        })));
    }, [])
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<readonly PostOptionI[]>([]);
    const isLoading = useAppSelector(state => state.postTitle.loading)
    const loading = open && options.length === 0;
    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e1); // For demo purposes.

            if (active) {
                setOptions([...postTitleOptionsAPI]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    return (
        <Box className="container" pt={2} pb={4} >
            <form onSubmit={handleSubmit(onSubmit)}>

                <Card sx={{ padding: 4 }} style={{ backgroundImage: `url(${background})` }}>
                    <Grid container spacing={3}>
                        <Grid item md={5} xs={12} >
                            <Card
                                sx={{
                                    padding: 3,
                                    boxShadow: 2,
                                    minHeight: 400,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Grid container spacing={3}>
                                    <Grid item sm={12} xs={12}>
                                        <Controller
                                            name="selectedOption"
                                            control={control}
                                            defaultValue={initialValues.postTitle}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    id="position-option"
                                                    open={open}
                                                    onOpen={() => {
                                                        setOpen(true);
                                                    }}
                                                    onClose={() => {
                                                        setOpen(false);
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.postTitleDescription === value.postTitleDescription}
                                                    getOptionLabel={(option) => option.postTitleDescription}
                                                    options={options}
                                                    loading={loading}
                                                    renderInput={(params) => (
                                                        <LightTextField
                                                            {...params}
                                                            label="Position Options"
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
                                            )}
                                        /></Grid>
                                    <Grid item sm={12} xs={12}>
                                        <Controller
                                            name="description"
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
                                                        <span>Description is required</span>
                                                    )}
                                                </div>
                                            )}
                                            rules={{ required: true }} // Add validation rules here
                                        />
                                    </Grid>
                                </Grid>

                                <Box maxWidth={250} marginTop={5} marginBottom={1}>
                                    <SwitchWrapper>
                                        <Small display="block" fontWeight={600}>
                                            Is premium show
                                        </Small>

                                        <Switch defaultChecked />
                                    </SwitchWrapper>
                                    <Tiny display="block" color="text.disabled" fontWeight={500}>
                                        Just premium account can see this post
                                    </Tiny>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item md={7} xs={12}>
                            <Card sx={{ padding: 3, boxShadow: 2 }}>

                                {additionalPositions.map((position, index) => (
                                    <Card key={index} sx={{ padding: 3 }} style={{ marginTop: '20px' }}>
                                        <Small sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }} fontWeight={600} fontSize={15}> Position {index}</Small>
                                        <Tooltip title={'Click to delete position'} placement="top">
                                            <> <DeleteIcon fontSize='large' color='error' sx={{ "&:hover": { color: "#F09101" } }} onClick={() => handleDeletePosition(index)} />
                                                <span>{error}</span></>
                                        </Tooltip>
                                        <Grid container spacing={3}>

                                            <Grid item sm={6} xs={12}>
                                                <Controller
                                                    name={`postPosition${index}`}
                                                    control={control}
                                                    defaultValue={position.postPosition}
                                                    render={({ field }) => (
                                                        <div>
                                                            <LightTextField
                                                                fullWidth
                                                                label="Position name"
                                                                placeholder="Post position"
                                                                {...field}
                                                            />
                                                            {errors[`postPosition${index}`] && (
                                                                <span>Position name of position {index} is required</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{ required: true }} // Add validation rules here
                                                />
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Controller
                                                    name={`numberStudent${index}`}
                                                    control={control}
                                                    defaultValue={position.postPosition}
                                                    render={({ field }) => (
                                                        <div>
                                                            <LightTextField
                                                                label="Number student can registration"
                                                                fullWidth
                                                                placeholder="Number student can registration"
                                                                {...field} />
                                                            {errors[`numberStudent${index}`] && (
                                                                <span>Number of position {index} required</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{ required: true }} // Add validation rules here
                                                /></Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Controller
                                                    name={`Salary${index}`}
                                                    control={control}
                                                    defaultValue={position.postPosition}
                                                    render={({ field }) => (
                                                        <div>
                                                            <LightTextField
                                                                label="Salary"
                                                                fullWidth
                                                                placeholder="Salary"
                                                                {...field}
                                                            />
                                                            {errors[`Salary${index}`] && (
                                                                <span>Salary of position {index} is required</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{ required: true }} // Add validation rules here
                                                />
                                            </Grid>
                                        </Grid>

                                    </Card>
                                ))}

                                <Box style={{ marginLeft: '45%' }} sx={{ "&:hover": { color: "#F09101" } }}>
                                    <Tooltip title={'Click to add more position'} placement="top">
                                        <AddCircleIcon fontSize='large' color='primary' sx={{ "&:hover": { color: "#F09101" } }} onClick={handleAddPosition} />
                                    </Tooltip>
                                </Box>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained">
                                        Create Post
                                    </Button>
                                </Grid>
                            </Card>

                        </Grid>

                    </Grid>

                </Card>
            </form>
        </Box >
    );
};

export default AddNewPost;
