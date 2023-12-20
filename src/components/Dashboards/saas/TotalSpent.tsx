import { Box, Card, useTheme } from "@mui/material";
import { DatePicker } from "antd";
import { ApexOptions } from "apexcharts";
import { useAppSelector } from "app/hooks";
import { useAppDispatch } from "app/store";
import { H2, H5 } from "components/Typography";
import { getMoneyYearReport } from "features/manageDashboardSlice";
import { FC, useEffect, useState } from "react";
import Chart from "react-apexcharts";



const TotalSpent: FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const dataReport = useAppSelector(state => state.dashboard.moneyReport);
  const [year, setYear] = useState<number>(2023);
  const totalMoneyReport: number = dataReport.data.reduce((total, data) => total + data, 0)
  const total = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
  }).format(totalMoneyReport)
  const data = {
    series: [
      {
        name: "Spent",
        data: dataReport.data,
      },
    ],
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };
  const fetchMoneyReport = async () => {
    await dispatch(getMoneyYearReport({ year: year })).catch((error) => {
      console.log("Error in getting the data", error)
    })
  }
  useEffect(() => {
    fetchMoneyReport()
  }, [year])
  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
    },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: false },
    fill: { opacity: 1 },
    // grid: {
    //   show: false,
    // },
    states: {
      active: {
        filter: { type: "none" },
      },
      hover: {
        filter: { type: "none" },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: data.categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 500,
        },
      },
    },
    // stroke: {
    //   lineCap: "round",
    //   curve: "smooth",
    // },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 5,
        rangeBarOverlap: false,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => {
          const formattedAmount = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0, // Số lẻ tối thiểu (0 để làm tròn)
          }).format(val);
          return `${formattedAmount}`
        }
      },
    },

    responsive: [
      {
        breakpoint: 550,
        options: {
          chart: {
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            labels: { show: false },
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                colors: theme.palette.text.disabled,
                fontFamily: theme.typography.fontFamily,
                fontWeight: 500,
              },
            },
          },
        },
      },
    ],
  };

  const chartSeries = data.series;
  const handleChangeYear = (value: string) => {
    setYear(Number(value));
  }
  return (
    <Card
      sx={{
        paddingX: 4,
        height: "100%",
        paddingBottom: "1.5rem",
        paddingTop: "calc(1.5rem + 15px)",
        [theme.breakpoints.down(425)]: { padding: "1.5rem" },
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <H5>Total Spent</H5>
          <H2 color="primary.main">{total}</H2>
        </div>
        <div>
          <DatePicker onChange={(value, dateString) => handleChangeYear(dateString)} picker="year" size="large" style={{ marginBottom: 10 }} />
        </div>
      </div>

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

          height={245}
          options={chartOptions}
          series={chartSeries}
          type="bar"
        />
      </Box>
    </Card>
  );
};

export default TotalSpent;
