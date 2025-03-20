// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/jobs-tracking/components/Projects";
import OrderOverview from "layouts/jobs-tracking/components/OrderOverview";

import { AuthGuard } from "components/auth/auth-guard";
import { useEffect, useState } from "react";
import axios from "axios";
import { envConfig } from "env";
import PieChart from "examples/Charts/PieChart";
import { SignalWifi0Bar } from "@mui/icons-material";

function JobTracking() {
  const [data, setData] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${envConfig.backend}/jobs/tracking/analytics`, {
          headers: {
            Authorization: `Bearer ${ localStorage.getItem("auth-token")}`,
          },
        });
        
        setData(response.data);
        console.log(response.data)

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);



  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} >
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Active Fixed Price Jobs Amount" }}
                  count={`$${data ? data?.totalFixedAmount : 0}`}
                  icon={{ color: "info", component: "paid" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Active Jobs Average Hourly Price" }}
                  count={`$${data ? data?.avgHourlyPrice : 0} /hr`}
                  icon={{ color: "info", component: "done" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Ongoing Jobs" }}
                  count={`${data ? data?.totalOngoingJobs : 0} Jobs`}
                  icon={{ color: "info", component: "update" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Jobs Completed" }}
                  count={`${data ? data?.totalCompletedJobs : 0} Jobs`} 
                  icon={{ color: "info", component: "toll" }}
                />
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <GradientLineChart
                  title="Jobs History"
                  height="19.25rem"
                  chart={
                    {
                      labels: data ? data.monthlyHistory.map(m => m.month) : [],
                      datasets: [
                        {
                          label: "Total Fixed Earnings",
                          color: "info",
                          data: data ? data.monthlyHistory.map(m => m.totalFixedPrice) : [],
                        },
                        {
                          label: "Jobs Completed",
                          color: "dark",
                          data: data ? data.monthlyHistory.map(m => m.jobsCompleted) : [],
                        },
                      ],
                    }
                  }
                />
              </Grid>
              <Grid item xs={12} md={6} lg={5}>
                {/* <OrderOverview /> */}
                <PieChart title={"Jobs Division"} chart={{labels: ["Fixed Price", "Hourly"], datasets: {label: ["Fixed Price", "Hourly"], data: [data ? data.ongoingJobCounts.fixed : 0, data ? data.ongoingJobCounts.hourly : 0]}}}/>
              </Grid>
            </Grid>
          </SoftBox>
          {/* <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={5}>
                <ReportsBarChart
                  title="Project Overview"
                  description={
                    <>
                      (<strong>+23%</strong>) than last year
                    </>
                  }
                  chart={chart}
                  items={items}
                />
              </Grid>
              <Grid item xs={12} lg={7}>
                <GradientLineChart
                  title="Earnings Overview"
                  description={
                    <SoftBox display="flex" alignItems="center">
                      <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                        <Icon className="font-bold">arrow_upward</Icon>
                      </SoftBox>
                      <SoftTypography variant="button" color="text" fontWeight="medium">
                        4% more{" "}
                        <SoftTypography variant="button" color="text" fontWeight="regular">
                          in 2024
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                  }
                  height="20.25rem"
                  chart={gradientLineChartData}
                />
              </Grid>
            </Grid>
          </SoftBox> */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <Projects data={data?.ongoingJobs} />
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <OrderOverview />
            </Grid> */}
          </Grid>
        </SoftBox>
      </DashboardLayout>
    </AuthGuard>
    
  );
}

export default JobTracking;
