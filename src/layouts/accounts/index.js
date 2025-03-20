// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

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
  const color = status === "Running" ? "success" : status === "Stopped" ? "error" : "info";
  
  return (
    <SoftBadge variant="gradient" badgeContent={status} color={color} size="xs" container />
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLinkDisabled, setIsLinkDisabled] = useState(true); // State to control button disable

  const navigate = useNavigate();

  // Fetch accounts data on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(`${envConfig.backend}/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the accounts data
        setAccounts(response.data.upworkAccounts);
        setLoading(false);

        // Enable button if accountsLimitLeft > 0
        if (response.data.accountsLimitLeft > 0) {
          setIsLinkDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Function to handle button click for linking an account
  const handleLinkAccount = () => {
    navigate("/accounts/link");
  };

  // Function to handle button click for viewing the profile
  const handleViewProfile = (id) => {
    navigate(`/accounts/${id}/profile`);
  };

  // Prepare rows data for the table
  const renderRows = () => {
    return accounts.map((account, index) => ({
      account: <Author image={account.avatar} name="Upwork Account" />,
      username: (
        <SoftTypography variant="caption" fontWeight="medium">
          {account.username}
        </SoftTypography>
      ),
      status: <StatusBadge status={account.status} />,
      connects: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {account.connects}
        </SoftTypography>
      ),
      action: (
        <SoftTypography
          component="a"
          onClick={() => handleViewProfile(account.id)}
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
    { name: "account", align: "left" },
    { name: "username", align: "left" },
    { name: "status", align: "center" },
    { name: "connects", align: "center" },
    { name: "action", align: "center" },
  ];

  // Render the table or loading state
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Accounts Table</SoftTypography>
              <SoftButton
                size="small"
                variant="gradient"
                color="success"
                onClick={handleLinkAccount}
                disabled={isLinkDisabled} // Disable button based on state
              >
                Link Account
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
                <SoftBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="200px" // Adjust height as needed
                >
                  <CircularProgress color="success" /> {/* MUI loader */}
                </SoftBox>
              ) : (
                <Table columns={columns} rows={renderRows()} />
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Accounts;
