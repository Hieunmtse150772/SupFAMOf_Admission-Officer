import { Box, Grid, useTheme } from "@mui/material";
import { message } from "antd";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import Analytics from "components/Dashboards/saas/Analytics";
import SaaSCard from "components/Dashboards/saas/Card";
import TotalSpent from "components/Dashboards/saas/TotalSpent";
import { getCollabOverview } from "features/manageDashboardSlice";
import useTitle from "hooks/useTitle";
import BucketIcon from "icons/BucketIcon";
import EarningIcon from "icons/EarningIcon";
import PeopleIcon from "icons/PeopleIcon";
import WindowsLogoIcon from "icons/WindowsLogoIcon";
import { FC, useEffect } from "react";

const SaaS: FC = () => {
  // change navbar title
  useTitle("Saas");
  const dispatch = useAppDispatch();
  const { collabOverview } = useAppSelector(state => state.dashboard)
  console.log('collabOverview: ', collabOverview)
  const fetchDashboard = async () => {
    await dispatch(getCollabOverview()).catch((error) => {
      message.error('Server internal error!');
    });
  }
  useEffect(() => {
    fetchDashboard()
  }, [])
  const theme = useTheme();

  const cardList = [
    {
      number: collabOverview?.data?.totalCollaborator,
      Icon: BucketIcon,
      title: "Total collaborator",
      color: theme.palette.primary.main,
    },
    {
      number: 0,
      title: "Total post",
      Icon: EarningIcon,
      color: theme.palette.primary.purple,
    },
    {
      number: 0,
      Icon: WindowsLogoIcon,
      title: "Total registration",
      color: theme.palette.primary.red,
    },
    {
      number: 0,
      Icon: PeopleIcon,
      title: "New Clients",
      color: theme.palette.primary.yellow,
    },
  ];

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {cardList.map((card, index) => (
          <Grid item lg={3} xs={6} key={index}>
            <SaaSCard card={card} />
          </Grid>
        ))}
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
