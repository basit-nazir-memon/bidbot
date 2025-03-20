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
  const color = status.includes("verified") ? "success" : "warning";
  return (
    <SoftBadge variant="gradient" badgeContent={status} color={color} size="xs" container />
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
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

  const fetchJobs = async (tab) => {
    setLoading(true);
    setJobs([])
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${envConfig.backend}/jobs/${tabs[tab].value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data.jobs);

      console.log(response.data.jobs);
      // setColumns(response.data.columns); // Assume backend provides column configuration per tab
      setColumns([
        { name: "title", align: "left" },
        { name: "type", align: "left" },
        { name: "budget", align: "left" },
        // { name: "connects", align: "center" },
        { name: "status", align: "center" },
        { name: "action", align: "center" },
      ]);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching jobs for ${tab}:`, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(tabValue);
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // // Fetch accounts data on component mount
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const token = localStorage.getItem("auth-token");
  //       const response = await axios.get(`${envConfig.backend}/jobs`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       // Set the accounts data
  //       setJobs(response.data.jobs);
  //       setLoading(false);

  //       // // Enable button if accountsLimitLeft > 0
  //       // if (response.data.accountsLimitLeft > 0) {
  //       //   setIsLinkDisabled(false);
  //       // }
  //     } catch (error) {
  //       console.error("Error fetching jobs:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchJobs();

    
  // }, []);

  // // Function to handle button click for linking an account
  // const handleLinkAccount = () => {
  //   navigate("/accounts/link");
  // };

  // Function to handle button click for viewing the profile
  const handleViewJob = (id) => {
    navigate(`/jobs/${id}/details`);
  };

  // Prepare rows data for the table
  const renderRows = () => {
    return (jobs || []).map((job, index) => ({
      // account: <Author image={account.avatar} name="Upwork Account" />,
      title: (
        <SoftTypography variant="caption" fontWeight="medium" sx={{margin: 2}} >
          {job.job.title}
        </SoftTypography>
      ),
      type: (
        <SoftTypography variant="caption" fontWeight="medium">
          {job.job.type}
        </SoftTypography>
      ),
      budget: (
        <SoftTypography variant="caption" fontWeight="medium">
          {job.job.budget ? `$${job.job.budget}` : `$${job.job.minHourlyPrice} - $${job.job.maxHourlyPrice} `}
        </SoftTypography>
      ),
      // connects: (
      //   <SoftTypography variant="caption" color="secondary" fontWeight="medium">
      //     {job.job.connects}
      //   </SoftTypography>
      // ),
      status: <StatusBadge status={job.job.payment_status} />,
      action: (
        <SoftTypography
          component="a"
          onClick={() => handleViewJob(job.job._id)}
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
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          {/* <SoftBox mb={2}>
              <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
          </SoftBox> */}

          <Card
            sx={{
              backdropFilter: `saturate(200%) blur(30px)`,
              backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
              boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
              position: "relative",
              // mt: -8,
              // mx: 3,
              mb: 2,
              py: 2,
              px: 2,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <SoftBox height="100%" mt={0.5} lineHeight={1}>
                  {tabs[tabValue].icon}
                </SoftBox>
              </Grid>
              <Grid item>
                <SoftBox height="100%" mt={0.5} lineHeight={1}>
                  <SoftTypography variant="h5" fontWeight="medium">
                    {tabs[tabValue].label} Configuration
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={12} lg={8} sx={{ ml: "auto" }}>
                <AppBar position="static">
                  <Tabs
                    orientation={tabsOrientation}
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{ background: "transparent" }}
                  >
                    {
                      tabs.map((tab, index) => (
                        <Tab
                          key={index}
                          label={tab.label}
                          icon={tab.icon}
                        />
                      ))
                    }
                  </Tabs>
                </AppBar>
              </Grid>
            </Grid>
          </Card>


          <Card>
            
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">{tabs[tabValue].label}</SoftTypography>
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
    </DashboardLayout>
  );
}

export default Jobs;
