
import { PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormGroup, ProFormList, ProFormMoney, ProFormSelect, ProFormSlider, ProFormSwitch, ProFormText, ProFormTimePicker } from '@ant-design/pro-components';
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, alpha, styled } from '@mui/material';
import { Button, Divider, Modal, Upload } from 'antd';
import { RcFile, UploadProps } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload';
import { Small } from 'components/Typography';
import { Dayjs } from 'dayjs';
import useTitle from "hooks/useTitle";
import { PositionI } from 'models/post.model';
import { FC, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { primary } from 'theme/themeColors';
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
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const { options, provinceOptions, districtOptions, wardOptions } = props
    type RangeType = 'start' | 'end';

    const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

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
                        <Button color='primary' type="primary" htmlType="submit" onClick={() => {
                            // Thực hiện các xử lý trước khi gửi biểu mẫu (nếu cần)
                            console.log(' props.form: ', props.form?.getFieldValue('postCategory'))
                            props.form?.submit();
                        }}
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
                                    placeholder={'Select province'}
                                    rules={[{ required: true, message: 'Chose one options of province!' }]}
                                />
                                <ProFormSelect
                                    width="sm"
                                    options={districtOptions}
                                    name="postDescription"
                                    label="District"
                                    debounceTime={5}
                                    placeholder={'Select district'}
                                    style={{ marginRight: 60 }}
                                    rules={[{ required: true, message: 'Chose one options of district!' }]}
                                />
                                <ProFormSelect
                                    width="sm"
                                    options={wardOptions}
                                    name="postDescription"
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
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
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

                        initialValue={dumbFormList}
                    >
                        <ProFormGroup >

                            <Table>
                                <TableHead >
                                    <TableRow style={{ backgroundColor: primary.main, borderRadius: "10px", width: '1000px' }}>
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
                            name: 'test',
                        }}
                        initialValue={dumbFormList}
                    >
                        <ProFormGroup key="group">
                            <ProFormText
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                name="positionName"
                                label="Position name"
                                width="sm"
                            />
                            <ProFormSelect
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                name="documentOption"
                                label="Document Option"
                                width="sm"
                            />
                            <ProFormTimePicker.RangePicker
                                name="timeFrom-timeTo"
                                label="TimeForm-To"
                                width='sm'
                                rules={[{ required: true, message: 'Chose time from & time to!' }]}
                            // initialValue={[postInfo?.data.timeFrom, postInfo?.data.timeTo]}
                            />
                            <ProFormDigit
                                name="amount"
                                label="Number of colab"
                                width="sm"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                            <ProFormMoney
                                label="Salary"
                                name="salary"
                                width="sm"
                                customSymbol="vnd"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </ProFormGroup>
                    </ProFormList>

                </ProForm>
            </Box>
        </Box>
    );
};

export default AddNewPost;
