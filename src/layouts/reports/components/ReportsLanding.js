"use client"
import PropTypes from "prop-types"

// @mui material components
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"

// Icons
import WorkIcon from "@mui/icons-material/Work"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import ViewKanbanIcon from "@mui/icons-material/ViewKanban"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import DescriptionIcon from "@mui/icons-material/Description"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"

function ReportsLanding({ onCategorySelect }) {
    const reportCategories = [
        {
            title: "Jobs & Proposals",
            description: "Reports about job tracking, applications, and proposals.",
            icon: <WorkIcon sx={{ fontSize: 40 }} />,
            color: "primary",
            value: 1,
        },
        {
            title: "User & Account",
            description: "Reports related to users, accounts, and teams.",
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: "info",
            value: 2,
        },
        {
            title: "Financial",
            description: "Reports related to spending, earnings, and connects usage.",
            icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
            color: "success",
            value: 3,
        },
        {
            title: "Kanban & Projects",
            description: "Reports related to task and job tracking.",
            icon: <ViewKanbanIcon sx={{ fontSize: 40 }} />,
            color: "warning",
            value: 4,
        },
        {
            title: "Analytics & Logs",
            description: "Reports for logging, help desk, and security.",
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            color: "error",
            value: 5,
        },
        {
            title: "Admin Reports",
            description: "Reports for administrators and system overview.",
            icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
            color: "dark",
            value: 6,
        },
    ]

    return (
        <SoftBox>
            <SoftBox mb={3}>
                <SoftTypography variant="h5" fontWeight="medium">
                    Report Categories
                </SoftTypography>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                    Select a category to view detailed reports
                </SoftTypography>
            </SoftBox>

            <Grid container spacing={3}>
                {reportCategories.map((category) => (
                    <Grid item xs={12} md={6} lg={4} key={category.title}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 20px 0 rgba(0,0,0,0.15)",
                                },
                                height: "100%",
                            }}
                        >
                            <CardActionArea onClick={() => onCategorySelect(category.value)} sx={{ height: "100%" }}>
                                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
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
                                    <SoftTypography variant="h6" fontWeight="medium" mb={1}>
                                        {category.title}
                                    </SoftTypography>
                                    <SoftTypography variant="button" color="text" fontWeight="regular">
                                        {category.description}
                                    </SoftTypography>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <SoftButton variant="text" color={category.color} sx={{ alignSelf: "flex-start", mt: 2 }}>
                                        View Reports
                                    </SoftButton>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </SoftBox>
    )
}

ReportsLanding.propTypes = {
    onCategorySelect: PropTypes.func.isRequired,
}

export default ReportsLanding

