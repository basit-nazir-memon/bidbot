"use client"

import { useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, subMonths, subDays } from "date-fns"

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
import WarningIcon from "@mui/icons-material/Warning"
import ErrorIcon from "@mui/icons-material/Error"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// Charts
import { Pie, Bar, Line } from "react-chartjs-2"
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

// Mock data for Analytics & Logs Report
const userActivityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
        {
            label: "Active Users",
            data: [120, 145, 135, 150, 160, 90, 85],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
        },
    ],
}

const errorDistributionData = {
    labels: ["404 Not Found", "500 Server Error", "403 Forbidden", "401 Unauthorized", "Other"],
    datasets: [
        {
            label: "Error Distribution",
            data: [45, 25, 15, 10, 5],
            backgroundColor: [
                "rgba(255, 206, 86, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(201, 203, 207, 0.6)",
            ],
            borderColor: [
                "rgba(255, 206, 86, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(201, 203, 207, 1)",
            ],
            borderWidth: 1,
        },
    ],
}

const supportTicketsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Tickets Created",
            data: [25, 30, 28, 35, 32, 38, 30, 42, 38, 45, 40, 48],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
            label: "Tickets Resolved",
            data: [22, 28, 25, 32, 30, 35, 28, 38, 35, 42, 38, 45],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
    ],
}

const pagePerformanceData = {
    labels: ["Home", "Dashboard", "Projects", "Reports", "Settings", "Profile", "Help"],
    datasets: [
        {
            label: "Avg. Load Time (ms)",
            data: [320, 450, 380, 520, 290, 310, 280],
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
        },
    ],
}

const systemLogsData = [
    {
        id: 1,
        timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
        level: "ERROR",
        source: "API Server",
        message: "Failed to connect to database - Connection timeout",
        ip: "192.168.1.105",
        user: "system",
    },
    {
        id: 2,
        timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
        level: "WARNING",
        source: "Authentication Service",
        message: "Multiple failed login attempts detected",
        ip: "192.168.1.120",
        user: "john.smith@example.com",
    },
    {
        id: 3,
        timestamp: format(subDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
        level: "INFO",
        source: "User Service",
        message: "New user account created successfully",
        ip: "192.168.1.110",
        user: "admin@example.com",
    },
    {
        id: 4,
        timestamp: format(subDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
        level: "ERROR",
        source: "Payment Gateway",
        message: "Transaction failed - Invalid card information",
        ip: "192.168.1.115",
        user: "sarah.johnson@example.com",
    },
    {
        id: 5,
        timestamp: format(subDays(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
        level: "WARNING",
        source: "File Service",
        message: "Disk space running low (85% used)",
        ip: "192.168.1.105",
        user: "system",
    },
    {
        id: 6,
        timestamp: format(subDays(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
        level: "INFO",
        source: "Email Service",
        message: "Weekly newsletter sent successfully to 1,245 subscribers",
        ip: "192.168.1.105",
        user: "system",
    },
]

const securityEventsData = [
    {
        id: 1,
        timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
        type: "Login Attempt",
        status: "Failed",
        ip: "203.0.113.45",
        location: "Unknown",
        user: "john.smith@example.com",
        details: "Invalid password (3rd attempt)",
    },
    {
        id: 2,
        timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
        type: "Login Attempt",
        status: "Success",
        ip: "192.168.1.120",
        location: "New York, USA",
        user: "john.smith@example.com",
        details: "Successful login after password reset",
    },
    {
        id: 3,
        timestamp: format(subDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
        type: "Permission Change",
        status: "Success",
        ip: "192.168.1.105",
        location: "New York, USA",
        user: "admin@example.com",
        details: "Admin privileges granted to user sarah.johnson@example.com",
    },
    {
        id: 4,
        timestamp: format(subDays(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
        type: "API Access",
        status: "Blocked",
        ip: "198.51.100.78",
        location: "Beijing, China",
        user: "Unknown",
        details: "Suspicious API request pattern detected",
    },
    {
        id: 5,
        timestamp: format(subDays(new Date(), 4), "yyyy-MM-dd HH:mm:ss"),
        type: "File Access",
        status: "Denied",
        ip: "192.168.1.130",
        location: "New York, USA",
        user: "david.wilson@example.com",
        details: "Attempted to access restricted financial documents",
    },
]

function AnalyticsLogsReport() {
    const navigate = useNavigate()
    const { reportType } = useParams()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [activeTab, setActiveTab] = useState("logs")
    const reportRef = useRef(null)
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
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

    const getLevelIcon = (level) => {
        switch (level) {
            case "ERROR":
                return <ErrorIcon fontSize="small" color="error" />
            case "WARNING":
                return <WarningIcon fontSize="small" color="warning" />
            case "INFO":
                return <InfoIcon fontSize="small" color="info" />
            default:
                return <CheckCircleIcon fontSize="small" color="success" />
        }
    }

    const getLevelColor = (level) => {
        switch (level) {
            case "ERROR":
                return "error"
            case "WARNING":
                return "warning"
            case "INFO":
                return "info"
            default:
                return "success"
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Failed":
            case "Blocked":
            case "Denied":
                return "error"
            case "Success":
                return "success"
            default:
                return "info"
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <div className="report-content">
                    <ReportHeader
                        title="Analytics & Logs Report"
                        subtitle="System analytics, support tickets, and security logs"
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
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Active Users
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            160
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="success">
                                            +12% from last week
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Error Rate
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            1.2%
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="success">
                                            -0.3% from last week
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Support Tickets
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            48
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="error">
                                            +8% from last week
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Avg. Page Load
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            350ms
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="success">
                                            -50ms from last week
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </SoftBox>

                    {/* Insights Alert */}
                    <SoftBox mb={3}>
                        <Alert severity="warning" icon={<WarningIcon />} sx={{ borderRadius: 2 }}>
                            <SoftTypography variant="button" fontWeight="medium">
                                Security Alert: Multiple failed login attempts were detected for user john.smith@example.com. The
                                Reports page is experiencing slower load times (520ms) compared to other pages and may need
                                optimization.
                            </SoftTypography>
                        </Alert>
                    </SoftBox>

                    {/* Charts */}
                    <SoftBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            User Activity (Last 7 Days)
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={userActivityData}
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
                                            Error Distribution
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Pie
                                                data={errorDistributionData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
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
                                            Support Tickets
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={supportTicketsData}
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
                                            Page Performance
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={pagePerformanceData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    indexAxis: "y",
                                                    scales: {
                                                        x: {
                                                            beginAtZero: true,
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

                    {/* System Logs */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    System Logs
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="system logs table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Timestamp</TableCell>
                                                <TableCell>Level</TableCell>
                                                <TableCell>Source</TableCell>
                                                <TableCell>Message</TableCell>
                                                <TableCell>IP</TableCell>
                                                <TableCell>User</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {systemLogsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell>{log.timestamp}</TableCell>
                                                    <TableCell>
                                                        <SoftBox display="flex" alignItems="center">
                                                            {getLevelIcon(log.level)}
                                                            <Chip label={log.level} color={getLevelColor(log.level)} size="small" sx={{ ml: 1 }} />
                                                        </SoftBox>
                                                    </TableCell>
                                                    <TableCell>{log.source}</TableCell>
                                                    <TableCell>{log.message}</TableCell>
                                                    <TableCell>{log.ip}</TableCell>
                                                    <TableCell>{log.user}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={systemLogsData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CardContent>
                        </Card>
                    </SoftBox>

                    {/* Security Events */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Security Events
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="security events table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Timestamp</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>IP</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>User</TableCell>
                                                <TableCell>Details</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {securityEventsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => (
                                                <TableRow key={event.id}>
                                                    <TableCell>{event.timestamp}</TableCell>
                                                    <TableCell>{event.type}</TableCell>
                                                    <TableCell>
                                                        <Chip label={event.status} color={getStatusColor(event.status)} size="small" />
                                                    </TableCell>
                                                    <TableCell>{event.ip}</TableCell>
                                                    <TableCell>{event.location}</TableCell>
                                                    <TableCell>{event.user}</TableCell>
                                                    <TableCell>{event.details}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={securityEventsData.length}
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
                                    System Recommendations
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="error" mb={1} display="block">
                                                1. Security Enhancement
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Implement account lockout after 3 failed login attempts and require two-factor authentication
                                                for admin accounts.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="error" mb={1} display="block">
                                                2. Performance Optimization
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                The Reports page has a slow load time (520ms). Consider optimizing database queries and
                                                implementing caching for report data.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="error" mb={1} display="block">
                                                3. Error Handling
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Implement better error handling for 404 errors (45% of all errors) by creating custom error
                                                pages and improving navigation.
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

export default AnalyticsLogsReport

