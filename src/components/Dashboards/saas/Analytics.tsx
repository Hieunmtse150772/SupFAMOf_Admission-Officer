import { Box, Card, useTheme } from "@mui/material";
import { DatePicker } from "antd";
import { ApexOptions } from "apexcharts";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import FlexBox from "components/FlexBox";
import { H5 } from "components/Typography";
import { getAnalytics } from "features/manageDashboardSlice";
import { FC, useEffect, useState } from "react";
import Chart from "react-apexcharts";


type AnalyticsParams = {
  month: number,
  year: number
}
const Analytics: FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [monthYear, setMonthYear] = useState<AnalyticsParams>({
    month: 12,
    year: 2023
  })
  const analytics = useAppSelector(state => state.dashboard.analytics);
  useEffect(() => {
    const fetch = async () => {
      await dispatch(getAnalytics(monthYear)).catch((error) => {
        console.log("Error in getting the data", error)
      })
    }
    fetch();
  }, [monthYear])
  const data = {
    series: [
      {
        name: "Personel",
        data: [analytics.data?.collaboratorNeeded, analytics.data?.collaboratorCompleteJob],
      },
    ],
    categories: [
      ["Personnel needed", "Done"]
    ],
  };
  const chartOptions: ApexOptions = {
    chart: { background: "transparent" },
    colors: [theme.palette.primary.main, "#FF9777"],
    labels: ["Personnel needed", "Done"],
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 5,
        rangeBarOverlap: false,
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: 500,
      onItemClick: { toggleDataSeries: true },
      onItemHover: { highlightDataSeries: true },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => `${value} collaborator`,
      },
    },
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
  };
  const handleChangeMonth = (value: string) => {
    console.log('value: ', value)
    setMonthYear({ month: Number(value?.split('-')[1]), year: Number(value?.split('-')[0]) });
  }
  const chartSeries = data.series;
  return (
    <Card
      sx={{
        padding: "2rem",
        height: "100%",
        [theme.breakpoints.down(425)]: { padding: "1.5rem" },
      }}
    >
      <FlexBox alignItems="center" justifyContent="space-between">
        <H5>Analytics</H5>
        <DatePicker onChange={(value, dateString) => handleChangeMonth(dateString)} picker="month" size="large" style={{ marginBottom: 10 }} />
      </FlexBox>

      <Box
        sx={{
          "& .apexcharts-tooltip *": {
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
          },
          "& .apexcharts-tooltip": {
            boxShadow: 0,
            borderRadius: 4,
            alignItems: "center",
            "& .apexcharts-tooltip-text-y-value": { color: "primary.main" },
            "& .apexcharts-tooltip.apexcharts-theme-light": {
              border: `1px solid ${theme.palette.divider}`,
            },
            "& .apexcharts-tooltip-series-group:last-child": {
              paddingBottom: 0,
            },
          },
        }}
      >
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={300}
        />
      </Box>
    </Card>
  );
};

export default Analytics;
