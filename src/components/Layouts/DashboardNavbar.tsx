import {
  AppBar,
  Box,
  styled,
  Theme,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { H2 } from "components/Typography";
import { TitleContext } from "contexts/TitleContext";
import UserInfo from "models/userInfor.model";
import { FC, useContext } from "react";
import NotificationsPopover from "./popovers/NotificationsPopover";
import ProfilePopover from "./popovers/ProfilePopover";
import ServicePopover from "./popovers/ServicePopover";

// root component interface
interface DashboardNavBarProps {
  setShowMobileSideBar: () => void;
  userInfo: UserInfo | null;
}

// custom styled components
const DashboardNavbarRoot = styled(AppBar)(() => ({
  zIndex: 11,
  boxShadow: "none",
  paddingTop: "1rem",
  paddingBottom: "1rem",
  backdropFilter: "blur(6px)",
  backgroundColor: "transparent",
}));

const StyledToolBar = styled(Toolbar)(() => ({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
}));

const ToggleIcon = styled(Box)(({ theme }) => ({
  width: 25,
  height: 3,
  margin: "5px",
  borderRadius: "10px",
  transition: "width 0.3s",
  backgroundColor: theme.palette.primary.main,
}));

// root component
const DashboardNavbar: FC<DashboardNavBarProps> = ({
  setShowMobileSideBar, userInfo
}) => {
  const { title } = useContext(TitleContext);
  const upSm = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const downSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  if (downSm) {
    return (
      <DashboardNavbarRoot position="sticky">
        <StyledToolBar>
          <Box sx={{ cursor: "pointer" }} onClick={setShowMobileSideBar}>
            <ToggleIcon />
            <ToggleIcon />
            <ToggleIcon />
          </Box>

          <Box flexGrow={1} textAlign="center">
            <img
              src="/static/logo/supfamof_logo.png"
              width="50px"
              height="30"
              alt="Logo"
            />
          </Box>

          <ProfilePopover userInfo={userInfo} />
        </StyledToolBar>
      </DashboardNavbarRoot>
    );
  }

  return (
    <DashboardNavbarRoot position="sticky">
      <StyledToolBar>
        <Box>
          <ToggleIcon />
          <ToggleIcon />
          <ToggleIcon />
        </Box>

        <H2
          fontSize={21}
          lineHeight={0}
          mx={1}
          fontWeight="700"
          color="text.primary"
        >
          {title}
        </H2>

        <Box flexGrow={1} ml={1} />

        {upSm && (
          <>
            <NotificationsPopover />
            <ServicePopover />
          </>
        )}
        <ProfilePopover userInfo={userInfo} />
      </StyledToolBar>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;