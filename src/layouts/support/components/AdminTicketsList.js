"use client"

// @mui material components
import Card from "@mui/material/Card"
import TablePagination from "@mui/material/TablePagination"
import CircularProgress from "@mui/material/CircularProgress"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftBadge from "components/SoftBadge"
import SoftButton from "components/SoftButton"
import SoftAvatar from "components/SoftAvatar"

// React hooks
import { useState, useEffect } from "react"
import PropTypes from "prop-types"

// Axios for API requests
import axios from "axios"
import { envConfig } from "env"

import AccessTimeIcon from "@mui/icons-material/AccessTime"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

function AdminTicketsList({ status, onViewTicket }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await axios.get(`${envConfig.backend}/admin/tickets?status=${status}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log(response.data.tickets )

        setTickets(response.data.tickets || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching tickets:", error)
        setLoading(false)
      }
    }

    fetchTickets()
  }, [status])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "info"
      case "pending":
        return "warning"
      case "resolved":
        return "success"
      case "closed":
        return "default"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress color="info" />
      </SoftBox>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <SoftBox p={3} textAlign="center">
          <SoftTypography variant="button" color="text">
            No {status} tickets found.
          </SoftTypography>
        </SoftBox>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
      }}
    >
      <SoftBox p={2}>
        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
          {status === "active" ? "Active Support Tickets" : "Resolved Support Tickets"}
        </SoftTypography>

        {tickets.length === 0 ? (
          <SoftBox textAlign="center" py={3}>
            <SoftTypography variant="button" color="text">
              No {status} tickets found.
            </SoftTypography>
          </SoftBox>
        ) : (
          <SoftBox>
            {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
              <Box
                key={ticket.id}
                sx={{
                  p: 2,
                  mb: 1.5,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.1)",
                    borderColor: "secondary.light",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <SoftBox display="flex" alignItems="center">
                      <SoftBox mr={1.5}>
                        <SoftAvatar
                          src={ticket.user.owner.avatar}
                          alt={ticket.user.owner.name}
                          size="sm"
                          variant="rounded"
                        />
                      </SoftBox>
                      <SoftBox display="flex" flexDirection="column">
                        <SoftTypography variant="button" fontWeight="medium">
                          {ticket.user.owner.name}
                        </SoftTypography>
                        <SoftTypography variant="caption" color="secondary">
                          {ticket.user.owner.email}
                        </SoftTypography>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <SoftTypography variant="button" fontWeight="medium">
                      {ticket.subject}
                    </SoftTypography>
                    <SoftBox display="flex" alignItems="center" mt={1}>
                      <SoftTypography variant="caption" color="text" mr={1}>
                        {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                      </SoftTypography>
                      <SoftBadge
                        variant="gradient"
                        badgeContent={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        color={getPriorityColor(ticket.priority)}
                        size="xs"
                        container
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <SoftBox display="flex" flexDirection="column">
                      <SoftBox display="flex" alignItems="center" mb={1}>
                        <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                        <SoftTypography variant="caption" color="text">
                          Created: {formatDate(ticket.createdAt)}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBadge
                        variant="gradient"
                        badgeContent={ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        color={getStatusColor(ticket.status)}
                        size="xs"
                        container
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <SoftButton variant="text" color="info" onClick={() => onViewTicket(ticket)}>
                      View Details
                    </SoftButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {/* <TablePagination
              component="div"
              count={tickets.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </SoftBox>
        )}
      </SoftBox>
    </Card>
  )
}

AdminTicketsList.propTypes = {
  status: PropTypes.string.isRequired,
  onViewTicket: PropTypes.func.isRequired,
}

export default AdminTicketsList

