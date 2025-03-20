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
import AccessTimeIcon from "@mui/icons-material/AccessTime"

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
import { Pie } from "react-chartjs-2";
import { Box, Card, Stack } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";
import { useNavigate } from "react-router-dom";

function SupportDashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const navigate = useNavigate()

  const [responseData, setResponseData] = useState({});

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${envConfig.backend}/admin/statistics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        });
        console.log(response.data)
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "info"
      case "resolved":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "info"
      case "medium":
        return "warning"
      case "high":
        return "error"
      case "urgent":
        return "error"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }


  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3} >
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Total Linked Accounts" }}
                  count={responseData?.stats?.totalLinkedAccounts.toString()}
                  // percentage={{ color: "success", text: "+55%" }}
                  icon={{ color: "info", component: "public" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Total Users" }}
                  count={responseData?.stats?.totalUsers.toString()}
                  // percentage={{ color: "success", text: "+3%" }}
                  icon={{ color: "info", component: "public" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Subscriptions Earnings" }}
                  count="$ 0"
                  icon={{ color: "info", component: "paid" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={3}>
                <MiniStatisticsCard
                  title={{ text: "Active Tickets" }}
                  count={responseData?.stats?.ticketsStats?.active}
                  // percentage={{ color: "success", text: "+5%" }}
                  icon={{
                    color: "info",
                    component: "public",
                  }}
                />
              </Grid>
            </Grid>
          </SoftBox>
          {/* <SoftBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <BuildByDevelopers />
              </Grid>
              <Grid item xs={12} lg={5}>
                <WorkWithTheRockets />
              </Grid>
            </Grid>
          </SoftBox> */}
          <SoftBox mb={3}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12} lg={5}>
                <ReportsBarChart
                  title="Active users"
                  description={
                    <>
                      (<strong>+23%</strong>) than last week
                    </>
                  }
                  chart={chart}
                  items={items}
                />
              </Grid> */}
              <Grid item xs={12} lg={6}>
                <GradientLineChart
                  title="Subscriptions Sales"
                  description={
                    <SoftBox display="flex" alignItems="center">
                      <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                        <Icon className="font-bold">arrow_upward</Icon>
                      </SoftBox>
                      <SoftTypography variant="button" color="text" fontWeight="medium">
                        4% more{" "}
                        <SoftTypography variant="button" color="text" fontWeight="regular">
                          in 2021
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                  }
                  height="20.25rem"
                  chart={gradientLineChartData}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <GradientLineChart
                  title="Users Overview"
                  description={
                    <SoftBox display="flex" alignItems="center">
                      <SoftTypography variant="button" color="success" fontWeight="medium">
                        New Users {" "}
                        <SoftTypography variant="button" color="text" fontWeight="regular">
                          joined in past 6 months
                        </SoftTypography>
                      </SoftTypography>
                    </SoftBox>
                  }
                  height="20.25rem"
                  chart={
                    {
                      labels: responseData?.stats?.usersData?.labels,
                      datasets: [
                        {
                          label: "New Users",
                          color: "success",
                          data: responseData?.stats?.usersData?.data,
                        },
                      ],
                    }
                  }
                />
              </Grid>
            </Grid>
          </SoftBox>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <OrderOverview />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Tickets Status
                  </SoftTypography>
                  <Box height={250}>
                    <Pie
                      data={
                        {
                          labels: ["Active", "Resolved", "Cancelled"],
                          datasets: [
                            {
                              label: "Tickets Status",
                              data: [responseData?.stats?.ticketsStats?.active, responseData?.stats?.ticketsStats?.resolved, responseData?.stats?.ticketsStats?.cancelled],
                              backgroundColor: [
                                "rgba(153, 102, 255, 0.6)",
                                "rgba(255, 206, 86, 0.6)",
                                "rgba(54, 162, 235, 0.6)",
                              ],
                              borderColor: [
                                "rgba(153, 102, 255, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(54, 162, 235, 1)",
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

            {/* Recent Tickets */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                  height: "100%",
                }}
              >
                <SoftBox p={2}>
                  <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <SoftTypography variant="h6" fontWeight="medium">
                      Recent Active Tickets
                    </SoftTypography>
                    <SoftButton
                      variant="text"
                      color="info"
                      onClick={() => navigate("/support")}
                    >
                      View All
                    </SoftButton>
                  </SoftBox>

                  {responseData?.stats?.recentActiveTickets.length === 0 ? (
                    <SoftBox textAlign="center" py={5}>
                      <SoftTypography variant="button" color="text">
                        No recent tickets found.
                      </SoftTypography>
                    </SoftBox>
                  ) : (
                    <Stack spacing={2}>
                      {responseData?.stats?.recentActiveTickets.map((ticket, index) => (
                        <Box
                          key={ticket.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "divider",
                            "&:hover": {
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
                              borderColor: "secondary.light",
                            },
                            transition: "all 0.3s ease",
                            mb: 1,
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={7}>
                              <SoftTypography variant="button" fontWeight="medium">
                                {ticket.subject}
                              </SoftTypography>
                              <SoftBox display="flex" alignItems="center" mt={1}>
                                <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                                <SoftTypography variant="caption" color="text">
                                  {formatDate(ticket.createdAt)}
                                </SoftTypography>
                              </SoftBox>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={5}
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "flex-start", sm: "flex-end" },
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <SoftBadge
                                variant="gradient"
                                badgeContent={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                color={getStatusColor(ticket.status)}
                                size="xs"
                                container
                              />
                              <SoftBadge
                                variant="gradient"
                                badgeContent={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                color={getPriorityColor(ticket.priority)}
                                size="xs"
                                container
                              />
                              {/* <SoftButton
                                variant="text"
                                color="info"
                                size="small"
                                onClick={() => handleTabChange(isAdmin ? 1 : 2)}
                              >
                                View
                              </SoftButton> */}
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </DashboardLayout>
    </AuthGuard>

  );
}

export default SupportDashboard;
