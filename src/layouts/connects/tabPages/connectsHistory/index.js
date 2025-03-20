// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// React hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Axios for API requests
import axios from "axios";

// Soft UI Dashboard React components for table rows
import SoftBadge from "components/SoftBadge";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";

import PropTypes from "prop-types";
import { envConfig } from "env";
import { AppBar, Grid } from "@mui/material";
import icon from "assets/theme/components/icon";
import { AddCircleOutlineOutlined, Create, History, List, TipsAndUpdates } from "@mui/icons-material";

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

function ConnectsHistory() {
  const [connects, setConnects] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [activeTab, setActiveTab] = useState("applied"); // Default to "Applied Jobs"
  const [columns, setColumns] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  // const [isLinkDisabled, setIsLinkDisabled] = useState(true); // State to control button disable

  const navigate = useNavigate();

  const tabs = [
    { label: "Applied Jobs", value: "applied", icon: <AddCircleOutlineOutlined /> },
    { label: "Suggested Jobs", value: "suggested", icon: <TipsAndUpdates /> },
    { label: "Jobs History", value: "history", icon: <History /> },
    { label: "Wishlisted Jobs", value: "wishlist", icon: <List /> },
  ];

  const fetchConnects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${envConfig.backend}/jobs}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setConnects(response.data.connects);
      // setColumns(response.data.columns); // Assume backend provides column configuration per tab
      setColumns([
        { name: "title", align: "left" },
        { name: "budget", align: "left" },
        { name: "connects", align: "center" },
        { name: "status", align: "center" },
        { name: "action", align: "center" },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching jobs for :`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnects();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // console.log(newValue);
  };


  // Function to handle button click for viewing the profile
  const handleViewJob = (id) => {
    navigate(`/jobs/${id}/details`);
  };

  // Prepare rows data for the table
  const renderRows = () => {
    return connects.map((job, index) => ({
      // account: <Author image={account.avatar} name="Upwork Account" />,
      title: (
        <SoftTypography variant="caption" fontWeight="medium">
          {job.title}
        </SoftTypography>
      ),
      budget: (
        <SoftTypography variant="caption" fontWeight="medium">
          {job.budget}
        </SoftTypography>
      ),
      connects: (
        <SoftTypography variant="caption" color="secondary" fontWeight="medium">
          {job.connects}
        </SoftTypography>
      ),
      status: <StatusBadge status={job.status} />,
      action: (
        <SoftTypography
          component="a"
          onClick={() => handleViewJob(job.id)}
          variant="caption"
          color="secondary"
          fontWeight="medium"
          sx={{ cursor: "pointer" }}
        >
          View Job
        </SoftTypography>
      ),
    }));
  };

  return (
    <>
      <Card sx={{mt: 3, mx: 3}}>
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
    </>
  );
}

export default ConnectsHistory;
