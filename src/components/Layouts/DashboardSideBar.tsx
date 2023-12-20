import {
  Box,
  Drawer,
  List,
  ListItemButton,
  styled,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useAppDispatch } from "app/store";
import AppConstants from "enums/app";
import { getUserProfile } from "features/authSlice";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollBar from "simplebar-react";
import { admissionTopMenu } from "./topMenuList";

// root component interface
interface SideNavBarProps {
  showMobileSideBar: boolean;
  closeMobileSideBar: () => void;
}

// custom styled components
const MainMenu = styled(Box)(({ theme }) => ({
  left: 0,
  width: 80,
  height: "100%",
  position: "fixed",
  boxShadow: theme.shadows[2],
  transition: "left 0.3s ease",
  zIndex: theme.zIndex.drawer + 11,
  backgroundColor: "#F09101",
  [theme.breakpoints.down("md")]: { left: -80 },
  "& .simplebar-track.simplebar-vertical": { width: 7 },
  "& .simplebar-scrollbar:before": {
    background: theme.palette.text.primary,
  },
}));

const StyledListItemButton = styled(ListItemButton)(() => ({
  marginBottom: "1rem",
  justifyContent: "center",
  color: 'black'
}));

// root component
const DashboardSideBar: FC<SideNavBarProps> = ({
  showMobileSideBar,
  closeMobileSideBar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
  const userInfo = localStorage.getItem(AppConstants.USER)

  const handleGetProfile = async () => {
    await dispatch(getUserProfile()).catch((error) => {

    });
  };
  useEffect(() => {
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user?.roleId !== null) {
        if (user?.roleId === 1) {
          handleGetProfile().catch(() => {
            navigate('/login');
          });
        }
      }
    }
  }, [accessToken]);
  const handleActiveMainMenu = (menuItem: any) => () => {
    setActive(menuItem.title);
    navigate(menuItem.path);
    closeMobileSideBar();
  };

  // main menus content
  const mainSideBarContent = (
    <List sx={{ height: "100%" }}>
      <StyledListItemButton disableRipple onClick={() => navigate('/dashboard')}>
        <img src="/static/logo/supfamof-website-favicon-white.png" alt="SupFAMof Logo" width={31} />
      </StyledListItemButton>
      <ScrollBar style={{ maxHeight: "calc(100% - 50px)" }}>
        {admissionTopMenu.map((nav, index) => (
          <Tooltip title={nav.title} placement="right" key={index}>
            <StyledListItemButton
              disableRipple
              onClick={handleActiveMainMenu(nav)}
            >
              <nav.Icon
                sx={{
                  color:
                    location.pathname === nav.path ? "black" : "white",
                }}
              />
            </StyledListItemButton>
          </Tooltip>
        ))}
      </ScrollBar>
    </List>
  );

  // for mobile device
  if (downMd) {
    return (
      <Drawer
        anchor="left"
        open={showMobileSideBar}
        onClose={closeMobileSideBar}
        PaperProps={{ sx: { width: 80 } }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            width: "inherit",
            position: "fixed",
            overflow: "hidden",
            flexDirection: "column",
            boxShadow: (theme) => theme.shadows[1],
            backgroundColor: (theme) => '#F09101',
            "& .simplebar-track.simplebar-vertical": { width: 7 },
            "& .simplebar-scrollbar:before": {
              background: (theme) => theme.palette.text.primary,
            },
          }}
        >
          {mainSideBarContent}
        </Box>
      </Drawer>
    );
  }

  return <MainMenu>{mainSideBarContent}</MainMenu>;
};

export default DashboardSideBar;
