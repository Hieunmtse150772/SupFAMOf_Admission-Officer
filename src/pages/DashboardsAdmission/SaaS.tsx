import { Box, Grid, useTheme } from "@mui/material";
import { Avatar, message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Analytics from "components/Dashboards/saas/Analytics";
import SaaSCard, { StyledCard } from "components/Dashboards/saas/Card";
import TotalSpent from "components/Dashboards/saas/TotalSpent";
import { H5 } from "components/Typography";
import { getAnalytics, getCollabOverview, getMoneyYearReport, getRegistrationComplete } from "features/manageDashboardSlice";
import useTitle from "hooks/useTitle";
import ProfileIcon from "icons/ProfileIcon";
import UploadIcon from "icons/UploadIcon";
import UserPlusIcon from "icons/UserPlusIcon";
import { FC, useEffect } from "react";

const SaaS: FC = () => {
  // change navbar title
  useTitle("Saas");
  const dispatch = useAppDispatch();
  const { collabOverview, totalRegistration } = useAppSelector(state => state.dashboard)
  const fetchDashboard = async () => {
    await dispatch(getCollabOverview()).catch((error) => {
      message.error('Server internal error!');
    });
    await dispatch(getRegistrationComplete()).catch((error) => {
      message.error('Server internal error!');
    });
    await dispatch(getMoneyYearReport({ year: new Date().getFullYear() })).catch((error) => {
      console.log("Error in getting the data", error)
    })
    await dispatch(getAnalytics({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    })).catch((error) => {
      console.log("Error in getting the data", error)
    })
  }

  useEffect(() => {
    fetchDashboard()
  }, [])
  const theme = useTheme();

  const cardList = [
    {
      number: collabOverview?.data?.totalCollaborator,
      Icon: ProfileIcon,
      title: "Total collaborator",
      color: theme.palette.primary.main,
    },
    {
      number: collabOverview?.data?.totalPost,
      title: "Total post",
      Icon: UploadIcon,
      color: theme.palette.primary.purple,
    },
    {
      number: totalRegistration?.data?.totalRegistration,
      Icon: UserPlusIcon,
      title: "Registrations monthly",
      color: theme.palette.primary.red,
    }
  ];
  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {cardList.map((card, index) => (
          <Grid item lg={3} xs={6} key={index}>
            <SaaSCard card={card} />
          </Grid>
        ))}
        <Grid item lg={3} xs={6}>
          <StyledCard style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <Box style={{ textAlign: 'center' }}>
              <H5 color="text.disabled">New Clients</H5>
              <Avatar.Group
                maxCount={3}
                maxPopoverTrigger="click"
                size="large"
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
              >
                {collabOverview?.data?.newCollaborators?.map((collabUrl) => (
                  <Avatar src={collabUrl.imgUrl} />

                ))}
              </Avatar.Group>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
      <Grid container spacing={4} pt={4}>
        <Grid item lg={8} md={7} xs={12}>
          <TotalSpent />
        </Grid>
        <Grid item lg={4} md={5} xs={12}>
          <Analytics />
        </Grid>

      </Grid>
    </Box>
  );
};

export default SaaS;
