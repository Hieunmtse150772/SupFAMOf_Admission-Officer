import { useState } from 'react';
const useUserProfileHook = () => {
    const [openSetting, setOpenSetting] = useState(false);
    const handleOpenSetting = () => {
        setOpenSetting(true)
    }
    const onClose = () => {
        setOpenSetting(false);
    };
    const handler = {
        handleOpenSetting,
        onClose,
        setOpenSetting
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
