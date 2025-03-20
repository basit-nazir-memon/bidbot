"use client"

import PropTypes from "prop-types"

// @mui material components
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"

function ReportCard({ title, description, icon, color, onClick }) {
    return (
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
            onClick={onClick}
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
                        bgcolor: `${color}.main`,
                        color: "white",
                    }}
                >
                    {icon}
                </Box>
                <SoftTypography variant="h6" fontWeight="medium" mb={1}>
                    {title}
                </SoftTypography>
                <SoftTypography variant="button" color="text" fontWeight="regular">
                    {description}
                </SoftTypography>
                <Box sx={{ flexGrow: 1 }} />
                <SoftButton variant="text" color={color} endIcon={<ArrowForwardIcon />} sx={{ alignSelf: "flex-start", mt: 2 }}>
                    View Report
                </SoftButton>
            </SoftBox>
        </Card>
    )
}

ReportCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default ReportCard

