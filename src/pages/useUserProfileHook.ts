import { useState } from 'react';
const useUserProfileHook = () => {
    const [openSetting, setOpenSetting] = useState<boolean>();
    const handleOpenSetting = () => {
        setOpenSetting(true)
    }
    const onClose = () => {
        setOpenSetting(false);
    };
    const handler = {
        handleOpenSetting,
        onClose
    }
    const props = {
        openSetting
    }

    return {
        handler,
        props
    }
}

export default useUserProfileHook;
