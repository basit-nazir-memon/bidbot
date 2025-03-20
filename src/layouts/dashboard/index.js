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
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import { AuthGuard } from "components/auth/auth-guard";
import { useEffect, useState } from "react";
import axios from "axios";
import { envConfig } from "env";
import { Line, Pie } from "react-chartjs-2";
import { Box, Card } from "@mui/material";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;

  const [summary, setSummary] = useState({
    name: "",
    totalEarnings: 0,
    totalJobs: 0,
    totalConnects: 0,
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${envConfig.backend}/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });
        setSummary(response.data);
        console.log(response.data);

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
                  title={{ text: "Total Earnings" }}
                  count={`$${summary?.totalEarnings || 0}`}
                  icon={{ color: "info", component: "paid" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Jobs Completed" }}
                  count={`${summary?.totalCompletedJobs || 0} Job(s)`}
                  icon={{ color: "info", component: "done" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Ongoing Jobs" }}
                  count={`${summary?.totalOngoingJobs || 0} Jobs`}
                  // percentage={{ color: "error", text: "-2%" }}
                  icon={{ color: "info", component: "update" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Connects" }}
                  count={summary?.totalConnects || 0}
                  icon={{ color: "info", component: "toll" }}
                />
              </Grid>
            </Grid>
          </SoftBox>
          {
            (localStorage.getItem('role') === "Company Admin" || localStorage.getItem('role') === "Individual Freelancer") && (
            <SoftBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={7}>
                  <BuildByDevelopers
                    title={`Welcome ${summary.name}`}
                    subtitle={`Link Your Accounts`}
                    description={"Link your Upwork account to BidBot and let automation handle job bidding while you focus on what matters most—executing your projects efficiently!"}
                    buttonText={"Lets Go"}
                    buttonLink={'/accounts'}
                  />
                </Grid>
                <Grid item xs={12} lg={5}>
                  <WorkWithTheRockets />
                </Grid>
              </Grid>
            </SoftBox>
            )
          }
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                  <SoftBox p={3}>
                    <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                      Monthly Earnings
                    </SoftTypography>
                    <Box height={250}>
                      <Line
                        data={
                          {
                            labels: summary?.monthlyHistory?.labels,
                            datasets: [
                              {
                                label: "Monthly Earnings ($)",
                                data: summary?.monthlyHistory?.totalEarningsData,
                                borderColor: "rgba(75, 192, 192, 1)",
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                fill: true,
                              },
                            ],
                          }
                        }
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: false,
                            },
                          },
                        }}
                      />
                    </Box>
                  </SoftBox>
                </Card>
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Monthly Earnings
                  </SoftTypography>
                  <Box height={250}>
                    <Line
                      data={
                        {
                          labels: summary?.monthlyEarnings?.labels,
                          datasets: [
                            {
                              label: "Monthly Earnings ($)",
                              data: summary?.monthlyEarnings?.data,
                              borderColor: "rgba(75, 192, 192, 1)",
                              backgroundColor: "rgba(75, 192, 192, 0.2)",
                              fill: true,
                            },
                          ],
                        }
                      }
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                          },
                        },
                      }}
                    />
                  </Box>
                </SoftBox>
              </Card>
            </Grid> */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                  <SoftBox p={3}>
                    <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                      Proposal Status
                    </SoftTypography>
                    <Box height={250}>
                      <Pie
                        data={
                          {
                            labels: ["Accepted", "Pending"],
                            datasets: [
                              {
                                label: "Proposal Status",
                                data: [summary?.proposalStatus?.accepted, summary?.proposalStatus?.waiting],
                                backgroundColor: [
                                  "rgba(75, 192, 192, 0.6)",
                                  "rgba(153, 102, 255, 0.6)",
                                ],
                                borderColor: [
                                  "rgba(75, 192, 192, 1)",
                                  "rgba(153, 102, 255, 1)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        }
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </Box>
                  </SoftBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                  <SoftBox p={3}>
                    <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                      Project Status
                    </SoftTypography>
                    <Box height={250}>
                      <Pie
                        data={
                          {
                            labels: ["Suggested", "Not Started", "In Progress", "Completed"],
                            datasets: [
                              {
                                label: "Project Status",
                                data: [
                                  summary?.projectStatus?.suggested,
                                  summary?.projectStatus?.notStarted,
                                  summary?.projectStatus?.ongoing,
                                  summary?.projectStatus?.completed,
                                ],
                                backgroundColor: [
                                  "rgba(255, 99, 132, 0.6)",
                                  "rgba(255, 206, 86, 0.6)",
                                  "rgba(54, 162, 235, 0.6)",
                                  "rgba(75, 192, 192, 0.6)",
                                ],
                                borderColor: [
                                  "rgba(255, 99, 132, 1)",
                                  "rgba(255, 206, 86, 1)",
                                  "rgba(54, 162, 235, 1)",
                                  "rgba(75, 192, 192, 1)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        }
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </Box>
                  </SoftBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                  <SoftBox p={3}>
                    <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                      Support Ticket Stats
                    </SoftTypography>
                    <Box height={250}>
                      <Pie
                        data={
                          {
                            labels: ["Active", "Resolved", "Cancelled"],
                            datasets: [
                              {
                                label: "Support Ticket Status",
                                data: [
                                  summary?.stats?.active, summary?.stats?.resolved, summary?.stats?.cancelled
                                ],
                                backgroundColor: [
                                  "rgba(54, 162, 235, 0.6)",
                                  "rgba(75, 192, 192, 0.6)",
                                  "rgba(255, 99, 132, 0.6)",
                                ],
                                borderColor: [
                                  "rgba(54, 162, 235, 1)",
                                  "rgba(75, 192, 192, 1)",
                                  "rgba(255, 99, 132, 1)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        }
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "bottom",
                            },
                          },
                        }}
                      />
                    </Box>
                  </SoftBox>
                </Card>
              </Grid>
              {/* <Grid item xs={12} md={4}>
              <PieChart chart={
                {
                  labels: ["Active", "Resolved", "Cancelled"],
                  datasets: {
                    label: ["Active", "Resolved", "Canceled"],
                    data: [summary?.stats?.active, summary?.stats?.resolved, summary?.stats?.cancelled],
                    backgroundColors: ["info", "success", "error"]
                  }
                }} />
            </Grid> */}
            </Grid>
          </SoftBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <Projects data={summary?.ongoingJobs} />
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

export default Dashboard;
