import { Badge, Box, ButtonBase, Divider, styled } from "@mui/material";
import FlexBox from "components/FlexBox";
import { H6, Small, Tiny } from "components/Typography";
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

const ProfilePopover: FC<ProfilePopoverProps> = (userInfo) => {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isLogin = localStorage.getItem(AppConstants.USER) ? true : false;
  const handleMenuItem = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  const logout = () => {
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
            src={userInfo?.userInfo?.imgUrl ? userInfo?.userInfo?.imgUrl : "/static/avatar/001-man.svg"}
            sx={{ width: 30, height: 30, ml: 1 }}
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
              src={"/static/avatar/001-man.svg"}
              sx={{ width: 35, height: 35 }}
            />

            <Box ml={1}>
              <H6>{userInfo?.userInfo?.name}</H6>
              <Tiny display="block" fontWeight={500} color="text.disabled">
                {userInfo?.userInfo?.email}
              </Tiny>
            </Box>
          </FlexBox>
        }
      >
        <Box pt={1}>
          <StyledSmall
            onClick={() => handleMenuItem("/dashboard/user-profile")}
          >
            Set Status
          </StyledSmall>

          <StyledSmall
            onClick={() => handleMenuItem("/dashboard/user-profile")}
          >
            Profile & Account
          </StyledSmall>

          <Divider sx={{ my: 1 }} />

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

export default ProfilePopover;
