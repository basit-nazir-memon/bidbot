// @mui material components
import Card from "@mui/material/Card"
import CircularProgress from "@mui/material/CircularProgress"
import Switch from "@mui/material/Switch"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"
import SoftInput from "components/SoftInput"
import SoftBadge from "components/SoftBadge"
import SoftAvatar from "components/SoftAvatar"

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import Table from "examples/Tables/Table"

// React hooks
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Axios for API requests
import axios from "axios"

import PropTypes from "prop-types"
import { envConfig } from "env"

// Function to display team member information in the table
function TeamMember({ name, email }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <SoftAvatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`}
          alt={name}
          size="sm"
          variant="rounded"
        />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {email}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  )
}

TeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
}

function StatusBadge({ status, memberId, onStatusChange }) {
  const color = status === true ? "success" : "error"

  const handleToggle = async () => {
    await onStatusChange(memberId, status)
  }

  return (
    <SoftBox display="flex" alignItems="center" justifyContent="center">
      <SoftBadge variant="gradient" badgeContent={status} color={color} size="xs" container />
      <Switch checked={status === true} onChange={handleToggle} color="success"  sx={{ ml: 1 }} />
    </SoftBox>
  )
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  memberId: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
}

function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [openAccessModal, setOpenAccessModal] = useState(false)
  const [currentMemberId, setCurrentMemberId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "male",
    role: "developer",
    pageAccess: {
      dashboard: { name: "Dashboard", selected: true },
      accounts: { name: "Accounts", selected: false },
      team: { name: "Team", selected: false },
      settings: { name: "Settings", selected: false },
      reports: { name: "Reports", selected: false },
      profile: { name: "Profile", selected: false },
      bidbot: { name: "Bidbot", selected: false },
    },
  })
  const [accessData, setAccessData] = useState({
    dashboard: { name: "Dashboard", selected: true },
    accounts: { name: "Accounts", selected: false },
  })

  const navigate = useNavigate()

  // Fetch team members data on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await axios.get(`${envConfig.backend}/team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Set the team members data
        setTeamMembers(response.data.team || [])

        // Assuming response.data.pagesAccess contains the new pagesAccess data
        const updatedPageAccess = response.data.pagesAccess;

        console.log("updatedPageAccess", updatedPageAccess);

        // Update formData with the new pageAccess values from response
        setFormData((prevData) => ({
          ...prevData,
          pageAccess: updatedPageAccess,  // Set the new pageAccess
        }));
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching team members:", error)
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Function to handle status change
  const handleStatusChange = async (memberId, newStatus) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")

      await axios.post(
        `${envConfig.backend}/team/${memberId}/toggle`,
        { blocked: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the local state
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) => (member._id === memberId ? { ...member, blocked: newStatus } : member)),
      )
      setLoading(false)
    } catch (error) {
      console.error("Error updating member status:", error)
      setLoading(false)
    }
  }

  // Function to handle opening the access management modal
  const handleManageAccess = (memberId) => {
    const member = teamMembers.find((m) => m._id === memberId)
    if (member) {
      setAccessData(member.pagesAccess)
      setCurrentMemberId(memberId)
      setOpenAccessModal(true)
    }
  }

  // Function to handle saving access changes
  const handleSaveAccess = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      await axios.post(
        `${envConfig.backend}/team/${currentMemberId}/access`,
        { pagesAccess: accessData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the local state
      setTeamMembers((prevMembers) =>
        prevMembers.map((member) => (member._id === currentMemberId ? { ...member, pageAccess: accessData } : member)),
      )
      setOpenAccessModal(false)
      setLoading(false)
    } catch (error) {
      console.error("Error updating access permissions:", error)
      setLoading(false)
    }
  }

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Function to handle checkbox changes for page access
  const handleCheckboxChange = (e, isFormData = true) => {
    const { name, checked } = e.target
    if (isFormData) {
      setFormData((prevData) => ({
        ...prevData,
        pageAccess: {
          ...prevData.pageAccess,
          [name]: {
            ...prevData.pageAccess[name],
            selected: checked,
          },
        },
      }));
    } else {
      setAccessData({
        ...accessData,
          [name]: {
            ...accessData[name],
            selected: checked,
          },
      })
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      const response = await axios.post(`${envConfig.backend}/team`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Add the new member to the local state
      setTeamMembers([...teamMembers, response.data.teamMember])
      setOpenModal(false)
      setFormData({
        name: "",
        email: "",
        gender: "male",
        role: "developer",
        pageAccess: {
          dashboard: { name: "Dashboard", selected: true },
        },
      })
      setLoading(false)
    } catch (error) {
      console.error("Error creating team member:", error)
      setLoading(false)
    }
  }

  // Prepare rows data for the table
  const renderRows = () => {
    return teamMembers.map((member) => ({
      member: <TeamMember name={member.name} email={member.email} />,
      gender: (
        <SoftTypography variant="caption" fontWeight="medium">
          {member.gender === "male" ? "Male" : "Female"}
        </SoftTypography>
      ),
      status: <StatusBadge status={!member.blocked} memberId={member._id} onStatusChange={handleStatusChange} />,
      access: (
        <SoftButton variant="text" color="info" size="small" onClick={() => handleManageAccess(member._id)}>
          Manage Access
        </SoftButton>
      ),
    }))
  }

  const columns = [
    { name: "member", align: "left" },
    { name: "gender", align: "center" },
    { name: "status", align: "center" },
    { name: "access", align: "center" },
  ]

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  }

  // Render the table or loading state
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Team Management</SoftTypography>
              <SoftButton size="small" variant="gradient" color="info" onClick={() => setOpenModal(true)}>
                Add Team Member
              </SoftButton>
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
                <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress color="info" />
                </SoftBox>
              ) : (
                <Table columns={columns} rows={renderRows()} />
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {/* Add Team Member Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="add-team-member-modal">
        <Box sx={modalStyle}>
          <SoftTypography variant="h6" component="h2" mb={2}>
            Add New Team Member
          </SoftTypography>
          <form onSubmit={handleSubmit}>
            <SoftBox mb={2}>
              <SoftInput
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </SoftBox>
            <SoftBox mb={2}>
              <FormControl fullWidth>
                <Select
                  id="gender-select"
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </SoftBox>
            <SoftBox mb={2}>
              <FormControl fullWidth>
                <Select
                  id="role-select"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="developer">Developer</MenuItem>
                  <MenuItem value="tester">Tester</MenuItem>
                  <MenuItem value="fullStackDeveloper">Full Stack Developer</MenuItem>
                  <MenuItem value="mobileDeveloper">Mobile Developer</MenuItem>
                  <MenuItem value="devOpsEngineer">DevOps Engineer</MenuItem>
                  <MenuItem value="databaseAdministrator">Database Administrator</MenuItem>
                  <MenuItem value="qaEngineer">QA Engineer</MenuItem>
                  <MenuItem value="projectManager">Project Manager</MenuItem>
                  <MenuItem value="businessAnalyst">Business Analyst</MenuItem>
                  <MenuItem value="uiUxDesigner">UI/UX Designer</MenuItem>
                  <MenuItem value="systemsArchitect">Systems Architect</MenuItem>
                  <MenuItem value="securityEngineer">Security Engineer</MenuItem>
                  <MenuItem value="salesEngineer">Sales Engineer</MenuItem>
                  <MenuItem value="hrManager">HR Manager</MenuItem>
                  <MenuItem value="other">Other Team Member</MenuItem>
                </Select>
              </FormControl>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftTypography variant="button" fontWeight="regular">
                Page Access
              </SoftTypography>
              <Grid container ml={0.5} spacing={2} mt={0.5}>
                {Object.keys(formData.pageAccess).map((key) => (
                  <Grid item xs={6} key={key} my={-1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.pageAccess[key].selected}
                          onChange={(e) => handleCheckboxChange(e, key)}
                          name={key}
                          sx={{my: 0}}
                        />
                      }
                      label={formData.pageAccess[key].name}
                    />
                  </Grid>
                ))}
              </Grid>
            </SoftBox>
            <SoftBox display="flex" justifyContent="flex-end" mt={3}>
              <SoftButton variant="outlined" color="secondary" onClick={() => setOpenModal(false)} sx={{ mr: 1 }}>
                Cancel
              </SoftButton>
              <SoftButton type="submit" variant="gradient" color="info">
                Add Member
              </SoftButton>
            </SoftBox>
          </form>
        </Box>
      </Modal>

      {/* Manage Access Modal */}
      <Modal open={openAccessModal} onClose={() => setOpenAccessModal(false)} aria-labelledby="manage-access-modal">
        <Box sx={modalStyle}>
          <SoftTypography variant="h6" component="h2" mb={2}>
            Manage Page Access
          </SoftTypography>
          <SoftBox mb={2}>
            <Grid container ml={0.5} spacing={2}>
                {Object.keys(accessData).map((key) => (
                  <Grid item xs={6} key={key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accessData[key].selected}
                          onChange={(e) => handleCheckboxChange(e, false)}
                          name={key}
                        />
                      }
                      label={accessData[key].name}
                    />
                  </Grid>
                ))}
            </Grid>
          </SoftBox>
          <SoftBox display="flex" justifyContent="flex-end" mt={3}>
            <SoftButton variant="outlined" color="secondary" onClick={() => setOpenAccessModal(false)} sx={{ mr: 1 }}>
              Cancel
            </SoftButton>
            <SoftButton variant="gradient" color="info" onClick={handleSaveAccess}>
              Save Changes
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
    </DashboardLayout>
  )
}

export default TeamManagement

