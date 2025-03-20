import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
import burceMars from "assets/images/bruce-mars.jpg";
import curved0 from "assets/images/curved-images/curved0.jpg";
import { AccessTime, Create, FilterAlt } from "@mui/icons-material";
import PropTypes from "prop-types";

Header.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired, // Assuming `icon` is a React node
      tabName: PropTypes.string.isRequired,
    })
  ).isRequired,
  tabValue: PropTypes.number.isRequired,
  handleSetTabValue: PropTypes.func.isRequired,
};

function Header({tabs, tabValue, handleSetTabValue}) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  // const [tabValue, setTabValue] = useState(0);

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

  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="6rem"
        borderRadius="xl"
        // sx={{
        //   backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
        //     `${linearGradient(
        //       rgba(gradients.info.main, 0.6),
        //       rgba(gradients.info.state, 0.6)
        //     )}, url(${curved0})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "50%",
        //   overflow: "hidden",
        // }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          // mt: -8,
          mx: 3,
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
                {tabs[tabValue].tabName} Details
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={5} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent" }}
              >
                {
                  tabs.map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.tabName}
                      icon={tab.icon}
                    />
                  ))
                }
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
  );
}

export default Header;
