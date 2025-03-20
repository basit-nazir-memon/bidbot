"use client"

// @mui material components
import Card from "@mui/material/Card"
import CircularProgress from "@mui/material/CircularProgress"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import SupportIcon from "@mui/icons-material/Support"
import HistoryIcon from "@mui/icons-material/History"
import DashboardIcon from "@mui/icons-material/Dashboard"
import Paper from "@mui/material/Paper"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"

// React hooks
import { useState, useEffect } from "react"
import PropTypes from "prop-types"

// Axios for API requests
import axios from "axios"
import { envConfig } from "env"

// Custom components for the Help & Support module
import FAQSection from "./components/FAQSection"
import CreateTicketForm from "./components/CreateTicketForm"
import TicketsList from "./components/TicketsList"
import TicketDetails from "./components/TicketDetails"
import SupportDashboard from "./components/SupportDashboard"
import AdminTicketsList from "./components/AdminTicketsList"
import { Alert, Snackbar } from "@mui/material"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`help-support-tabpanel-${index}`}
      aria-labelledby={`help-support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `help-support-tab-${index}`,
    "aria-controls": `help-support-tabpanel-${index}`,
  }
}

function HelpAndSupport() {
  const [tabValue, setTabValue] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [viewTicketDetails, setViewTicketDetails] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Check if user is admin on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("auth-token")
        const response = await axios.get(`${envConfig.backend}/support/isAdmin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setIsAdmin(response.data?.isAdmin)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error checking user role:", error)
      }
    }

    checkUserRole()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    // Reset ticket details view when changing tabs
    setViewTicketDetails(false)
    setSelectedTicket(null)
  }

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setViewTicketDetails(true)
  }

  const handleBackToList = () => {
    setViewTicketDetails(false)
    setSelectedTicket(null)
  }

  const handleTicketStatusChange = async (ticketId, newStatus) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      await axios.put(
        `${envConfig.backend}/support/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Refresh ticket stats
      const statsResponse = await axios.get(`${envConfig.backend}/support/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTicketStats(statsResponse.data)
      setLoading(false)

      // If we're viewing ticket details, update the selected ticket
      if (viewTicketDetails && selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = { ...selectedTicket, status: newStatus }
        setSelectedTicket(updatedTicket)
      }

      return true
    } catch (error) {
      console.error("Error updating ticket status:", error)
      setLoading(false)
      return false
    }
  }

  const handleTicketResponse = async (ticketId, response) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      const result = await axios.post(
        `${envConfig.backend}/tickets/${ticketId}/response`,
        { response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setLoading(false)

      // If we're viewing ticket details, update the selected ticket
      if (viewTicketDetails && selectedTicket && selectedTicket.id === ticketId) {
        const updatedTicket = {
          ...selectedTicket,
          responses: [...(selectedTicket.responses || []), result.data.response],
        }
        setSelectedTicket(updatedTicket)
      }

      setSnackbarMessage(result.data.message)
      setErrorMsg(false);
      setOpenSnackbar(true);

      return true
    } catch (error) {
      console.error("Error adding ticket response:", error)
      setSnackbarMessage(error.response.data.message)
      setErrorMsg(true);
      setOpenSnackbar(true);
      setLoading(false)
      return false
    }
  }

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
      <SoftBox py={3}>
        {/* <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
            mb: 1,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40%",
              height: "100%",
              background:
                "url(https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.2,
            }}
          />
          <SoftBox p={4} px={2} position="relative" zIndex={1}>
            <SoftTypography variant="h3" fontWeight="bold" color="white">
              Help & Support Center
            </SoftTypography>
            <SoftTypography variant="body2" fontWeight="regular" color="white" opacity={0.8}>
              Get assistance, find answers, and manage your support requests
            </SoftTypography>
          </SoftBox>
        </Paper> */}

        {/* User View */}
        {!isAdmin && (
          <SoftBox>
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="help and support tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 48,
                  '& .MuiTab-root': {
                    minHeight: 48,
                    py: 1
                  },
                  '& .Mui-selected': {
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }
                }}
              >
                <Tab
                  label="Dashboard"
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  {...a11yProps(0)}
                />
                <Tab
                  label="FAQs"
                  icon={<HelpOutlineIcon />}
                  iconPosition="start"
                  {...a11yProps(1)}
                />
                <Tab
                  label="My Support Tickets"
                  icon={<SupportIcon />}
                  iconPosition="start"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>

          </SoftBox>
        )}

        {/* Admin View */}
        {isAdmin && (
          <SoftBox>
            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="admin support tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 30,
                  '& .MuiTab-root': {
                    minHeight: 30,
                    py: 1
                  },
                  '& .Mui-selected': {
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }
                }}
              >
                <Tab
                  label="Dashboard"
                  icon={<DashboardIcon />}
                  iconPosition="start"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Active Tickets"
                  icon={<SupportIcon />}
                  iconPosition="start"
                  {...a11yProps(1)}
                />
                <Tab
                  label="Resolved Tickets"
                  icon={<HistoryIcon />}
                  iconPosition="start"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
          </SoftBox>
        )}


        <SoftBox>
          {/* <Card sx={{
          borderRadius: 2,
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
          overflow: 'hidden',
          mt: 1
        }}> */}
          {/* User View */}
          {!isAdmin && (
            <SoftBox>
              {/* Dashboard Tab */}
              <TabPanel value={tabValue} index={0}>
                <SupportDashboard isAdmin={false} handleTabChange={setTabValue} />
              </TabPanel>

              {/* FAQs Tab */}
              <TabPanel value={tabValue} index={1}>
                <FAQSection />
              </TabPanel>

              {/* Support Tickets Tab */}
              <TabPanel value={tabValue} index={2}>
                {viewTicketDetails ? (
                  <TicketDetails
                    ticketInfo={selectedTicket}
                    onBack={handleBackToList}
                    onStatusChange={handleTicketStatusChange}
                    onAddResponse={handleTicketResponse}
                    isAdmin={false}
                    setOpenSnackbar={setOpenSnackbar}
                    setErrorMsg={setErrorMsg}
                    setSnackbarMessage={setSnackbarMessage}
                  />
                ) : (
                  <>
                    <CreateTicketForm onSuccess={() => setTabValue(2)} setOpenSnackbar={setOpenSnackbar} setErrorMsg={setErrorMsg} setSnackbarMessage={setSnackbarMessage} />
                    <SoftBox mt={3}>
                      <TicketsList onViewTicket={handleViewTicket} />
                    </SoftBox>
                  </>
                )}
              </TabPanel>
            </SoftBox>
          )}

          {/* Admin View */}
          {isAdmin && (
            <SoftBox>
              {/* Dashboard Tab */}
              <TabPanel value={tabValue} index={0}>
                <SupportDashboard isAdmin={true} handleTabChange={setTabValue} />
              </TabPanel>

              {/* Active Tickets Tab */}
              <TabPanel value={tabValue} index={1}>
                {viewTicketDetails ? (
                  <TicketDetails
                    ticketInfo={selectedTicket}
                    onBack={handleBackToList}
                    onStatusChange={handleTicketStatusChange}
                    onAddResponse={handleTicketResponse}
                    isAdmin={true}
                    setOpenSnackbar={setOpenSnackbar}
                    setErrorMsg={setErrorMsg}
                    setSnackbarMessage={setSnackbarMessage}
                  />
                ) : (
                  <AdminTicketsList
                    status="active"
                    onViewTicket={handleViewTicket}
                  />
                )}
              </TabPanel>

              {/* Resolved Tickets Tab */}
              <TabPanel value={tabValue} index={2}>
                {viewTicketDetails ? (
                  <TicketDetails
                    ticketInfo={selectedTicket}
                    onBack={handleBackToList}
                    onStatusChange={handleTicketStatusChange}
                    onAddResponse={handleTicketResponse}
                    isAdmin={true}
                    setOpenSnackbar={setOpenSnackbar}
                    setErrorMsg={setErrorMsg}
                    setSnackbarMessage={setSnackbarMessage}
                  />
                ) : (
                  <AdminTicketsList
                    status="resolved"
                    onViewTicket={handleViewTicket}
                  />
                )}
              </TabPanel>
            </SoftBox>
          )}
        </SoftBox>
        {/* </Card> */}
      </SoftBox>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}  // Duration for auto-hide
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMsg ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  )
}

export default HelpAndSupport
