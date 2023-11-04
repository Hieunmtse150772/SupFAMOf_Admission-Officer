import { Close } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline, IconButton, ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import AppConstants from "enums/app";
import { getUserProfile } from "features/authSlice";
import { getToken } from "firebase/messaging";
import { SnackbarProvider } from "notistack";
import React, { FC, RefObject, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, useRoutes } from "react-router-dom";
import './app.scss';
import { messaging } from "./firebase";
import routes from "./routes";
import { ukoTheme } from "./theme";

const App: FC = () => {
  const allPages = useRoutes(routes);
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  // App theme
  const appTheme = ukoTheme();
  const isLoading = useAppSelector(state => state.auth.loading)
  const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);

  // toaster options
  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Montserrat', sans-serif",
    },
  };
  const handleGetProfile = async () => {
    const result = await dispatch(getUserProfile());
    unwrapResult(result);
  };
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BGBbpMWpzqAeM_qN6wtPlNRsG-rNVXYp_H-TTwBw0CWKWjDr0JYgs2lhF09SJXB7EGrSZJOYZAA4yuZXxf6O_QQ"
      });
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }
  useEffect(() => {
    if (accessToken) {
      handleGetProfile().catch(() => {
        navigate('/login');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);
  const notistackRef: RefObject<SnackbarProvider> = React.createRef();

  const onClickDismiss = (key: string | number) => () => {
    notistackRef.current?.closeSnackbar(key);
  };
  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      maxSnack={3}
      ref={notistackRef}
      autoHideDuration={3000}
      action={key => (
        <IconButton onClick={onClickDismiss(key)} color="secondary">
          <Close />
        </IconButton>
      )}
      dense
    >
      <Spin spinning={isLoading}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={appTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <Toaster toastOptions={toasterOptions} />
              {allPages}
            </LocalizationProvider>

          </ThemeProvider>
        </StyledEngineProvider>
      </Spin>
    </SnackbarProvider>

  );
};

export default App;
