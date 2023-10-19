import { DrawerForm, ProForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-components';
import { Select } from 'antd';
import { useAppDispatch } from 'app/store';
import updateAccountDto from 'dtos/Auth/update.account.dto';
import { updateUserProfile } from 'features/authSlice';
import UserInfo from 'models/userInfor.model';
import { FC } from 'react';

const { Option } = Select;

interface ProfileEditDrawerProps {
    onClose: () => void;
    userInfo: UserInfo | null;
    open: boolean,
    setOpenSetting: React.Dispatch<React.SetStateAction<boolean>>
}
const ProfileEditDrawer: FC<ProfileEditDrawerProps> = ({ setOpenSetting, onClose, userInfo, open }) => {
    const Formatter = 'DD/MM/YYYY';
    const dispatch = useAppDispatch();
    const handleSubmit = (value: any) => {
        console.log("value: ", value)
    }
    const handleUpdateProfile = async (value: any) => {
        const payload: updateAccountDto = {
            accountId: userInfo?.id ? userInfo?.id : 1,
            dateOfBirth: value?.dateOfBirth,
            imgUrl: userInfo?.imgUrl ? userInfo?.imgUrl : '',
            name: value?.name,
            phone: value?.phoneNumber
        }
        await dispatch(updateUserProfile(payload))
        console.log('User Infor: ', userInfo?.id)
        console.log("value: ", value)
    }
    return (

        <>
            <DrawerForm
                title="Edit profile infomation"
                width={800}
                open={open}
                onFinish={(value) => handleUpdateProfile(value)}
                onOpenChange={setOpenSetting}
                submitter={{
                    searchConfig: {
                        submitText: 'Submit',
                        resetText: 'Cancel'// Đặt lại văn bản cho nút gửi
                    }
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        name="name"
                        width="md"
                        label="Full name"
                        tooltip="Enter your full name"
                        initialValue={userInfo?.name}
                        rules={[
                            {
                                required: true,
                                message: 'Name is required!'
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="phoneNumber"
                        label="Phone number"
                        initialValue={userInfo?.phone}
                        rules={[
                            {
                                required: true,
                                message: 'Phone number is required!'
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="Email"
                        label="Email"
                        initialValue={userInfo?.email}
                        disabled
                    />
                    <ProFormDatePicker
                        width="md"
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[
                            {
                                required: true,
                                message: 'Date of Birth is required!'
                            },
                        ]}
                        initialValue={userInfo?.dateOfBirth}

                    // initialValue={moment(userInfo?.dateOfBirth).format(Formatter)}
                    />
                </ProForm.Group>
            </DrawerForm>
        </>
    );
};

export default ProfileEditDrawer;