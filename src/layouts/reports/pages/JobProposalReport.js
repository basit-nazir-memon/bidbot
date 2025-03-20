"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, subMonths } from "date-fns"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Alert from "@mui/material/Alert"
import InfoIcon from "@mui/icons-material/Info"

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
import axios from "axios"
import { CircularProgress, Snackbar } from "@mui/material"
import { envConfig } from "env"
import SoftBadge from "components/SoftBadge"
import PropTypes from "prop-types"
import Table from "examples/Tables/Table"


function JobProposalReport() {
    const navigate = useNavigate()
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
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
                const response = await axios.get(`${envConfig.backend}/reports/proposals`, {
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
        return (reportData?.recentlyAppliedJobs || []).map((job, index) => {
            const row = {
                title: (
                    <SoftTypography variant="caption" fontWeight="medium" sx={{ margin: 2 }}>
                        {job.job.title}
                    </SoftTypography>
                ),
                type: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {job.job.type.toUpperCase()}
                    </SoftTypography>
                ),
                budget: (
                    <SoftTypography variant="caption" fontWeight="medium">
                        {job.bidPrice ? `$${job.bidPrice}` : `$${job.hourlyPrice}/hr`}
                    </SoftTypography>
                ),
                status: <StatusBadge status={job.jobStatus} />,
            };

            // Add action button only if not downloading
            if (!isDownloading) {
                row.action = (
                    <SoftTypography
                        component="a"
                        onClick={() => handleViewJob(job.job._id)}
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
                        title="Proposal Success Rate Report"
                        subtitle="Analysis of your proposal success rates and conversion metrics"
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
                                            Proposals Sent
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalProposalsSent}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Proposals Accepted
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalProposalsAccepted}
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Success Rate
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalProposalsAccepted ? ((reportData?.totalProposalsAccepted / reportData?.totalProposalsSent) * 100).toPrecision(4) : 0}%
                                        </SoftTypography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            Suggested Jobs
                                        </SoftTypography>
                                        <SoftTypography variant="h4" fontWeight="bold">
                                            {reportData?.totalSuggestedJobs}
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
                                Information: You can improve proposal success rate by configuring the jobs selection configuration and proposals configuration according to your niche and client demograhics.
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
                                            Proposals Sent vs Accepted
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Line
                                                data={{
                                                    labels: reportData?.monthlyHistory?.labels,
                                                    datasets: [
                                                        {
                                                            label: "Proposals Sent",
                                                            data: reportData?.monthlyHistory?.sent,
                                                            borderColor: "rgba(75, 192, 192, 1)",
                                                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                                                        },
                                                        {
                                                            label: "Proposals Accepted",
                                                            data: reportData?.monthlyHistory?.accepted,
                                                            borderColor: "rgba(54, 162, 235, 1)",
                                                            backgroundColor: "rgba(54, 162, 235, 0.2)",
                                                        },
                                                    ],
                                                }}
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
                            <Grid item xs={12} lg={4}>
                                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                                    <CardContent>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Proposal Results
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Pie
                                                data={
                                                    {
                                                        labels: ["Not Started", "Ongoing", "Completed"],
                                                        datasets: [
                                                            {
                                                                label: "Proposal Results",
                                                                data: [reportData?.jobStatusStats?.totalNotStartedJobs, reportData?.jobStatusStats?.totalOngoingJobs, reportData?.jobStatusStats?.totalCompletedJobs],
                                                                backgroundColor: [
                                                                    "rgba(255, 206, 86, 0.6)",
                                                                    "rgba(75, 192, 192, 0.6)",
                                                                    "rgba(153, 102, 255, 0.6)",
                                                                ],
                                                                borderColor: [
                                                                    "rgba(255, 206, 86, 1)",
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
                                            Success Rate (%) Over Time
                                        </SoftTypography>
                                        <Box height={300}>
                                            <Bar
                                                data={
                                                    {
                                                        labels: reportData?.monthlyHistory?.labels,
                                                        datasets: [
                                                            {
                                                                label: "Success Rate (%)",
                                                                data: (
                                                                    reportData?.monthlyHistory?.sent ?
                                                                        reportData?.monthlyHistory?.sent.map((sentData, idx) => {
                                                                            return sentData > 0 ? (reportData?.monthlyHistory?.accepted[idx] / sentData) * 100 : 0
                                                                        }) :
                                                                        [0, 0, 0, 0, 0, 0]
                                                                ),
                                                                backgroundColor: "rgba(75, 192, 192, 0.6)",
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
                                                            max: 100,
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

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
                                                    { name: "budget", align: "left" },
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
                        </Grid>
                    </SoftBox>

                    {/* Top Performing Proposals */}
                    {/* <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Top Performing Proposals
                                </SoftTypography>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }} aria-label="top performing proposals table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Job Title</TableCell>
                                                <TableCell>Client</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Accepted</TableCell>
                                                <TableCell>Time to Accept</TableCell>
                                                <TableCell>Connects Used</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topPerformingProposalsData
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((proposal) => (
                                                    <TableRow key={proposal.id}>
                                                        <TableCell>{proposal.title}</TableCell>
                                                        <TableCell>{proposal.client}</TableCell>
                                                        <TableCell>{proposal.amount}</TableCell>
                                                        <TableCell>{proposal.accepted}</TableCell>
                                                        <TableCell>{proposal.timeToAccept}</TableCell>
                                                        <TableCell>{proposal.connectsUsed}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={topPerformingProposalsData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CardContent>
                        </Card>
                    </SoftBox> */}

                    {/* Recommendations */}
                    <SoftBox mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                    Recommendations to Improve Success Rate
                                </SoftTypography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                1. Optimize Proposal Pricing
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                Your most successful proposals are in the $1,500-$3,000 range. Consider adjusting your pricing
                                                strategy to target this sweet spot.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                2. Focus on React Development
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                React development jobs have a 45% success rate for you, compared to 28% overall. Consider
                                                specializing more in this area.
                                            </SoftTypography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                                            <SoftTypography variant="button" fontWeight="bold" color="info" mb={1} display="block">
                                                3. Address Price Objections
                                            </SoftTypography>
                                            <SoftTypography variant="button" fontWeight="regular" color="text">
                                                25% of rejections are due to price. Consider including more value justification in your
                                                proposals to overcome price objections.
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

export default JobProposalReport

