import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Grid, Tab, styled } from "@mui/material";
import { useAppSelector } from "app/hooks";
import AvatarChangeModal from 'components/AvatarChangeModal/AvatarChangeModal';
import AvatarFilePicker from 'components/AvatarFilePicker';
import FlexBox from "components/FlexBox";
import SearchInput from "components/SearchInput";
import { H3 } from "components/Typography";
import FollowerCard from "components/userProfile/FollowerCard";
import FriendCard from "components/userProfile/FriendCard";
import Gallery from "components/userProfile/Gallery";
import Profile from "components/userProfile/Profile";
import AppConstants from "enums/app";
import useTitle from "hooks/useTitle";
import UserInfo from "models/userInforLogin.model";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import ProfileEditDrawer from './drawer/profileEditDrawer';
import useUserProfileHook from './useUserProfileHook';

// styled components
const StyledCard = styled(Card)(() => ({
  position: "relative",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
}));

const ContentWrapper = styled(FlexBox)(() => ({
  top: -20,
  alignItems: "center",
  position: "relative",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.primary,
}));

const StyledTabList = styled(TabList)(({ theme }) => ({
  [theme.breakpoints.down(780)]: {
    width: "100%",
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-between",
    },
    marginBottom: 20,
  },
  [theme.breakpoints.up("sm")]: {
    "& .MuiTabs-flexContainer": {
      minWidth: 400,
      justifyContent: "space-between",
    },
  },
}));

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,
}));

const UserProfile: FC = () => {
  const { handler, props } = useUserProfileHook();
  const [imageUrl, setImageUrl] = useState<any>()
  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleOpenEditAvatarModal = () => {
    setOpenModal(true)
  }
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // if (event.target.files) {
    //   await setImageUrl(event.target.files[0]);
    // }
  };
  // change navbar title
  useTitle("User Profile");
  // const [userInfo, setUserInfo] = useState<UserInfo>()
  const userInfo = useAppSelector(state => state.auth.userInfo)
  useEffect(() => {
  }, [userInfo])
  const [value, setValue] = useState("1");
  const storedValue = localStorage.getItem(AppConstants.USER);
  if (storedValue !== null) {
    const useInfo: UserInfo = JSON.parse(storedValue);
    // setUserInfo(useInfo);
  } else {
    console.error("item is not found in local storage");
  }
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useEffect(() => {
  }, [userInfo])

  return (
    <Box pt={2} pb={4}>
      <TabContext value={value}>
        <StyledCard>
          <Box sx={{ height: 200, width: "100%", overflow: "hidden" }}>
            <img
              src={"/static/cover/dai-hoc-fpt-tp-hcm-1.jpeg"}
              alt="User Cover"
              height="100%"
              width="100%"
              style={{ objectFit: "cover" }}
            />
          </Box>

          <FlexBox
            flexWrap="wrap"
            padding="0 2rem"
            alignItems="center"
            justifyContent="space-between"
          >
            <ContentWrapper>

              <AvatarFilePicker
                handleOpenEditAvatarModal={handleOpenEditAvatarModal}
                imgUrl={userInfo?.imgUrl}
                name='imgUrl'
                onChange={handleFileUpload}
              // src={userInfo?.imgUrl}
              />

              <Box marginLeft={3} marginTop={3}>
                <H3 lineHeight={1.2}>{userInfo?.name}</H3>
                {/* <Small color="text.disabled">UI Designer</Small> */}
              </Box>
            </ContentWrapper>

            <StyledTabList onChange={handleChange} >
            </StyledTabList>
            <Box style={{ borderRadius: 50, backgroundColor: '#E5EAEA', width: 40, height: 40, display: 'flex' }} sx={{ "&:hover": { color: "#F09101" } }} onClick={handler.handleOpenSetting} >
              <ModeOutlinedIcon fontSize='medium' sx={{ margin: 'auto' }} />
              {props.openSetting && <ProfileEditDrawer setOpenSetting={handler.setOpenSetting} onClose={handler.onClose} userInfo={userInfo} open={props.openSetting} />}
            </Box>

          </FlexBox>
        </StyledCard>

        <Box marginTop={3}>
          <StyledTabPanel value="1">
            <Profile userInfo={userInfo} />
          </StyledTabPanel>

          <StyledTabPanel value="2">
            <Grid container spacing={3}>
              {followers.map((item, index) => (
                <Grid item lg={4} sm={6} xs={12} key={index}>
                  <FollowerCard follower={item} />
                </Grid>
              ))}
            </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="3">
            <H3>Friends</H3>
            <SearchInput placeholder="Search Friends..." sx={{ my: 2 }} />

            <Grid container spacing={3}>
              {friends.map((friend, index) => (
                <Grid item lg={4} sm={6} xs={12} key={index}>
                  <FriendCard friend={friend} />
                </Grid>
              ))}
            </Grid>
          </StyledTabPanel>

          <StyledTabPanel value="4">
            <Gallery />
          </StyledTabPanel>
        </Box>
      </TabContext>
      <AvatarChangeModal isModalOpen={openModal} avatar={userInfo?.imgUrl} />
    </Box>
  );
};

const followers = [
  {
    image: "/static/avatar/040-man-11.svg",
    name: "Mr. Breast",
    profession: "Product Designer",
    following: true,
  },
  {
    image: "/static/avatar/041-woman-11.svg",
    name: "Ethan Drake",
    profession: "UI Designer",
    following: true,
  },
  {
    image: "/static/avatar/042-vampire.svg",
    name: "Selena Gomez",
    profession: "Marketing Manager",
    following: false,
  },
  {
    image: "/static/avatar/043-chef.svg",
    name: "Sally Becker",
    profession: "UI Designer",
    following: true,
  },
  {
    image: "/static/avatar/044-farmer.svg",
    name: "Dua Lipa",
    profession: "Marketing Manager",
    following: false,
  },
  {
    image: "/static/avatar/045-man-12.svg",
    name: "Joe Murry",
    profession: "Product Designer",
    following: true,
  },
  {
    image: "/static/avatar/040-man-11.svg",
    name: "Mr. Breast",
    profession: "Product Designer",
    following: true,
  },
  {
    image: "/static/avatar/041-woman-11.svg",
    name: "Ethan Drake",
    profession: "UI Designer",
    following: true,
  },
  {
    image: "/static/avatar/042-vampire.svg",
    name: "Selena Gomez",
    profession: "Marketing Manager",
    following: false,
  },
  {
    image: "/static/avatar/043-chef.svg",
    name: "Sally Becker",
    profession: "UI Designer",
    following: true,
  },
  {
    image: "/static/avatar/044-farmer.svg",
    name: "Dua Lipa",
    profession: "Marketing Manager",
    following: false,
  },
  {
    image: "/static/avatar/045-man-12.svg",
    name: "Joe Murry",
    profession: "Product Designer",
    following: true,
  },
];

const friends = [
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
  {
    name: "Selena Gomez",
    image: "/static/avatar/012-woman-2.svg",
    profession: "Marketing Manager",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    dribbleUrl: "",
  },
];

export default UserProfile;
