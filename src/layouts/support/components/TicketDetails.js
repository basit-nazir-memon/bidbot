"use client"

// @mui material components
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import Divider from "@mui/material/Divider"
import CircularProgress from "@mui/material/CircularProgress"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import SendIcon from "@mui/icons-material/Send"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftInput from "components/SoftInput"
import SoftButton from "components/SoftButton"

// React hooks
import { useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { envConfig } from "env"

function TicketDetails({ ticketInfo, onBack, onStatusChange, onAddResponse, isAdmin, setOpenSnackbar, setErrorMsg, setSnackbarMessage }) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [responseError, setResponseError] = useState("")
  const [ticket, setTicket] = useState(ticketInfo)

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "info"
      case "resolved":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "info"
      case "medium":
        return "warning"
      case "high":
        return "error"
      case "urgent":
        return "error"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      const result = await axios.put(
        `${envConfig.backend}/tickets/${ticket._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setLoading(false)
      const updatedTicket = { ...ticket, status: newStatus }
      setTicket(updatedTicket)

      setSnackbarMessage(result?.data.message)
      setErrorMsg(false);
      setOpenSnackbar(true);
      setLoading(false)

    } catch (error) {
      console.error("Error updating ticket status:", error)
      setLoading(false)
      setSnackbarMessage(error?.response.data.message)
      setErrorMsg(true);
      setOpenSnackbar(true);
    }
  }

  const handleResponseSubmit = async (e) => {
    e.preventDefault()

    if (!response.trim()) {
      setResponseError("Response cannot be empty")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth-token")
      const result = await axios.post(
        `${envConfig.backend}/tickets/${ticket._id}/response`,
        { response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setLoading(false)

      const updatedTicket = {
          ...ticket,
          responses: [...(ticket.responses || []), result?.data.response],
      }
      
      setTicket(updatedTicket)

      setSnackbarMessage(result?.data.message)
      setErrorMsg(false);
      setOpenSnackbar(true);
      setLoading(false)

      setResponse("")
      setResponseError("")
    } catch (error) {
      console.error("Error adding ticket response:", error)
      setSnackbarMessage(error.response.data.message)
      setErrorMsg(true);
      setOpenSnackbar(true);
      setLoading(false)
    }
  }

  return (
    <SoftBox>
      <SoftButton variant="text" color="dark" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back to Tickets
      </SoftButton>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
                color: "white",
              }}
            >
              <SoftTypography variant="h5" fontWeight="bold" color="white">
                {ticket.subject}
              </SoftTypography>
              <SoftBox display="flex" alignItems="center" mt={1}>
                <Chip
                  label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  color={getStatusColor(ticket.status)}
                  size="small"
                  sx={{ mr: 1, color: "white", fontWeight: "bold" }}
                />
                <Chip
                  label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  color={getPriorityColor(ticket.priority)}
                  size="small"
                  sx={{ color: "white", fontWeight: "bold" }}
                />
                <SoftTypography variant="caption" color="white" sx={{ ml: 2, opacity: 0.8 }}>
                  Created: {formatDate(ticket.createdAt)}
                </SoftTypography>
              </SoftBox>
            </Box>

            <SoftBox p={2}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  {ticket.description}
                </SoftTypography>
              </Paper>

              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Conversation History
              </SoftTypography>

              <Timeline position="alternate" sx={{ mb: 3 }}>
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary" fontSize={"small"} sx={{ m: "auto 0" }}>
                    {formatDate(ticket.createdAt)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="info" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
                      <SoftBox display="flex" alignItems="center" mb={1}>
                        <Avatar
                          src={ticket.user.avatar}
                          sx={{ width: 22, height: 22, mr: 1 }}
                        />
                        <SoftTypography variant="button" fontWeight="bold">
                          Ticket Created
                        </SoftTypography>
                      </SoftBox>
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        {ticket.description}
                      </SoftTypography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                {ticket.responses &&
                  ticket.responses.map((resp, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary" sx={{ m: "auto 0", fontSize: "small" }}>
                        {formatDate(resp.createdAt)}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={resp.isAdmin ? "success" : "info"} />
                        {index < ticket.responses.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: resp.isAdmin ? "#c8e6c9" : "#b3e5fc",
                            color: resp.isAdmin ? "success.contrastText" : "info.contrastText",
                            borderRadius: 2,
                          }}
                        >
                          <SoftBox display="flex" alignItems="center" mb={1}>
                            <Avatar
                              src={resp.isAdmin ? "Support" : ticket.user.owner.avatar}
                              sx={{ width: 22, height: 22, mr: 1 }}
                            />
                            <SoftTypography variant="button" fontWeight="bold" color="inherit">
                              {resp.isAdmin ? "Support Team" : ticket.user?.owner?.name || "You"}
                            </SoftTypography>
                          </SoftBox>
                          <SoftTypography variant="button" fontWeight="regular" color="inherit">
                            {resp.message}
                          </SoftTypography>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}

                {ticket.status === "resolved" && (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="success" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper
                        elevation={0}
                        sx={{ p: 2, bgcolor: "success.light", color: "success.contrastText", borderRadius: 2 }}
                      >
                        <SoftBox display="flex" alignItems="center">
                          <CheckCircleIcon sx={{ mr: 1 }} />
                          <SoftTypography variant="button" fontWeight="bold" color="inherit">
                            Ticket Resolved
                          </SoftTypography>
                        </SoftBox>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )}

                {ticket.status === "cancelled" && (
                  <TimelineItem>
                    {/* <TimelineOppositeContent color="text.light" sx={{ m: "auto 0", fontSize: "small" }}>
                      {formatDate(ticket.updatedAt)}
                    </TimelineOppositeContent> */}
                    <TimelineSeparator>
                      <TimelineDot color="error" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper
                        elevation={0}
                        sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText", borderRadius: 2 }}
                      >
                        <SoftBox display="flex" alignItems="center">
                          <CancelIcon sx={{ mr: 1 }} />
                          <SoftTypography variant="button" fontWeight="bold" color="inherit">
                            Ticket Cancelled
                          </SoftTypography>
                        </SoftBox>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>

              {ticket.status === "active" && (
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
                    bgcolor: "background.default",
                  }}
                >
                  <SoftBox p={2}>
                    <form onSubmit={handleResponseSubmit}>
                      <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                        Add Response
                      </SoftTypography>
                      <SoftBox mb={2}>
                        <SoftInput
                          placeholder="Type your response here..."
                          value={response}
                          onChange={(e) => {
                            setResponse(e.target.value)
                            if (responseError) setResponseError("")
                          }}
                          error={!!responseError}
                          multiline
                          rows={4}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                        />
                        {responseError && (
                          <SoftTypography variant="caption" color="error" fontWeight="regular">
                            {responseError}
                          </SoftTypography>
                        )}
                      </SoftBox>
                      <SoftBox display="flex" justifyContent="flex-end">
                        <SoftButton
                          type="submit"
                          variant="gradient"
                          size="small"
                          color="info"
                          disabled={loading}
                          endIcon={<SendIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
                        </SoftButton>
                      </SoftBox>
                    </form>
                  </SoftBox>
                </Card>
              )}
            </SoftBox>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
              position: "sticky",
              top: 24,
            }}
          >
            <SoftBox p={3}>
              <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                Ticket Information
              </SoftTypography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                      ID
                    </SoftTypography>
                    <SoftTypography variant="button" fontWeight="regular" color="text" display="block">
                      {ticket._id}
                    </SoftTypography>
                  </SoftBox>
                </Grid>

                <Grid item xs={6}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                      Type
                    </SoftTypography>
                    <SoftTypography variant="button" fontWeight="regular" color="text" display="block">
                      {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                    </SoftTypography>
                  </SoftBox>
                </Grid>

                <Grid item xs={6}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                      Created
                    </SoftTypography>
                    <SoftTypography variant="button" fontWeight="regular" color="text" display="block">
                      {formatDate(ticket.createdAt)}
                    </SoftTypography>
                  </SoftBox>
                </Grid>

                <Grid item xs={6}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                      Response Status
                    </SoftTypography>
                    <SoftTypography variant="button" fontWeight="regular" color="text" display="block">
                      {ticket.responses && ticket.responses.length > 0 && ticket.responses.find(res => res.isAdmin === true) ? "Responded" : "Pending"}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <SoftBox mb={2}>
                <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Status
                </SoftTypography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    color={getStatusColor(ticket.status)}
                    sx={{ fontWeight: "bold", width: "100%", height: 36 }}
                  />
                </Box>
              </SoftBox>

              <SoftBox mb={2}>
                <SoftTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
                  Priority
                </SoftTypography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    color={getPriorityColor(ticket.priority)}
                    sx={{ fontWeight: "bold", width: "100%", height: 36 }}
                  />
                </Box>
              </SoftBox>

              {ticket.status === "active" && (
                <SoftBox mt={4}>
                  <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                    Actions
                  </SoftTypography>

                  <Grid container spacing={2}>
                    {isAdmin && (
                      <Grid item xs={12}>
                        <SoftButton
                          variant="gradient"
                          color="success"
                          fullWidth
                          onClick={() => handleStatusChange("resolved")}
                          disabled={loading}
                          startIcon={<CheckCircleIcon />}
                          sx={{ borderRadius: 2, py: 1 }}
                        >
                          Mark Resolved
                        </SoftButton>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <SoftButton
                        variant="gradient"
                        color="error"
                        fullWidth
                        onClick={() => handleStatusChange("cancelled")}
                        disabled={loading}
                        startIcon={<CancelIcon />}
                        sx={{ borderRadius: 2, py: 1 }}
                      >
                        Cancel Ticket
                      </SoftButton>
                    </Grid>
                  </Grid>
                </SoftBox>
              )}

              {ticket.status !== "active" && (
                <SoftBox mt={4} textAlign="center" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                  <AccessTimeIcon color="disabled" sx={{ fontSize: 20, m:0, mb: 1 }} />
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    This ticket is {ticket.status.toLowerCase()} and cannot be modified.
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </SoftBox>
  )
}

TicketDetails.propTypes = {
  ticketInfo: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onAddResponse: PropTypes.func.isRequired,
  setOpenSnackbar: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
}

export default TicketDetails

