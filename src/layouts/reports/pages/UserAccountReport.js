"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, subMonths } from "date-fns"

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"

import Paper from "@mui/material/Paper"
import Alert from "@mui/material/Alert"
import InfoIcon from "@mui/icons-material/Info"
import Avatar from "@mui/material/Avatar"
import Rating from "@mui/material/Rating"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// Charts
import { Pie, Line, Radar } from "react-chartjs-2"
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
    RadialLinearScale,
} from "chart.js"

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    ChartTooltip,
    Legend,
)

// Report components
import ReportHeader from "../components/ReportHeader"
import { CircularProgress, Snackbar } from "@mui/material"
import axios from "axios"
import { envConfig } from "env"
import SoftBadge from "components/SoftBadge"
import PropTypes from "prop-types"
import Table from "examples/Tables/Table"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Mock data for Team Performance Report
const teamPerformanceData = [
    {
        id: 1,
        name: "John Smith",
        role: "Senior Developer",
        avatar: "https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff",
        completedJobs: 28,
        activeJobs: 3,
        rating: 4.9,
        earnings: "$45,000",
        onTimeRate: "98%",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "UI/UX Designer",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=4CAF50&color=fff",
        completedJobs: 22,
        activeJobs: 2,
        rating: 4.8,
        earnings: "$38,500",
        onTimeRate: "95%",
    },
    {
        id: 3,
        name: "Michael Brown",
        role: "Backend Developer",
        avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=F44336&color=fff",
        completedJobs: 19,
        activeJobs: 4,
        rating: 4.7,
        earnings: "$36,200",
        onTimeRate: "92%",
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Project Manager",
        avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=FFC107&color=fff",
        completedJobs: 15,
        activeJobs: 5,
        rating: 4.9,
        earnings: "$42,800",
        onTimeRate: "97%",
    },
    {
        id: 5,
        name: "David Wilson",
        role: "QA Engineer",
        avatar: "https://ui-avatars.com/api/?name=David+Wilson&background=9C27B0&color=fff",
        completedJobs: 17,
        activeJobs: 2,
        rating: 4.6,
        earnings: "$32,500",
        onTimeRate: "94%",
    },
]

const teamSkillsData = {
    labels: ["React", "Node.js", "UI/UX", "Project Management", "QA", "DevOps"],
    datasets: [
        {
            label: "Team Skills",
            data: [85, 75, 80, 70, 65, 60],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
        },
    ],
}

function UserAccountReport() {
    const navigate = useNavigate()
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 6), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
    })

    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isDownloading, setIsDownloading] = useState(false);

    const pdfRef = useRef();

    const handleBack = () => {
        navigate("/reports")
    }

    const handleExport = () => {
        setIsDownloading(true);

        // Hide elements before capturing
        const elementsToHide = document.querySelectorAll(".hide-in-pdf");
        elementsToHide.forEach(el => el.style.display = "none");

        const input = pdfRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const margin = 10; // Set margin in mm
            const imgWidth = 210 - 2 * margin; // A4 width - left/right margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
            pdf.save("Team Performance Report - BidBot.pdf");

            // Restore hidden elements
            elementsToHide.forEach(el => el.style.display = "");

            setIsDownloading(false);
        });
    };


    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("auth-token");
                const response = await axios.get(`${envConfig.backend}/reports/team`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setReportData(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err)
                setError(err.response?.data?.message || "Failed to fetch data");
                setLoading(false);
                setOpenSnackbar(true);
            }
        };

        fetchReportData();
    }, []);

    // Prepare rows data for the table
    const renderRows = () => {
        return (reportData?.teamMembers || []).map((member, index) => {
            const row = {
                member: (
                    <SoftBox display="flex" alignItems="center">
                        <Avatar src={member.avatar} alt={member.name} sx={{ mr: 2, ml: 2 }} />
                        <SoftBox>
                            <SoftTypography variant="button" fontWeight="medium">
                                {member.name}
                            </SoftTypography>
                            <SoftTypography variant="caption" color="text" display="block">
                                {member.companyRole}
                            </SoftTypography>
                        </SoftBox>
                    </SoftBox>
                ),
                email: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {member.email}
                    </SoftTypography>
                ),
                gender: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {member.gender.toUpperCase()}
                    </SoftTypography>
                ),
            };

            return row;
        });
    };


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
            <SoftBox py={3} ref={pdfRef}>
                <div className="report-content">
                    <ReportHeader
                        title="Team Performance Report"
                        subtitle="Evaluate team member performance and productivity metrics"
                        dateRange={dateRange}
                        onBack={handleBack}
                        onExport={handleExport}
                        isDownloading={isDownloading}
                    />

                    {/* Key Metrics */}
                    <SoftBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Team Members
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalTeamMembers}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Ongoing Jobs
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalOngoingJobs}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Completed Jobs
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalCompletedJobs}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Job Win Ratio
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {(((reportData?.totalOngoingJobs + reportData?.totalCompletedJobs) / reportData?.totalAppliedJobs) * 100).toPrecision(4)}%
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </SoftBox>

                    {/* Insights Alert */}
                    <SoftBox mb={3}>
                        <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
                            <SoftTypography variant="button" fontWeight="medium">
                                Information: When projects inflow is increased, consider adding more team members and assigning them to projects tasks using our Kanban Module.
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
                                            Team Productivity Trend
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={
                                                    {
                                                        labels: reportData?.jobsCompletedGraph?.labels,
                                                        datasets: [
                                                            {
                                                                label: "Completed Jobs",
                                                                data: reportData?.jobsCompletedGraph?.data,
                                                                borderColor: "rgba(75, 192, 192, 1)",
                                                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                                            },
                                                        ],
                                                    }
                                                }
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
                                            Team Projects Stats
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Pie
                                                data={
                                                    {
                                                        labels: ["Suggested", "Not Started", "Ongoing", "Completed"],
                                                        datasets: [
                                                            {
                                                                label: "Client Ratings",
                                                                data: [
                                                                    reportData?.totalSuggestedJobs,
                                                                    reportData?.totalNotStartedJobs,
                                                                    reportData?.totalOngoingJobs,
                                                                    reportData?.totalCompletedJobs,
                                                                ],
                                                                backgroundColor: [
                                                                    "rgba(75, 192, 192, 0.6)",
                                                                    "rgba(54, 162, 235, 0.6)",
                                                                    "rgba(255, 206, 86, 0.6)",
                                                                    "rgba(255, 159, 64, 0.6)",
                                                                ],
                                                                borderColor: [
                                                                    "rgba(75, 192, 192, 1)",
                                                                    "rgba(54, 162, 235, 1)",
                                                                    "rgba(255, 206, 86, 1)",
                                                                    "rgba(255, 159, 64, 1)",
                                                                ],
                                                                borderWidth: 1,
                                                            },
                                                        ],
                                                    }
                                                }
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </SoftBox>

                    <Grid item xs={12} sx={{mb:3,}} >
                        <Card>
                            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                <SoftTypography variant="h6">Team Members Performance</SoftTypography>
                            </SoftBox>
                            <SoftBox
                                sx={{
                                    "& .MuiTableRow-root:not(:last-child)": {
                                        "& td": {
                                            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                                `${borderWidth[1]} solid ${borderColor}`,
                                        },
                                    },
                                }}
                            >
                                {loading ? (
                                    <SoftBox
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="200px"
                                    >
                                        <CircularProgress color="success" />
                                    </SoftBox>
                                ) : (
                                    <Table
                                        columns={[
                                            { name: "member", align: "left" },
                                            { name: "email", align: "left" },
                                            { name: "gender", align: "center" },
                                        ]}
                                        rows={renderRows()}
                                        sx={{ mb: 2 }}
                                    />

                                )}
                            </SoftBox>
                        </Card>
                    </Grid>


                    {/* Recommendations */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Team Improvement Recommendations
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                1. Skill Development
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Invest in DevOps training for the team as this is currently the lowest-rated skill area (60%).
                                                This will improve deployment efficiency.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                2. Mentorship Program
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Implement a mentorship program where top performers can share best practices
                                                with other team members.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                3. Workload Balancing
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Consider distributing some tasks to prevent burnout over a team member.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </SoftBox>
                </div>
            </SoftBox>
            {/* Snackbar for error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </DashboardLayout>
    )
}

export default UserAccountReport

