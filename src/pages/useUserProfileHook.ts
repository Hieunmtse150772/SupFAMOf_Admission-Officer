import { UploadProps, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload';
import { useAppSelector } from 'app/hooks';
import { useAppDispatch } from 'app/store';
import AppConstants from 'enums/app';
import { updateAvatar } from 'features/authSlice';
import UserInfo from 'models/userInfor.model';
import { SyntheticEvent, useEffect, useState } from 'react';
import { uploadAvatar } from '../firebase';
const useUserProfileHook = () => {
    const [openSetting, setOpenSetting] = useState(false);
    const dispatch = useAppDispatch()
    const userInfo = useAppSelector(state => state.auth.userInfo)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [isloading, setLoading] = useState<boolean>(false);
    const [fileImage, setFileImage] = useState<any>('');
    const [isSave, setIsSave] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            size: 200,
            name: 'avatar',
            status: 'done',
            url: userInfo?.imgUrl,
        },
    ]);
    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    useEffect(() => {
    }, [userInfo])
    const customRequest = async ({ file, onSuccess, onError }: any) => {
        try {
            setTimeout(() => {
                setFileImage(file);
                onSuccess();
            }, 2000);
            onSuccess();
        } catch (error) {
            console.error('Lỗi khi tải lên tệp:', error);
            onError(error);
        }
    };
    const [value, setValue] = useState("1");
    const storedValue = localStorage.getItem(AppConstants.USER);
    if (storedValue !== null) {
        const useInfo: UserInfo = JSON.parse(storedValue);
    } else {
        console.error("item is not found in local storage");
    }
    const handleChange = (_: SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const handleOpenSetting = () => {
        setOpenSetting(true)
    }
    const onClose = () => {
        setOpenSetting(false);
    };
    const handleSaveAvatar = async () => {
        if (photoUrl !== '') {
            await dispatch(updateAvatar(photoUrl)).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    message.success('Save avatar successful')
                }
            }).catch((error) => {
                message.error('Save avatar fail!')
            });
        } else { message.warning('Avatar is required!') }
    }
    const handleSave = () => {
        setIsSave(true);
        setLoading(true);
    }
    const handleSaveAvatarFireBase = async () => {
        if (fileImage !== '') {
            await uploadAvatar(fileImage, setLoading, setPhotoUrl); // Gọi hàm upload của bạn
            setIsSave(false)
        } else message.error('Nothing to up')
    }
    useEffect(() => {
        if (fileImage !== '' && isSave) {
            handleSaveAvatarFireBase()
        }
    }, [isSave, fileImage])
    useEffect(() => {
        if (photoUrl !== '') { handleSaveAvatar() }
    }, [photoUrl])

    const handler = {
        handleOpenSetting,
        onClose,
        setOpenSetting,
        handleSaveAvatar,
        customRequest,
        handlePreview,
        handleChange,
        handleCancel,
        handleSaveAvatarFireBase,
        handleSave
    }
    const props = {
        openSetting,
        userInfo,
        value,
        fileList,
        onChange,
        previewOpen,
        previewTitle,
        previewImage,
        openModal,
        isloading
    }

    return {
        handler,
        props
    }
}

export default useUserProfileHook;
