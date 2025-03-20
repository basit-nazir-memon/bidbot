"use client"

// @mui material components
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import CircularProgress from "@mui/material/CircularProgress"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftInput from "components/SoftInput"
import SoftButton from "components/SoftButton"

// React hooks
import { useState } from "react"
import PropTypes from "prop-types"

// Axios for API requests
import axios from "axios"
import { envConfig } from "env"

function CreateTicketForm({ onSuccess, setOpenSnackbar, setErrorMsg, setSnackbarMessage }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    type: "",
    description: "",
    priority: "medium",
  })
  const [errors, setErrors] = useState({})

  const ticketTypes = [
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing Question" },
    { value: "account", label: "Account Management" },
    { value: "feature", label: "Feature Request" },
    { value: "other", label: "Other" },
  ]

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.type) {
      newErrors.type = "Please select a ticket type"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      const response = await axios.post(`${envConfig.backend}/tickets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setLoading(false)
      setFormData({
        subject: "",
        type: "",
        description: "",
        priority: "medium",
      })
      setExpanded(false)

      setErrorMsg(false);
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      setErrorMsg(true);
      setSnackbarMessage(error.response.data.message);
      setOpenSnackbar(true);
      setLoading(false)
    }
  }

  return (
    <SoftBox>
      {!expanded ? (
        <SoftButton variant="gradient" color="info" onClick={() => setExpanded(true)} fullWidth>
          Create New Support Ticket
        </SoftButton>
      ) : (
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h6" fontWeight="medium" mb={2}>
              Create New Support Ticket
            </SoftTypography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Subject
                    </SoftTypography>
                    <SoftInput
                      placeholder="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      error={!!errors.subject}
                      fullWidth
                    />
                    {errors.subject && (
                      <SoftTypography variant="caption" color="error" fontWeight="regular">
                        {errors.subject}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={3}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Ticket Type
                    </SoftTypography>
                    <FormControl fullWidth error={!!errors.type}>
                      <Select
                        labelId="ticket-type-label"
                        id="ticket-type"
                        name="type"
                        value={formData.type}
                        label="Ticket Type"
                        onChange={handleInputChange}
                      >
                        {ticketTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.type && (
                        <SoftTypography variant="caption" color="error" fontWeight="regular">
                          {errors.type}
                        </SoftTypography>
                      )}
                    </FormControl>
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={3}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Priority
                    </SoftTypography>
                    <FormControl fullWidth>
                      <Select
                        labelId="priority-label"
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        label="Priority"
                        onChange={handleInputChange}
                      >
                        {priorities.map((priority) => (
                          <MenuItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </SoftBox>
                </Grid>

                <Grid item xs={12}>
                  <SoftBox mb={2}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Problem Description
                    </SoftTypography>
                    <SoftInput
                      placeholder="Describe your issue in detail..."
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      error={!!errors.description}
                      multiline
                      rows={5}
                      fullWidth
                    />
                    {errors.description && (
                      <SoftTypography variant="caption" color="error" fontWeight="regular">
                        {errors.description}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </Grid>

                <Grid item xs={12}>
                  <SoftBox display="flex" justifyContent="flex-end">
                    <SoftButton variant="outlined" size={"small"} color="secondary" onClick={() => setExpanded(false)} sx={{ mr: 1 }}>
                      Cancel
                    </SoftButton>
                    <SoftButton type="submit" variant="gradient" size={"small"} color="info" disabled={loading}>
                      {loading ? <CircularProgress size={20} color="inherit" /> : "Submit Ticket"}
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
            </form>
          </SoftBox>
        </Card>
      )}
    </SoftBox>
  )
}

CreateTicketForm.propTypes = {
  onSuccess: PropTypes.func,
  setSnackbarMessage: PropTypes.func,
  setErrorMsg: PropTypes.func,
  setOpenSnackbar: PropTypes.func,
}

export default CreateTicketForm

