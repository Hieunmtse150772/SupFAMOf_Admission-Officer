import { DrawerForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Select } from 'antd';
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
    const handleSubmit = (value: any) => {
        console.log("value: ", value)
    }
    const handleUpdateProfile = async (value: any) => {
        console.log("value: ", value)

    }
    return (

        <>
            <DrawerForm
                title="Edit profile infomation"
                width={720}
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
                        width="sm"
                        name="Phone number"
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
                </ProForm.Group>
            </DrawerForm>
        </>
    );
};

export default ProfileEditDrawer;