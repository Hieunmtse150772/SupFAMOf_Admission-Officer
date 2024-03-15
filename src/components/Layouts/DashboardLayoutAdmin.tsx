import { Box, styled } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { FC, Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbarAdmin from "./DashboardNavbarAdmin";
import DashboardSideBarAdmin from "./DashboardSideBarAdmin";

// styled components
const Wrapper = styled(Box)(({ theme }) => ({
  width: `calc(100% - 80px)`,
  maxWidth: 1200,
  margin: "auto",
  paddingLeft: 80,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
}));

const DashboardLayoutAdmin: FC = ({ children }) => {
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const userInfo = useAppSelector(state => state.auth.userInfo);
  return (
    <Fragment>
      <DashboardSideBarAdmin
        showMobileSideBar={showMobileSideBar}
        closeMobileSideBar={() => setShowMobileSideBar(false)}
      />

      <Wrapper>
        <DashboardNavbarAdmin
          setShowMobileSideBar={() => setShowMobileSideBar((state) => !state)}
          userInfo={userInfo}
        />
        {children || <Outlet />}
      </Wrapper>
    </Fragment>
  );
};

export default DashboardLayoutAdmin;
