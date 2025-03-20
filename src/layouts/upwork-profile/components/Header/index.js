import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import Dialog from "@mui/material/Dialog"; // Import Dialog components
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Soft UI Dashboard React icons
import Cube from "examples/Icons/Cube";
import Document from "examples/Icons/Document";
import Settings from "examples/Icons/Settings";

// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import curved0 from "assets/images/curved-images/curved0.jpg";
import SoftButton from "components/SoftButton";
import PropTypes from "prop-types";

function Header({ name, role, avatar, onScrapeClick, isScrapping, status, onStartBotClick, onStopBotClick, setStatus }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(isScrapping);

  // State for dialog
  const [openDialog, setOpenDialog] = useState(false);

  
  // State for Bot dialog
  const [openBotDialog, setOpenBotDialog] = useState(false);

  const handleScrapeClick = () => {
    // Open confirmation dialog
    setOpenDialog(true);
  };

  const handleBotClick = () => {
    // Open confirmation dialog
    if (status === "Running"){
      setOpenBotDialog(true);
    } else {
      handleStartBot()
    }
  };

  const handleCloseBotDialog = () => {
    setOpenBotDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmBotClosure = async () => {
    // setLoading(true);
    setOpenBotDialog(false);
    try {
      await onStopBotClick();
    } catch (error) {
      console.error("Error stopping bot:", error);
    }
    // setLoading(false);
  };

  const handleStartBot = async () => {
    setStatus("Starting");
    try {
      await onStartBotClick(); // Call parent function to scrape profile
    } catch (error) {
      console.error("Error starting bot:", error);
      setStatus("Stopped");
    }
    // setLoading(false);
  };

  const handleConfirmScrape = async () => {
    setLoading(true);
    setOpenDialog(false);
    try {
      await onScrapeClick(); // Call parent function to scrape profile
    } catch (error) {
      console.error("Error scraping profile:", error);
    }
    setLoading(false);
  };


  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    // Event listener to handle window resizing
    window.addEventListener("resize", handleTabsOrientation);

    // Set initial tabs orientation
    handleTabsOrientation();

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${curved0})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={avatar}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {name}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {role}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ display: "flex", justifyContent: "flex-end", ml: "auto" }}>
            <SoftButton variant='gradient' color={ status === "Starting" ? 'info' : status === "Stopped" ? "success" : "error"} size='small' onClick={handleBotClick} disabled={loading} sx={{ margin: '5px' }}>
              {status === "Starting" ? <CircularProgress size={24} color="inherit" /> :  status === "Stopped" ? "Start Bot" : "Stop Bot"}
            </SoftButton>
            <SoftButton variant='gradient' color='info' size='small' onClick={handleScrapeClick} disabled={loading || status !== "Running"} sx={{ margin: '5px' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Scrape Profile"}
            </SoftButton>
          </Grid>
        </Grid>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Scraping</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            This is an expensive action and will take approximately 1-3 minutes. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmScrape} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openBotDialog} onClose={handleCloseBotDialog}>
      
        <DialogTitle>Stop Bot</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            Stopping bot will lead to close all the automation task on this upwork profile. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBotDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBotClosure} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </SoftBox>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  onScrapeClick: PropTypes.func.isRequired,
  isScrapping: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  onStartBotClick: PropTypes.func.isRequired,
  onStopBotClick: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default Header;
