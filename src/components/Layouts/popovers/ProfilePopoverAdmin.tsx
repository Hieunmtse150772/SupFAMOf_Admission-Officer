import { Badge, Box, ButtonBase, styled } from "@mui/material";
import FlexBox from "components/FlexBox";
import { H6, Small } from "components/Typography";
import UkoAvatar from "components/UkoAvatar";
import AppConstants from "enums/app";
import UserInfo from "models/userInfor.model";
import { FC, Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopoverLayout from "./PopoverLayout";

// styled components
const StyledSmall = styled(Small)(({ theme }) => ({
  display: "block",
  padding: "5px 1rem",
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.secondary.light
        : theme.palette.divider,
  },
}));
interface ProfilePopoverProps {
  userInfo: UserInfo | null;
}

const ProfilePopoverAdmin: FC<ProfilePopoverProps> = (userInfo) => {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isLogin = localStorage.getItem(AppConstants.USER) ? true : false;
  const handleMenuItem = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  const logout = async () => {
    if (isLogin) {
      localStorage.removeItem(AppConstants.ACCESS_TOKEN);
      localStorage.removeItem(AppConstants.USER);
      navigate('/');
    }
  }
  return (
    <Fragment>
      <ButtonBase disableRipple ref={anchorRef} onClick={() => setOpen(true)}>
        <Badge
          overlap="circular"
          variant="dot"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              width: 11,
              height: 11,
              right: "7%",
              borderRadius: "50%",
              border: "2px solid #fff",
              backgroundColor: "success.main",
            },
          }}
        >
          <UkoAvatar
            src={"https://e7.pngegg.com/pngimages/165/652/png-clipart-businessperson-computer-icons-avatar-avatar-heroes-public-relations.png"}
            sx={{ width: 50, height: 50, ml: 1 }}
          />
        </Badge>
      </ButtonBase>

      <PopoverLayout
        hiddenViewButton
        maxWidth={230}
        minWidth={200}
        popoverOpen={open}
        anchorRef={anchorRef}
        popoverClose={() => setOpen(false)}
        title={
          <FlexBox alignItems="center">
            <UkoAvatar
              src={"https://e7.pngegg.com/pngimages/165/652/png-clipart-businessperson-computer-icons-avatar-avatar-heroes-public-relations.png"}
              sx={{ width: 35, height: 35 }}
            />
            <Box ml={1}>
              <H6>Administrator</H6>
            </Box>
          </FlexBox>
        }
      >
        <Box pt={1}>
          <StyledSmall
            onClick={() => {
              logout();
            }}
          >
            Sign Out
          </StyledSmall>
        </Box>
      </PopoverLayout>
    </Fragment>
  );
};

export default ProfilePopoverAdmin;
