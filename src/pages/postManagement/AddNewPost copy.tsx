import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Box,
    Button,
    Card,
    Grid,
    styled,
    Switch,
    Tooltip
} from "@mui/material";
import LightTextField from "components/LightTextField";
import { Small, Tiny } from "components/Typography";
import { useFormik } from "formik";
import useTitle from "hooks/useTitle";
import { FC, useState } from "react";
import * as Yup from "yup";

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

const AddNewPost: FC = () => {
    // change navbar title
    useTitle("Add New User");

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
        setAdditionalPositions([...additionalPositions, newPosition]);
    };
    const initialValues = {
        postTitle: "",
        description: "",
        number: 0,
        salary: 0,
        postPosition: "",
        additionalPositions: [{
            number: 0,
            salary: 0,
            postPosition: "",
        }]
    };

    let validationSchema = Yup.object().shape({
        postTitle: Yup.string().required("Name is Required!"),
        postPosition: Yup.string().required("Post Position is Required!"),
        salary: Yup.number().min(6).required("Salary is Required!"),
        number: Yup.number().required("Number is Required!"),
        description: Yup.string().required("Description is Required!"),
    });

    const { values, errors, handleChange, handleSubmit, touched } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => { },
    });

    return (
        <Box pt={2} pb={4}>
            <Card sx={{ padding: 4 }} style={{ backgroundColor: "#31e4c4" }}>
                <Grid container spacing={3}>

                    <Grid item md={8} xs={12}>
                        <Card sx={{ padding: 3, boxShadow: 2 }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item sm={12} xs={12}>
                                        <Small display="block" fontWeight={600}>
                                            Post Title
                                        </Small>
                                        <LightTextField
                                            fullWidth
                                            name="postTitle"
                                            placeholder="Post title"
                                            value={values.postTitle}
                                            onChange={handleChange}
                                            error={Boolean(touched.postTitle && errors.postTitle)}
                                            helperText={touched.postTitle && errors.postTitle}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Small display="block" fontWeight={600}>
                                            Description Post
                                        </Small>
                                        <LightTextField
                                            multiline
                                            fullWidth
                                            rows={10}
                                            name="description"
                                            placeholder="Description"
                                            value={values.description}
                                            onChange={handleChange}
                                            error={Boolean(touched.description && errors.description)}
                                            helperText={touched.description && errors.description}
                                            sx={{
                                                "& .MuiOutlinedInput-root textarea": { padding: 0 },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                {additionalPositions.map((position, index) => (
                                    <Card key={index} sx={{ padding: 3 }} style={{ marginTop: '20px' }}>

                                        <Small sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }} fontWeight={600} fontSize={15}> Position {index}</Small>
                                        <Grid container spacing={5}>
                                            <Grid item sm={6} xs={12}>
                                                <Small display="block" fontWeight={600}>
                                                    Position name
                                                </Small>
                                                <LightTextField
                                                    fullWidth
                                                    name={`postPosition${index}`}
                                                    placeholder="Post position"
                                                    value={position.postPosition}
                                                    error={Boolean(touched.additionalPositions?.[index].postPosition && errors.additionalPositions)}
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Small display="block" fontWeight={600}>
                                                    Number student can registration
                                                </Small>
                                                <LightTextField
                                                    fullWidth
                                                    name={`number${index}`}
                                                    placeholder="Number student can registration"
                                                    value={values.additionalPositions[0].number}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.additionalPositions?.[index]?.number && errors.additionalPositions)}
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item sm={6} xs={12}>
                                                <Small display="block" fontWeight={600}>
                                                    Salary
                                                </Small>
                                                <LightTextField
                                                    fullWidth
                                                    name={`salary${index}`}
                                                    placeholder="Salary"
                                                    value={values.additionalPositions[0].salary}
                                                    onChange={handleChange}
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
                            </form>
                        </Card>

                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card
                            sx={{
                                padding: 3,
                                boxShadow: 2,
                                minHeight: 400,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
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
                </Grid>

            </Card>
        </Box >
    );
};