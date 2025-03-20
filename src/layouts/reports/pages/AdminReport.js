"use client"

import { useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, subMonths } from "date-fns"

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TablePagination from "@mui/material/TablePagination"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Alert from "@mui/material/Alert"
import InfoIcon from "@mui/icons-material/Info"
import Avatar from "@mui/material/Avatar"
import LinearProgress from "@mui/material/LinearProgress"

// Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import WorkIcon from "@mui/icons-material/Work"
import StorageIcon from "@mui/icons-material/Storage"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// Charts
import { Bar, Line, Doughnut } from "react-chartjs-2"
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

// Report components
import ReportHeader from "../components/ReportHeader"

// Mock data for Admin Report
const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Revenue ($)",
            data: [85000, 92000, 105000, 98000, 112000, 125000, 118000, 132000, 124500, 142000, 138000, 155000],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
        },
        {
            label: "Expenses ($)",
            data: [65000, 68000, 72000, 75000, 80000, 85000, 82000, 88000, 86000, 90000, 88000, 95000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
        },
    ],
}

const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "New Users",
            data: [120, 145, 135, 150, 160, 175, 165, 180, 170, 190, 185, 200],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
            label: "Active Users",
            data: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
    ],
}

const projectStatusData = {
    labels: ["Completed", "In Progress", "Not Started", "Delayed"],
    datasets: [
        {
            label: "Project Status",
            data: [42, 28, 15, 5],
            backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
        },
    ],
}

const resourceUtilizationData = {
    labels: ["CPU", "Memory", "Storage", "Network", "Database"],
    datasets: [
        {
            label: "Resource Utilization (%)",
            data: [65, 75, 82, 60, 78],
            backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
            ],
            borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
        },
    ],
}

const topPerformingUsersData = [
    {
        id: 1,
        name: "John Smith",
        avatar: "https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff",
        role: "Senior Developer",
        revenue: "$45,000",
        projects: 28,
        rating: 4.9,
        conversion: "32%",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4CAF50&color=fff",
        role: "UI/UX Designer",
        revenue: "$38,500",
        projects: 22,
        rating: 4.8,
        conversion: "29%",
    },
    {
        id: 3,
        name: "Michael Brown",
        avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=F44336&color=fff",
        role: "Backend Developer",
        revenue: "$36,200",
        projects: 19,
        rating: 4.7,
        conversion: "27%",
    },
    {
        id: 4,
        name: "Emily Davis",
        avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=FFC107&color=fff",
        role: "Project Manager",
        revenue: "$42,800",
        projects: 15,
        rating: 4.9,
        conversion: "35%",
    },
    {
        id: 5,
        name: "David Wilson",
        avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=9C27B0&color=fff",
        role: "QA Engineer",
        revenue: "$32,500",
        projects: 17,
        rating: 4.6,
        conversion: "25%",
    },
]

const systemHealthData = [
    {
        id: 1,
        service: "API Server",
        status: "Healthy",
        uptime: "99.98%",
        responseTime: "120ms",
        lastIncident: "None",
        load: "65%",
    },
    {
        id: 2,
        service: "Database",
        status: "Healthy",
        uptime: "99.95%",
        responseTime: "85ms",
        lastIncident: "2023-10-15",
        load: "78%",
    },
    {
        id: 3,
        service: "Authentication Service",
        status: "Healthy",
        uptime: "99.99%",
        responseTime: "95ms",
        lastIncident: "None",
        load: "45%",
    },
    {
        id: 4,
        service: "File Storage",
        status: "Warning",
        uptime: "99.90%",
        responseTime: "150ms",
        lastIncident: "2023-11-02",
        load: "82%",
    },
    {
        id: 5,
        service: "Email Service",
        status: "Healthy",
        uptime: "99.97%",
        responseTime: "110ms",
        lastIncident: "2023-09-20",
        load: "40%",
    },
]

function AdminReport() {
    const navigate = useNavigate()
    const { reportType } = useParams()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const reportRef = useRef(null)
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 12), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleBack = () => {
        navigate("/reports")
    }

    const handleExport = () => {
        // Logic to export the report as PDF
        console.log("Exporting report as PDF...")
    }

    const handlePrint = () => {
        // Create a printable version that only includes the report content
        const printContent = document.querySelector(".report-content").innerHTML
        const originalContent = document.body.innerHTML

        document.body.innerHTML = `
      <div style="padding: 20px;">
        ${document.querySelector(".report-header").innerHTML}
        ${printContent}
      </div>
    `

        window.print()
        document.body.innerHTML = originalContent
        window.location.reload()
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Healthy":
                return "success"
            case "Warning":
                return "warning"
            case "Critical":
                return "error"
            default:
                return 'info"nfo'
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <div className="report-content">
                    <ReportHeader
                        title="Admin Dashboard Report"
                        subtitle="System-wide metrics and administrative overview"
                        dateRange={dateRange}
                        onBack={handleBack}
                        onExport={handleExport}
                        onPrint={handlePrint}
                    />

                    {/* Key Metrics */}
                    <SoftBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftBox display="flex" alignItems="center" mb={1}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mr: 2,
                                                    bgcolor: "success.main",
                                                    color: "white",
                                                }}
                                            >
                                                <AttachMoneyIcon />
                                            </Box>
                                            <SoftTypography variant="button" color="text" fontWeight="medium">
                                                Total Revenue
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            $1.35M
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +15% from last year
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftBox display="flex" alignItems="center" mb={1}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mr: 2,
                                                    bgcolor: "info.main",
                                                    color: "white",
                                                }}
                                            >
                                                <PeopleIcon />
                                            </Box>
                                            <SoftTypography variant="button" color="text" fontWeight="medium">
                                                Total Users
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            1,350
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +22% from last year
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftBox display="flex" alignItems="center" mb={1}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mr: 2,
                                                    bgcolor: "warning.main",
                                                    color: "white",
                                                }}
                                            >
                                                <WorkIcon />
                                            </Box>
                                            <SoftTypography variant="button" color="text" fontWeight="medium">
                                                Total Projects
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            90
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +12% from last year
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftBox display="flex" alignItems="center" mb={1}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mr: 2,
                                                    bgcolor: "error.main",
                                                    color: "white",
                                                }}
                                            >
                                                <StorageIcon />
                                            </Box>
                                            <SoftTypography variant="button" color="text" fontWeight="medium">
                                                System Health
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            98.2%
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +0.5% from last month
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </SoftBox>

                    {/* Insights Alert */}
                    <SoftBox mb={3}>
                        <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
                            <SoftTypography variant="button" fontWeight="medium">
                                Executive Summary: Revenue has increased by 15% year-over-year, with a 22% growth in user base. File
                                Storage service is showing warning signs with 82% utilization and should be monitored closely.
                            </SoftTypography>
                        </Alert>
                    </SoftBox>

                    {/* Charts */}
                    <SoftBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Revenue vs Expenses
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={revenueData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: false,
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            User Growth
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={userGrowthData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Project Status Overview
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Doughnut
                                                data={projectStatusData}
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
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Resource Utilization
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={resourceUtilizationData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    indexAxis: "y",
                                                    scales: {
                                                        x: {
                                                            beginAtZero: true,
                                                            max: 100,
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </SoftBox>

                    {/* Top Performing Users */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Top Performing Users
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="top performing users table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Revenue Generated</TableCell>
                                                <TableCell>Projects Completed</TableCell>
                                                <TableCell>Client Rating</TableCell>
                                                <TableCell>Conversion Rate</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topPerformingUsersData
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <SoftBox display="flex" alignItems="center">
                                                                <Avatar src={user.avatar} alt={user.name} sx={{ mr: 2 }} />
                                                                <SoftTypography variant="button" fontWeight="medium">
                                                                    {user.name}
                                                                </SoftTypography>
                                                            </SoftBox>
                                                        </TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>{user.revenue}</TableCell>
                                                        <TableCell>{user.projects}</TableCell>
                                                        <TableCell>{user.rating}/5.0</TableCell>
                                                        <TableCell>{user.conversion}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={topPerformingUsersData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CardContent>
                        </Card>
                    </SoftBox>

                    {/* System Health */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    System Health
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="system health table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Service</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Uptime</TableCell>
                                                <TableCell>Response Time</TableCell>
                                                <TableCell>Last Incident</TableCell>
                                                <TableCell>Load</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {systemHealthData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((service) => (
                                                <TableRow key={service.id}>
                                                    <TableCell>{service.service}</TableCell>
                                                    <TableCell>
                                                        <Chip label={service.status} color={getStatusColor(service.status)} size="small" />
                                                    </TableCell>
                                                    <TableCell>{service.uptime}</TableCell>
                                                    <TableCell>{service.responseTime}</TableCell>
                                                    <TableCell>{service.lastIncident === "None" ? "None" : service.lastIncident}</TableCell>
                                                    <TableCell>
                                                        <SoftBox sx={{ width: "100%", mr: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Number.parseInt(service.load)}
                                                                color={
                                                                    Number.parseInt(service.load) < 70
                                                                        ? "success"
                                                                        : Number.parseInt(service.load) < 85
                                                                            ? "warning"
                                                                            : "error"
                                                                }
                                                                sx={{ height: 8, borderRadius: 5 }}
                                                            />
                                                        </SoftBox>
                                                        <SoftTypography variant="caption" color="text">
                                                            {service.load}
                                                        </SoftTypography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={systemHealthData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CardContent>
                        </Card>
                    </SoftBox>

                    {/* Recommendations */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Administrative Recommendations
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="primary" mb={1} display="block">
                                                1. Resource Allocation
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                File Storage is at 82% capacity. Consider upgrading storage capacity or implementing data
                                                archiving policies to prevent service degradation.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="primary" mb={1} display="block">
                                                2. Team Optimization
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Emily Davis has the highest conversion rate (35%). Consider having her conduct training sessions
                                                for other team members to share best practices.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="primary" mb={1} display="block">
                                                3. Financial Planning
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Revenue growth is outpacing expenses by 7%. Consider reinvesting in infrastructure and talent
                                                acquisition to support continued growth.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </SoftBox>
                </div>
            </SoftBox>
        </DashboardLayout>
    )
}

export default AdminReport

