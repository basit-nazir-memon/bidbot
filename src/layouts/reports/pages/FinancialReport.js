"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, subMonths } from "date-fns"

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"

import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Alert from "@mui/material/Alert"
import InfoIcon from "@mui/icons-material/Info"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"

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

// Report components
import ReportHeader from "../components/ReportHeader"
import axios from "axios"
import { CircularProgress, Snackbar } from "@mui/material"
import { envConfig } from "env"
import SoftBadge from "components/SoftBadge"
import PropTypes from "prop-types"
import Table from "examples/Tables/Table"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"


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





function FinancialReport() {
    const navigate = useNavigate()
    const { reportType } = useParams()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const reportRef = useRef(null)
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 12), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
    })
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isDownloading, setIsDownloading] = useState(false);

    const pdfRef = useRef();

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("auth-token");
                const response = await axios.get(`${envConfig.backend}/reports/earnings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setReportData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data");
                setLoading(false);
                setOpenSnackbar(true);
            }
        };

        fetchReportData();
    }, []);

    const handleBack = () => {
        navigate("/reports")
    }
    
    const handleViewJob = (id) => {
        navigate(`/jobs/${id}/details`);
    };

    function StatusBadge({ status }) {
        const color = status.includes("Not Started") ? "warning" : "success";
        return (
            <SoftBadge variant="gradient" badgeContent={status} color={color} size="xs" container />
        );
    }

    StatusBadge.propTypes = {
        status: PropTypes.string.isRequired,
    };


    // Prepare rows data for the table
    const renderRows = () => {
        return (reportData?.topEarningJobs || []).map((job, index) => {
            const row = {
                title: (
                    <SoftTypography variant="caption" fontWeight="medium" sx={{ margin: 2 }}>
                        {job.title}
                    </SoftTypography>
                ),
                type: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {job.type}
                    </SoftTypography>
                ),
                earnings: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {`$${job.earnings}`}
                    </SoftTypography>
                ),
                status: <StatusBadge status={job.jobStatus} />,
            };

            // Add action button only if not downloading
            if (!isDownloading) {
                row.action = (
                    <SoftTypography
                        component="a"
                        onClick={() => handleViewJob(job.id)}
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ cursor: "pointer" }}
                    >
                        View Job
                    </SoftTypography>
                );
            }

            return row;
        });
    };


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
            pdf.save("Job Proposal Report - BidBot.pdf");

            // Restore hidden elements
            elementsToHide.forEach(el => el.style.display = "");

            setIsDownloading(false);
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
                        title="Monthly Earnings Report"
                        subtitle="Track your monthly earnings, trends, and financial performance"
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
                                            Total Annual Earnings
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            ${reportData?.totalAnnualEarnings}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Average Monthly Earnings
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            ${reportData?.averageMonthlyEarnings.toPrecision(4)}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Highest Earning Month
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            ${reportData?.highestEarningMonthAmount}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Active Projects
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            ${reportData?.activeOrderAmount}
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
                                Information: Analyze this given data and update your profile and jobs configuration to secure more orders.
                            </SoftTypography>
                        </Alert>
                    </SoftBox>

                    {/* Charts */}
                    <SoftBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Monthly Earnings Trend
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={
                                                    {
                                                        labels: reportData?.pastSixMonthsEarnings?.labels,
                                                        datasets: [
                                                            {
                                                                label: "Monthly Earnings ($)",
                                                                data: (
                                                                    reportData?.pastSixMonthsEarnings?.fixedEarning
                                                                ),
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
                            <Grid item xs={12} lg={4}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Earnings by Job Type
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Pie
                                                data={
                                                    {
                                                        labels: ["Fixed Price", "Hourly"],
                                                        datasets: [
                                                            {
                                                                label: "Earnings by Job Type",
                                                                data: [reportData?.totalEarningsByJobType?.fixed, reportData?.totalEarningsByJobType?.hourly],
                                                                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)"],
                                                                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
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
                            <Grid item xs={12}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Bi-Annual Fixed Vs Hourly Job Earnings
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={
                                                    {
                                                        labels: reportData?.pastSixMonthsEarnings?.labels,
                                                        datasets: [
                                                            {
                                                                label: "Fixed Price",
                                                                data: reportData?.pastSixMonthsEarnings?.fixedEarning,
                                                                backgroundColor: "rgba(153, 102, 255, 0.6)",
                                                            },
                                                            {
                                                                label: "Hourly",
                                                                data: reportData?.pastSixMonthsEarnings?.hourlyEarning,
                                                                backgroundColor: "rgba(54, 162, 235, 0.6)",
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
                        </Grid>
                    </SoftBox>

                    <SoftBox mb={3}>
                        <Grid item xs={12}>
                            <Card>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                    <SoftTypography variant="h6">Recent Proposals Submitted</SoftTypography>
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
                                                { name: "title", align: "left" },
                                                { name: "type", align: "left" },
                                                { name: "earnings", align: "left" },
                                                { name: "status", align: "center" },
                                                // Conditionally include the action column
                                                ...(isDownloading ? [] : [{ name: "action", align: "center" }]),
                                            ]}
                                            rows={renderRows()}
                                            sx={{ mb: 2 }}
                                        />

                                    )}
                                </SoftBox>
                            </Card>
                        </Grid>
                    </SoftBox>

                    {/* Recommendations */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Financial Recommendations
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="success" mb={1} display="block">
                                                1. Focus on Hourly Contracts
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Your hourly contracts are generating good income. Consider
                                                shifting more of your work to hourly contracts.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="success" mb={1} display="block">
                                                2. Optimize Connects Usage
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Change the Jobs Filters configuration to only target specific target audience to save connects and high leads conversion
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="success" mb={1} display="block">
                                                3. Make Your Rates Justified
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Its a key matrix for every client out there to get their work done at the justified and responable price.
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

export default FinancialReport

