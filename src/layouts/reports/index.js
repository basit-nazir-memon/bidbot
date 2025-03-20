"use client"

// @mui material components
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"
import Carousel from "react-material-ui-carousel"

// Icons
import DescriptionIcon from "@mui/icons-material/Description"
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import ViewKanbanIcon from "@mui/icons-material/ViewKanban"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"
import SoftBadge from "components/SoftBadge"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// React hooks
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// Charts
import { Pie, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    BarElement,
    ArcElement,
} from "chart.js"
import { envConfig } from "env"
import axios from "axios"
import { Alert, CircularProgress, Snackbar } from "@mui/material"

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
)

function Reports() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [role, setRole] = useState("User");

    // Report categories for carousel
    const reportCategories = [
        {
            title: "Jobs & Proposals",
            description: "Track job applications, proposals, and success rates",
            icon: <WorkIcon sx={{ fontSize: 40 }} />,
            color: "warning",
            path: "/reports/jobs-proposals",
            role: "User",
        },
        {
            title: "User & Account",
            description: "User activity, team performance, and account metrics",
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: "success",
            path: "/reports/user-account",
            role: "User",
        },
        {
            title: "Financial",
            description: "Revenue, spending, connects usage, and financial metrics",
            icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
            color: "info",
            path: "/reports/financial",
            role: "User",
        },
        {
            title: "Kanban & Projects",
            description: "Project progress, task completion, and workflow metrics",
            icon: <ViewKanbanIcon sx={{ fontSize: 40 }} />,
            color: "warning",
            path: "/reports/kanban-projects",
            role: "User",
        },
        {
            title: "Analytics & Logs",
            description: "System analytics, support tickets, and security logs",
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            color: "info",
            path: "/reports/analytics-logs",
            role: "Admin",
        },
        {
            title: "Admin Reports",
            description: "System-wide metrics and administrative reports",
            icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
            color: "success",
            path: "/reports/admin",
            role: "Admin",
        },
    ]

    // Featured reports for large cards
    const featuredReports = [
        {
            title: "Monthly Earnings Report",
            description: "Track your monthly earnings, trends, and financial performance",
            category: "Financial",
            icon: <AttachMoneyIcon />,
            color: "success",
            path: "/reports/financial",
            lastUpdated: "Today",
        },
        {
            title: "Proposal Success Rate",
            description: "Analyze your proposal success rate and conversion metrics",
            category: "Jobs & Proposals",
            icon: <WorkIcon />,
            color: "primary",
            path: "/reports/jobs-proposals",
            lastUpdated: "Yesterday",
        },
        {
            title: "Team Performance",
            description: "Evaluate team member performance and productivity",
            category: "User & Account",
            icon: <PeopleIcon />,
            color: "info",
            path: "/reports/user-account",
            lastUpdated: "2 days ago",
        },
        {
            title: "Project Completion",
            description: "Track project completion rates and timeline adherence",
            category: "Kanban & Projects",
            icon: <ViewKanbanIcon />,
            color: "warning",
            path: "/reports/kanban-projects",
            lastUpdated: "3 days ago",
        },
    ]

    const handleReportCardClick = (path) => {
        navigate(path)
    }


    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("auth-token");
                const roleResponse = await axios.get(`${envConfig.backend}/user/role`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRole(roleResponse?.data?.role);

                if (roleResponse?.data?.role !== "Admin") {
                    const response = await axios.get(`${envConfig.backend}/reports/general`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setReportData(response.data);
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data");
                setLoading(false);
                setOpenSnackbar(true);
            }
        };

        fetchReportData();
    }, []);

    // Render loading state
    if (loading) {
        return (
            <DashboardLayout>
                <DashboardNavbar />
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
                    <CircularProgress color="info" />
                </SoftBox>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        background: "linear-gradient(195deg, #42424a, #191919)",
                        mb: 3,
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "40%",
                            height: "100%",
                            background:
                                "url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            opacity: 0.1,
                        }}
                    />
                    <SoftBox p={4} position="relative" zIndex={1}>
                        <SoftBox display="flex" alignItems="center" mb={0.5}>
                            <DescriptionIcon sx={{ color: "white", mr: 1 }} />
                            <SoftTypography variant="h3" fontWeight="bold" color="white">
                                Reports
                            </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="body2" fontWeight="regular" color="white" opacity={0.8}>
                            Access, generate, and download comprehensive reports to analyze your data and make informed decisions.
                        </SoftTypography>
                    </SoftBox>
                </Paper>

                {/* Report Categories Carousel */}
                <SoftBox mb={3}>
                    <SoftTypography variant="h5" fontWeight="medium" mb={1}>
                        Report Categories
                    </SoftTypography>
                    <Carousel
                        animation="slide"
                        autoPlay={false}
                        // navButtonsAlwaysVisible
                        indicators={false}
                        cycleNavigation={false}
                    // navButtonsProps={{
                    //     style: {
                    //         backgroundColor: "#1A73E8",
                    //         borderRadius: 8,
                    //         padding: 5,
                    //     },
                    // }}
                    >
                        {[0, 1].map((page) => (
                            <Grid container spacing={2} key={page}>
                                {reportCategories.filter(category => (role === "Admin" ? category.role === "Admin" : category.role === "User")).slice(page * 3, (page + 1) * 3).map((category) => (
                                    <Grid item xs={12} md={4} key={category.title}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-5px)",
                                                    boxShadow: "0 12px 20px 0 rgba(0,0,0,0.15)",
                                                    cursor: "pointer",
                                                },
                                                height: "100%",
                                            }}
                                            onClick={() => handleReportCardClick(category.path)}
                                        >
                                            <SoftBox p={3} display="flex" flexDirection="column" height="100%">
                                                <Box
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 2,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        mb: 2,
                                                        bgcolor: `${category.color}.main`,
                                                        color: "white",
                                                    }}
                                                >
                                                    {category.icon}
                                                </Box>
                                                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                    <SoftTypography variant="h6" fontWeight="medium">
                                                        {category.title}
                                                    </SoftTypography>
                                                </SoftBox>
                                                <SoftTypography variant="button" color="text" fontWeight="regular">
                                                    {category.description}
                                                </SoftTypography>
                                                <Box sx={{ flexGrow: 1 }} />
                                                <SoftButton
                                                    variant="text"
                                                    color={category.color}
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{ alignSelf: "flex-start", mt: 2 }}
                                                >
                                                    View Reports
                                                </SoftButton>
                                            </SoftBox>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                    </Carousel>
                </SoftBox>

                {
                    role !== "Admin" && (
                        < SoftBox mb={3}>
                            <SoftTypography variant="h5" fontWeight="medium" mb={1}>
                                Analytics Overview
                            </SoftTypography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Card sx={{ borderRadius: 2, boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)", height: "100%" }}>
                                        <SoftBox p={3}>
                                            <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                                Monthly Earnings
                                            </SoftTypography>
                                            <Box height={250}>
                                                <Line
                                                    data={
                                                        {
                                                            labels: reportData?.monthlyEarnings?.labels,
                                                            datasets: [
                                                                {
                                                                    label: "Monthly Earnings ($)",
                                                                    data: reportData?.monthlyEarnings?.data,
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
                                                                    data: [reportData?.proposalStatus?.accepted, reportData?.proposalStatus?.waiting],
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
                                                                        reportData?.projectStatus?.suggested,
                                                                        reportData?.projectStatus?.notStarted,
                                                                        reportData?.projectStatus?.ongoing,
                                                                        reportData?.projectStatus?.completed,
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
                            </Grid>
                        </SoftBox>
                    )
                }


                {
                    role !== "Admin" && (
                        <SoftBox>
                            <SoftTypography variant="h5" fontWeight="medium" mb={1}>
                                Featured Reports
                            </SoftTypography>
                            <Grid container spacing={3}>
                                {featuredReports.map((report) => (
                                    <Grid item xs={12} md={6} key={report.title}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                "&:hover": {
                                                    transform: "translateY(-5px)",
                                                    boxShadow: "0 12px 20px 0 rgba(0,0,0,0.15)",
                                                    cursor: "pointer",
                                                },
                                            }}
                                            onClick={() => handleReportCardClick(report.path)}
                                        >
                                            <SoftBox p={3}>
                                                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                    <SoftBox display="flex" alignItems="center">
                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: 2,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                mr: 2,
                                                                bgcolor: `${report.color}.main`,
                                                                color: "white",
                                                            }}
                                                        >
                                                            {report.icon}
                                                        </Box>
                                                        <SoftBox>
                                                            <SoftTypography variant="h6" fontWeight="medium">
                                                                {report.title}
                                                            </SoftTypography>
                                                            <SoftTypography variant="caption" color="text">
                                                                {report.category} • Last updated: {report.lastUpdated}
                                                            </SoftTypography>
                                                        </SoftBox>
                                                    </SoftBox>
                                                    {/* <ArrowForwardIcon color={`${report.color}.main`} /> */}
                                                </SoftBox>
                                                <SoftTypography variant="button" color="text" fontWeight="regular" mb={2}>
                                                    {report.description}
                                                </SoftTypography>
                                            </SoftBox>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </SoftBox>
                    )
                }
            </SoftBox>
            {/* Snackbar for error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </DashboardLayout >
    )
}

export default Reports

