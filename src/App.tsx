import { CssBaseline, ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/store";
import AppConstants from "enums/app";
import { getUserProfile } from "features/authSlice";
import { FC, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate, useRoutes } from "react-router-dom";
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

  useEffect(() => {
    const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
    if (accessToken) {
      handleGetProfile().catch(() => {
        navigate('/login');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Toaster toastOptions={toasterOptions} />
        {allPages}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
