// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog"; // Import Dialog components
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// React hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Axios for API requests
import axios from "axios";

// Soft UI Dashboard React components for table rows
import SoftBadge from "components/SoftBadge";
import SoftAvatar from "components/SoftAvatar";

// Static image for Upwork logo
import upworkImage from "assets/images/logos/upwork.png";

import PropTypes from "prop-types";
import { envConfig } from "env";

// Function to display account information in the table
function Author({ image, name }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <SoftAvatar src={image} alt={name} size="sm" variant="rounded" />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

Author.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function StatusBadge({ status }) {
  const color = status === "active" ? "success" : "warning";
  return (
    <SoftBadge variant="gradient" badgeContent={status} color={color} size="xs" container />
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [userIdToModify, setUserIdToModify] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(`${envConfig.backend}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the users data
        setUsers(response.data.data); // Adjust based on the response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = (action, userId) => {
    setCurrentAction(action);
    setUserIdToModify(userId);
    setOpenDialog(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAction(null);
    setUserIdToModify(null);
  };

  const handleViewProfile = (id) => {
    navigate(`/users/profile/${id}`);
  };

  // Function to confirm block/unblock action
  const handleConfirmAction = async () => {
    setButtonLoading(true); // Set button loading state to true
    try {
      const token = localStorage.getItem("auth-token");
      const url = currentAction === "block"
        ? `${envConfig.backend}/users/${userIdToModify}/block`
        : `${envConfig.backend}/users/${userIdToModify}/unblock`;

      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh users list
      const response = await axios.get(`${envConfig.backend}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error(`Error during ${currentAction} action:`, error);
    } finally {
      setButtonLoading(false);
      handleCloseDialog();
    }
  };

  // Prepare rows data for the table
  const renderRows = () => {
    return !users ? [] : users.map((user) => ({
      user: <Author image={user.avatar} name={user.name} />,
      email: (
        <SoftTypography variant="caption" fontWeight="medium">
          {user.email}
        </SoftTypography>
      ),
      role: (
        <SoftTypography variant="caption" fontWeight="medium">
          {user.role}
        </SoftTypography>
      ),
      gender: (
        <SoftTypography variant="caption" fontWeight="medium">
          {user.gender}
        </SoftTypography>
      ),
      status: <StatusBadge status={user.blocked ? "blocked" : "active"} />, // Assuming blocked means not active
      linkedAccounts: (
        <SoftTypography variant="caption" fontWeight="medium">
          {user.linkedAccounts}
        </SoftTypography>
      ),
      block: (
        <SoftTypography
          component="a"
          onClick={() => handleOpenDialog(user.blocked ? "unblock" : "block", user.id)}
          variant="caption"
          color="secondary"
          fontWeight="medium"
          sx={{ cursor: "pointer" }}
        >
          {user.blocked ? "Unblock" : "Block"}
        </SoftTypography>
      ),
      profile: (
        <SoftTypography
          component="a"
          onClick={() => handleViewProfile(user.id)} 
          variant="caption"
          color="secondary"
          fontWeight="medium"
          sx={{ cursor: "pointer" }}
        >
          View Profile
        </SoftTypography>
      ),
    }));
  };

  const columns = [
    { name: "user", align: "left" },
    { name: "email", align: "left" },
    { name: "role", align: "center" },
    { name: "gender", align: "center" },
    { name: "status", align: "center" },
    { name: "linkedAccounts", align: "center" },
    { name: "profile", align: "center" },
    { name: "block", align: "center" },
  ];

  // Render the table or loading state
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Users Table</SoftTypography>
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
                <Table columns={columns} rows={renderRows()} />
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentAction === "block" ? "Block User" : "Unblock User"}</DialogTitle>
        <DialogContent>
          <SoftTypography sx={{ fontSize: '0.875rem' }}>
            {currentAction === "block"
              ? "Are you sure you want to block this user?"
              : "Are you sure you want to unblock this user?"}
          </SoftTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="info">
            {buttonLoading ? <CircularProgress color="info" size={24}/> : (currentAction === "block" ? "Block" : "Unblock")}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Users;
