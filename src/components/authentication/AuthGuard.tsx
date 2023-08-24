import { useAppSelector } from "app/hooks";
import AppConstants from "enums/app";
import Login from "pages/authentication/Login";
import { Fragment, ReactNode, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// component props interface
interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const isLogin = localStorage.getItem(AppConstants.ACCESS_TOKEN) ? true : false;
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

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }
  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
