"use client"

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import LinearProgress from "@mui/material/LinearProgress"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import SupportIcon from "@mui/icons-material/Support"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import {
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"
import SoftBadge from "components/SoftBadge"

// React hooks
import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { envConfig } from "env"
import { MoreHoriz } from "@mui/icons-material"
import HorizontalBarChart from "examples/Charts/BarCharts/HorizontalBarChart"
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart"
import PieChart from "examples/Charts/PieChart"
import { Pie } from "react-chartjs-2"
import { CircularProgress } from "@mui/material"

function SupportDashboard({ isAdmin, handleTabChange }) {
  const [recentTickets, setRecentTickets] = useState([])
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [priorityCounts, setPriorityCounts] = useState({})
  const [monthlyStatsData, setMonthlyStatsData] = useState({})
  const [stats, setTicketStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    cancelled: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("auth-token")

        // Fetch recent tickets
        const response = await axios.get(
          `${envConfig.backend}/tickets/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setPriorityCounts(response?.data?.adminAnalytics?.priorityCounts);
        setTicketStats(response?.data?.stats);
        setMonthlyStatsData(response?.data?.adminAnalytics?.monthlyStats);
        setRecentTickets(response?.data?.recentActiveTickets);
        setFaqs(response.data.faqs || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()


  }, [isAdmin])

  const chartData = [
    { name: "Active", value: stats.active, color: "#1A73E8" },
    { name: "Resolved", value: stats.resolved, color: "#4CAF50" },
    { name: "Cancelled", value: stats.cancelled, color: "#F44335" },
  ]

  const COLORS = ["#1A73E8", "#4CAF50", "#F44335"]

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

  const getResolutionRate = () => {
    if (stats.total === 0) return 0
    return Math.round((stats.resolved / stats.total) * 100)
  }

  // Render loading state
  if (loading) {
    return (
      // <DashboardLayout>
        // {/* <DashboardNavbar /> */}
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
          <CircularProgress color="info" />
        </SoftBox>
      // </DashboardLayout>
    )
  }

  return (
    <SoftBox>
      {/* Stats Cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} xl={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: "linear-gradient(45deg, rgba(26,115,232,0.1) 0%, rgba(26,115,232,0.3) 100%)",
                borderLeft: "1px solid rgba(26,115,232,0.2)",
              }}
            />
            <SoftBox p={1} px={2} position="relative" zIndex={1}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Total Tickets
                </SoftTypography>
                <Avatar
                  sx={{
                    bgcolor: "info.main",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px 0 rgba(26,115,232,0.3)",
                  }}
                >
                  <SupportIcon />
                </Avatar>
              </SoftBox>
              <SoftTypography variant="h3" fontWeight="bold">
                {stats.total}
              </SoftTypography>

            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} xl={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: "linear-gradient(45deg, rgba(26,115,232,0.1) 0%, rgba(26,115,232,0.3) 100%)",
                borderLeft: "1px solid rgba(26,115,232,0.2)",
              }}
            />
            <SoftBox p={1} px={2} position="relative" zIndex={1}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Active Tickets
                </SoftTypography>
                <Avatar
                  sx={{
                    bgcolor: "info.main",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px 0 rgba(26,115,232,0.3)",
                  }}
                >
                  <HelpOutlineIcon />
                </Avatar>
              </SoftBox>
              <SoftTypography variant="h3" fontWeight="bold">
                {stats.active}
              </SoftTypography>
            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} xl={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: "linear-gradient(45deg, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.3) 100%)",
                borderLeft: "1px solid rgba(76,175,80,0.2)",
              }}
            />
            <SoftBox p={1} px={2} position="relative" zIndex={1}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Resolved Tickets
                </SoftTypography>
                <Avatar
                  sx={{
                    bgcolor: "success.main",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px 0 rgba(76,175,80,0.3)",
                  }}
                >
                  <CheckCircleOutlineIcon />
                </Avatar>
              </SoftBox>
              <SoftTypography variant="h3" fontWeight="bold">
                {stats.resolved}
              </SoftTypography>
            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} xl={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: "linear-gradient(45deg, rgba(244,67,53,0.1) 0%, rgba(244,67,53,0.3) 100%)",
                borderLeft: "1px solid rgba(244,67,53,0.2)",
              }}
            />
            <SoftBox p={1} px={2} position="relative" zIndex={1}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Cancelled Tickets
                </SoftTypography>
                <Avatar
                  sx={{
                    bgcolor: "error.main",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px 0 rgba(244,67,53,0.3)",
                  }}
                >
                  <CancelOutlinedIcon />
                </Avatar>
              </SoftBox>
              <SoftTypography variant="h3" fontWeight="bold">
                {stats.cancelled}
              </SoftTypography>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>

      {/* Resolution Rate Card */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <SoftBox p={2}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={7}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={1}>
                    Resolution Rate
                  </SoftTypography>
                  <SoftBox display="flex" alignItems="center" mb={1}>
                    <SoftTypography variant="h3" fontWeight="bold" mr={1}>
                      {getResolutionRate()}%
                    </SoftTypography>
                    <Chip
                      label={
                        getResolutionRate() > 75 ? "Excellent" : getResolutionRate() > 50 ? "Good" : "Needs Improvement"
                      }
                      color={getResolutionRate() > 75 ? "success" : getResolutionRate() > 50 ? "info" : "warning"}
                      size="small"
                    />
                  </SoftBox>
                  <SoftTypography variant="button" color="text" fontWeight="regular" mb={2}>
                    {isAdmin ? "Overall ticket resolution rate" : "Your ticket resolution rate"}
                  </SoftTypography>
                  <LinearProgress
                    variant="determinate"
                    value={getResolutionRate()}
                    color={getResolutionRate() > 75 ? "success" : getResolutionRate() > 50 ? "info" : "warning"}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <PieChart chart={
                    {
                      labels: ["Resolved", "Cancelled"],
                      datasets: {
                        label: ["Resolved", "Canceled"],
                        data: [stats.resolved, stats.cancelled],
                        backgroundColors: ["success", "error"]
                      }
                    }} />
                </Grid>
              </Grid>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>

      {/* Admin Analytics */}
      {isAdmin && (
        <Grid container spacing={2} mb={2}>
          {/* Response Time by Category */}
          <Grid item xs={12} md={7}>
            <VerticalBarChart title={"Monthly Ticket Resolutions & Cancellations"} height={300} chart={monthlyStatsData} />
          </Grid>

          {/* Ticket Distribution by Type */}
          <Grid item xs={12} md={5}>
            <PieChart
              title={"Ticket Priority Analytics"}
              chart={{
                labels: ["Low", "Medium", "High"],
                datasets: {
                  label: ["Low", "Medium", "High"],
                  data: [priorityCounts?.low || 0, priorityCounts?.medium || 0, priorityCounts?.high || 0],
                  backgroundColors: ["success", "warning", "error"]
                },
                options: {
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom"
                    }
                  }
                }
              }
              } />
          </Grid>
        </Grid>
      )}

      {/* Main Dashboard Content */}
      <Grid container spacing={2}>
        {/* Recent Tickets */}
        <Grid item xs={12} md={6}>
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
                  Recent {isAdmin ? "Active" : ""} Tickets
                </SoftTypography>
                <SoftButton
                  variant="text"
                  color="info"
                  onClick={() => handleTabChange(isAdmin ? 1 : 2)}
                >
                  View All
                </SoftButton>
              </SoftBox>

              {recentTickets.length === 0 ? (
                <SoftBox textAlign="center" py={5}>
                  <SoftTypography variant="button" color="text">
                    No recent tickets found.
                  </SoftTypography>
                </SoftBox>
              ) : (
                <Stack spacing={2}>
                  {recentTickets.map((ticket, index) => (
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
                          <SoftButton
                            variant="text"
                            color="info"
                            size="small"
                            onClick={() => handleTabChange(isAdmin ? 1 : 2)}
                          >
                            View
                          </SoftButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              )}
            </SoftBox>
          </Card>
        </Grid>

        {/* FAQs Preview */}
        <Grid item xs={12} md={6}>
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
                  Frequently Asked Questions
                </SoftTypography>
                {
                  !isAdmin && (
                    <SoftButton
                      variant="text"
                      color="info"
                      endIcon={<MoreHoriz />}
                      onClick={() => handleTabChange(2)}
                    >
                      View All
                    </SoftButton>
                  )
                }
              </SoftBox>

              {faqs.length === 0 ? (
                <SoftBox textAlign="center" py={5}>
                  <SoftTypography variant="button" color="text">
                    No FAQs available.
                  </SoftTypography>
                </SoftBox>
              ) : (
                <Stack spacing={2}>
                  {faqs.map((faq, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
                          borderColor: "secondary.light",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <SoftTypography variant="button" fontWeight="medium" color="info">
                        {faq.question}
                      </SoftTypography>
                      <SoftTypography
                        variant="caption"
                        color="text"
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          mt: 1,
                        }}
                      >
                        {faq.answer}
                      </SoftTypography>
                    </Box>
                  ))}
                </Stack>
              )}
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </SoftBox>
  )
}

SupportDashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  handleTabChange: PropTypes.func.isRequired
}

export default SupportDashboard

