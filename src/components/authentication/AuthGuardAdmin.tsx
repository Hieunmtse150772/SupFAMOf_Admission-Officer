import AppConstants from "enums/app";
import Login from "pages/Authentication/Login";
import { Fragment, ReactNode, useState } from "react";
import { Navigate, RouteProps, useLocation } from "react-router-dom";

// component props interface
interface AuthGuardProps extends RouteProps {
  children: ReactNode;
}

const AuthGuardAdmin = ({ children, ...routeProps }: AuthGuardProps) => {
  const isLogin = localStorage.getItem(AppConstants.ACCESS_TOKEN) ? true : false;
  const storedValue = localStorage.getItem(AppConstants.USER);


  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  if (!isLogin) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }
  console.log('storedValue: ', storedValue)
  if (storedValue) {
    const userInfo = JSON.parse(storedValue);
    if (userInfo?.roleId !== null) {
      if (userInfo?.roleId === 3) {
        if (requestedLocation && pathname !== requestedLocation) {
          setRequestedLocation(null);
          return <Navigate to={requestedLocation} />;
        }
      } else return <Navigate to={'/dashboard'} />
    }
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthGuardAdmin;
