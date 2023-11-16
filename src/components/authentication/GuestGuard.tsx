import AppConstants from "enums/app";
import { Fragment, ReactNode } from "react";
import { Navigate } from "react-router";

// component props interface
interface GuestGuardProps {
  children: ReactNode;
}
const GuestGuard = ({ children }: GuestGuardProps) => {
  //// UNCOMMNET BELOW CODE IF YOU WANT TO HIDE AUTH PAGES TO AUTHENTICATED USERS

  const isAuthenticated = Boolean(localStorage.getItem(AppConstants.ACCESS_TOKEN));

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Fragment>{children}</Fragment>;
};

export default GuestGuard;
