import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/store";
import AppConstants from "enums/app";
import { getUserProfile } from "features/authSlice";
import { getToken } from "firebase/messaging";
import { FC, useEffect } from "react";
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
    const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
    if (accessToken) {
      handleGetProfile().catch(() => {
        navigate('/login');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>

          <CssBaseline />
          <Toaster toastOptions={toasterOptions} />
          {allPages}
        </LocalizationProvider>

      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
