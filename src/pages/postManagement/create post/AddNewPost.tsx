
import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ProCard, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTimePicker } from '@ant-design/pro-components';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, alpha, styled } from '@mui/material';
import { Button, Divider, Modal, Upload } from 'antd';
import { Small } from 'components/Typography';
import useTitle from "hooks/useTitle";
import { PositionI } from 'models/post.model';
import { FC, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import useAddNewPostHook from './useAddNewPostHook';


const initialValues = {
    postTitle: "",
    description: "",
};
const ButtonWrapper = styled(Box)(({ theme }) => ({
    width: 100,
    height: 100,
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
        theme.palette.mode === "light"
            ? theme.palette.secondary[200]
            : alpha(theme.palette.primary[100], 0.1),
}));
const dumbFormList: PositionI[] = [{
    id: 1,
    postId: 1,
    amount: 5,
    salary: 200000,
    positionName: 'Vi tri 1'
}, {
    id: 2,
    postId: 2,
    amount: 5,
    salary: 200000,
    positionName: 'Vi tri 1'
},]
const AddNewPost: FC = () => {
    const { handler, props } = useAddNewPostHook();
    const { options, provinceOptions, districtOptions, wardOptions } = props

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };


    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');


    useTitle("Add New Post");


    const uploadButton = (
        <div>
            <PlusOutlined rev={undefined} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Box className='container' >
            <Box padding={5} style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: 5 }}>

                <ProForm submitter={{
                    render: (props) => (<FooterToolbar>
                        <Button type="default" htmlType="reset" onClick={() => {
                            // Thực hiện các xử lý trước khi gửi biểu mẫu (nếu cần)
                            props.form?.resetFields();
                        }}>Reset</Button>
                        <Button color='primary' type="primary" htmlType="submit" onClick={() => handler.handleSubmitAnt(props)}
                        >Submit</Button>
                    </FooterToolbar>)
                }}>
                    <Divider orientation="left">
                        Post infomation
                    </Divider>
                    <Grid container spacing={1}>
                        <Grid item sm={5}>
                            <ProForm.Group>
                                <ProFormSelect
                                    width="xl"
                                    options={options}
                                    name="postCategory"
                                    label="Post category"
                                    initialValue={options[0]?.value}
                                    debounceTime={5}
                                    tooltip="Chose one options of post title"
                                    rules={[{ required: true, message: 'Chose one options of post title!' }]}
                                />
                                <ProFormDateRangePicker
                                    name="dateFrom-dateTo"
                                    width='xl'
                                    label="Date From - Date to"
                                    style={{ width: '100%' }}
                                    rules={[{ required: true, message: 'Chose date from & date to!' }]} />
                                <ProFormSelect
                                    width="xl"
                                    options={provinceOptions}
                                    name="province"
                                    label="Province"
                                    debounceTime={5}
                                    onChange={(value) => handler.handleChangeProvince(value)}
                                    placeholder={'Select province'}
                                    rules={[{ required: true, message: 'Chose one options of province!' }]}
                                />
                                <ProFormSelect
                                    width="sm"
                                    options={districtOptions}
                                    name="district"
                                    label="District"
                                    debounceTime={5}
                                    placeholder={'Select district'}
                                    onChange={(value) => handler.handleChangeDistrict(value)}
                                    style={{ marginRight: 60 }}
                                    rules={[{ required: true, message: 'Chose one options of district!' }]}
                                />
                                <ProFormSelect
                                    width="sm"
                                    options={wardOptions}
                                    name="ward"
                                    label="Ward"
                                    debounceTime={5}
                                    placeholder={'Select ward'}
                                    rules={[{ required: true, message: 'Chose one options of ward!' }]}
                                />
                                <ProFormSlider
                                    name="piority"
                                    label="Piority 1-5"
                                    width="xl"
                                    placeholder="Piority"
                                    rules={[{ required: true, message: 'Piority is required!' }]}
                                    max={5}
                                />
                                <ProFormSwitch name="isPremium" label="Is Premium show" initialValue={false} style={{ marginLeft: '100px' }}
                                />

                            </ProForm.Group>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={props.fileList}
                                onPreview={handler.handlePreview}
                                onChange={handler.handleChange}
                            >
                                {props.fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal open={props.previewOpen} title={props.previewTitle} footer={null} onCancel={handler.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={props.previewImage} />
                            </Modal>
                        </Grid>
                        <Grid item sm={7}>
                            <Small fontSize={15}>
                                Description
                            </Small>
                            <ReactQuill
                                modules={modules}
                                // value={field.value || ''} // Ensure value is always a string
                                // onChange={(newValue: string) => field.onChange(newValue)}
                                style={{ height: 500, paddingBottom: 30, paddingTop: 9 }}
                            />

                        </Grid>

                    </Grid>
                    <Divider orientation="left">
                        Post position
                    </Divider>
                    <ProFormList
                        name="postPositions"
                        rules={[
                            {
                                required: true,
                                validator: async (_, value) => {
                                    console.log(value);
                                    if (value && value.length > 0) {
                                        return;
                                    }
                                    throw new Error('Need at least one position to create post!');
                                },
                            },
                        ]}
                        creatorButtonProps={{
                            position,
                        }}
                        creatorRecord={{
                            name: 'position',
                        }}
                        itemRender={({ listDom, action }, { index }) => (
                            <ProCard
                                bordered
                                style={{ marginBlockEnd: 8 }}
                                title={`Position${index + 1}`}
                                extra={action}
                                bodyStyle={{ paddingBlockEnd: 0 }}
                            >
                                {listDom}
                            </ProCard>
                        )}
                        initialValue={dumbFormList}
                    >
                        <ProFormGroup >
                            <Table>
                                <TableHead >
                                    <TableRow style={{ backgroundColor: '#f09101', borderRadius: "10px", width: '1000px' }}>
                                        <TableCell style={{ color: 'white' }}>Position name</TableCell>
                                        <TableCell style={{ color: 'white' }}>Document</TableCell>
                                        <TableCell style={{ color: 'white' }}>Certificate</TableCell>
                                        <TableCell style={{ color: 'white' }}>TimeForm-To</TableCell>
                                        <TableCell style={{ color: 'white' }}>Amount</TableCell>
                                        <TableCell style={{ color: 'white' }}>Salary</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <ProFormText
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                name="positionName"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormSelect
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="documentOption"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormSelect
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="certificateOption"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormTimePicker.RangePicker
                                                name="timeFrom-timeTo"
                                                rules={[{ required: true, message: 'Chose time from & time to!' }]}
                                            // initialValue={[postInfo?.data.timeFrom, postInfo?.data.timeTo]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormDigit
                                                name="amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormMoney
                                                name="salary"
                                                customSymbol="vnd"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            />
                                        </TableCell>
                                    </TableRow>

                                </TableBody>

                            </Table>
                        </ProFormGroup>

                    </ProFormList>
                    <Divider orientation="left">
                        Post training position
                    </Divider>
                    <ProFormList
                        name="trainingPosition"
                        rules={[
                            {
                                required: true,
                                validator: async (_, value) => {
                                    console.log(value);
                                    if (value && value.length > 0) {
                                        return;
                                    }
                                    throw new Error('Need at least one position to create post!');
                                },
                            },
                        ]}
                        creatorButtonProps={{
                            position,
                        }}
                        creatorRecord={{
                            name: 'test',
                        }}
                        itemRender={({ listDom, action }, { index }) => (
                            <ProCard
                                bordered
                                style={{ marginBlockEnd: 8 }}
                                title={`Position${index + 1}`}
                                extra={action}
                                bodyStyle={{ paddingBlockEnd: 0 }}
                            >
                                {listDom}
                            </ProCard>
                        )}
                        initialValue={dumbFormList}
                    >
                        <ProFormGroup >
                            <Table>
                                <TableHead >
                                    <TableRow style={{ backgroundColor: 'gray', borderRadius: "10px", width: '1000px' }}>
                                        <TableCell style={{ color: 'white' }}>Position name</TableCell>
                                        <TableCell style={{ color: 'white' }}>Document</TableCell>
                                        <TableCell style={{ color: 'white' }}>Certificate</TableCell>
                                        <TableCell style={{ color: 'white' }}>TimeForm-To</TableCell>
                                        <TableCell style={{ color: 'white' }}>Amount</TableCell>
                                        <TableCell style={{ color: 'white' }}>Salary</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <ProFormText
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                name="positionName"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormSelect
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="documentOption"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormSelect
                                                rules={[
                                                    {
                                                        required: false,
                                                    },
                                                ]}
                                                name="certificateOption"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormTimePicker.RangePicker
                                                name="timeFrom-timeTo"
                                                rules={[{ required: true, message: 'Chose time from & time to!' }]}
                                            // initialValue={[postInfo?.data.timeFrom, postInfo?.data.timeTo]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormDigit
                                                name="amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ProFormMoney
                                                name="salary"
                                                customSymbol="vnd"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            />
                                        </TableCell>
                                    </TableRow>

                                </TableBody>

                            </Table>
                        </ProFormGroup>
                    </ProFormList>

                </ProForm>
            </Box>
        </Box>
    );
};

export default AddNewPost;
