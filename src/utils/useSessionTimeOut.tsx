import { message } from 'antd';
import AppConstants from 'enums/app';
import { useNavigate } from 'react-router';

function useSessionTimeOut() {
    const navigate = useNavigate();
    let hasShownTimeout = false;

    const SessionTimeOut = () => {
        if (!hasShownTimeout) {
            hasShownTimeout = true;
            localStorage.removeItem(AppConstants.ACCESS_TOKEN);
            localStorage.removeItem(AppConstants.USER);
            navigate('/login');
            message.warning('Session Expired: Please log in again!');
        }
    }
    return {
        SessionTimeOut
    }
}

export default useSessionTimeOut
