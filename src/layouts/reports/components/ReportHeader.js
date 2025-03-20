"use client"

import PropTypes from "prop-types"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

// Icons
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import PrintIcon from "@mui/icons-material/Print"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Logo
import logo from "assets/images/logos/logo_color.png"

function ReportHeader({ title, subtitle, dateRange, onBack, onExport, isDownloading }) {
    return (
        <SoftBox mb={3} className="report-header">
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                    <SoftBox display="flex" alignItems="center">
                        <img src={logo || "/placeholder.svg"} alt="Bidbot Logo" style={{ height: 40, marginRight: 16 }} />
                        <SoftBox>
                            <SoftTypography variant="h5" fontWeight="bold">
                                {title}
                            </SoftTypography>
                            {subtitle && (
                                <SoftTypography variant="button" fontWeight="regular" color="text">
                                    {subtitle}
                                </SoftTypography>
                            )}
                        </SoftBox>
                    </SoftBox>
                </Grid>
                <Grid item>
                    <SoftBox display="flex" alignItems="center">
                        <SoftTypography variant="button" fontWeight="medium" color="text" mr={2}>
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long", // "Monday"
                                year: "numeric", // "2024"
                                month: "long",  // "March"
                                day: "numeric", // "14"
                            })}
                        </SoftTypography>

                        {
                            !isDownloading && (
                                <Tooltip title="Export as PDF" className="hide-in-pdf">
                                    <IconButton onClick={onExport} color="dark">
                                        <FileDownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                    </SoftBox>
                </Grid>
            </Grid>
            <Divider sx={{ mt: 2 }} />
        </SoftBox>
    )
}

ReportHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    dateRange: PropTypes.shape({
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    }).isRequired,
    onBack: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
    isDownloading: PropTypes.bool.isRequired,
}

export default ReportHeader

