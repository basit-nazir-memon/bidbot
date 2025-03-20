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
import LinearProgress from "@mui/material/LinearProgress"

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import ErrorIcon from "@mui/icons-material/Error"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// Charts
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2"
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

// Mock data for Project Completion Report
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

const taskCompletionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Tasks Completed",
            data: [45, 52, 48, 60, 55, 65, 58, 70, 62, 75, 68, 80],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
            label: "Tasks Created",
            data: [50, 55, 52, 65, 60, 70, 62, 75, 68, 80, 72, 85],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
    ],
}

const timelineAdherenceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Timeline Adherence (%)",
            data: [88, 92, 90, 94, 91, 95, 93, 96, 94, 97, 95, 98],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
        },
    ],
}

const taskDistributionData = {
    labels: ["Development", "Design", "Testing", "Documentation", "Meetings", "Other"],
    datasets: [
        {
            label: "Task Distribution",
            data: [40, 20, 15, 10, 10, 5],
            backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(201, 203, 207, 0.6)",
            ],
            borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(201, 203, 207, 1)",
            ],
            borderWidth: 1,
        },
    ],
}

const projectsData = [
    {
        id: 1,
        name: "E-commerce Platform Redesign",
        client: "TechSolutions Inc.",
        startDate: "2023-06-15",
        endDate: "2023-09-30",
        status: "Completed",
        progress: 100,
        tasksCompleted: 45,
        totalTasks: 45,
        onTime: "Yes",
    },
    {
        id: 2,
        name: "Mobile App Development",
        client: "App Innovators",
        startDate: "2023-07-01",
        endDate: "2023-12-15",
        status: "In Progress",
        progress: 75,
        tasksCompleted: 30,
        totalTasks: 40,
        onTime: "Yes",
    },
    {
        id: 3,
        name: "CRM Integration",
        client: "Sales Solutions",
        startDate: "2023-08-10",
        endDate: "2023-11-30",
        status: "In Progress",
        progress: 60,
        tasksCompleted: 18,
        totalTasks: 30,
        onTime: "No",
    },
    {
        id: 4,
        name: "Website Optimization",
        client: "Marketing Experts",
        startDate: "2023-09-01",
        endDate: "2023-10-15",
        status: "Completed",
        progress: 100,
        tasksCompleted: 25,
        totalTasks: 25,
        onTime: "Yes",
    },
    {
        id: 5,
        name: "Payment Gateway Integration",
        client: "Finance Tech",
        startDate: "2023-10-01",
        endDate: "2023-12-01",
        status: "In Progress",
        progress: 40,
        tasksCompleted: 10,
        totalTasks: 25,
        onTime: "Yes",
    },
    {
        id: 6,
        name: "Data Migration Project",
        client: "Data Systems Inc.",
        startDate: "2023-09-15",
        endDate: "2023-11-15",
        status: "Delayed",
        progress: 30,
        tasksCompleted: 9,
        totalTasks: 30,
        onTime: "No",
    },
]

function KanbanProjectsReport() {
    const navigate = useNavigate()
    const { reportType } = useParams()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const reportRef = useRef(null)
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 6), "yyyy-MM-dd"),
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
            case "Completed":
                return "success"
            case "In Progress":
                return "info"
            case "Not Started":
                return "secondary"
            case "Delayed":
                return "error"
            default:
                return "dark"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircleIcon fontSize="small" color="success" />
            case "In Progress":
                return <AccessTimeIcon fontSize="small" color="info" />
            case "Delayed":
                return <ErrorIcon fontSize="small" color="error" />
            default:
                return null
        }
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <div className="report-content">
                    <ReportHeader
                        title="Project Completion Report"
                        subtitle="Track project completion rates and timeline adherence"
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
                                            Total Projects
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            90
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +12% from last period
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Completion Rate
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            92%
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +4% from last period
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            On-Time Delivery
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            88%
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +3% from last period
                                            </SoftTypography>
                                        </SoftBox>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Avg. Task Completion
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            738
                                        </SoftTypography>
                                        <SoftBox display="flex" alignItems="center">
                                            <TrendingUpIcon color="success" fontSize="small" />
                                            <SoftTypography variant="caption" color="success" fontWeight="medium">
                                                +15% from last period
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
                                Insight: Development tasks are taking up 40% of your project time. The CRM Integration project is
                                currently behind schedule and may need additional resources to meet the deadline.
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
                                            Task Distribution by Type
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Pie
                                                data={taskDistributionData}
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
                                            Task Completion vs Creation
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={taskCompletionData}
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
                                            Timeline Adherence Trend
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={timelineAdherenceData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: false,
                                                            min: 80,
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

                    {/* Projects Table */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Project Status Details
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="project status table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Project Name</TableCell>
                                                <TableCell>Client</TableCell>
                                                <TableCell>Timeline</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Progress</TableCell>
                                                <TableCell>Tasks</TableCell>
                                                <TableCell>On Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {projectsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                                                <TableRow key={project.id}>
                                                    <TableCell>{project.name}</TableCell>
                                                    <TableCell>{project.client}</TableCell>
                                                    <TableCell>
                                                        {project.startDate} to {project.endDate}
                                                    </TableCell>
                                                    <TableCell>
                                                        <SoftBox display="flex" alignItems="center">
                                                            {getStatusIcon(project.status)}
                                                            <Chip
                                                                label={project.status}
                                                                color={getStatusColor(project.status)}
                                                                size="small"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        </SoftBox>
                                                    </TableCell>
                                                    <TableCell>
                                                        <SoftBox sx={{ width: "100%", mr: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={project.progress}
                                                                color={
                                                                    project.progress === 100
                                                                        ? "success"
                                                                        : project.progress >= 60
                                                                            ? "info"
                                                                            : project.progress >= 30
                                                                                ? "warning"
                                                                                : "error"
                                                                }
                                                                sx={{ height: 8, borderRadius: 5 }}
                                                            />
                                                        </SoftBox>
                                                        <SoftTypography variant="caption" color="text">
                                                            {project.progress}%
                                                        </SoftTypography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {project.tasksCompleted}/{project.totalTasks}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={project.onTime}
                                                            color={project.onTime === "Yes" ? "success" : "error"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={projectsData.length}
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
                                    Project Management Recommendations
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="warning" mb={1} display="block">
                                                1. Address Delayed Projects
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                The Data Migration Project is currently delayed. Consider allocating additional resources or
                                                adjusting the scope to bring it back on track.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="warning" mb={1} display="block">
                                                2. Optimize Development Tasks
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Development tasks are taking 40% of project time. Consider implementing more efficient coding
                                                practices or utilizing more reusable components.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="warning" mb={1} display="block">
                                                3. Improve Timeline Estimation
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                12% of projects are not delivered on time. Consider adding buffer time to project estimates or
                                                breaking down tasks into smaller, more manageable units.
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

export default KanbanProjectsReport

