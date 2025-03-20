import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom"; // Import Link for internal routing

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Images
import wavesWhite from "assets/images/shapes/waves-white.svg";
import rocketWhite from "assets/images/illustrations/rocket-white.png";
import PropTypes from "prop-types";

function BuildByDevelopers({ title, subtitle, description, buttonText, buttonLink }) {
  return (
    <Card>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" flexDirection="column" height="100%">
              <SoftBox pt={1} mb={0.5}>
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  {title}
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                {subtitle}
              </SoftTypography>
              <SoftBox mb={6}>
                <SoftTypography variant="body2" color="text">
                  {description}
                </SoftTypography>
              </SoftBox>
              <SoftBox mt="auto" mr="auto">
                <Link
                  to={buttonLink} // Use Link for internal navigation
                  style={{
                    textDecoration: "none", // Remove underline
                    color: "inherit", // Inherit the text color
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <SoftTypography variant="button" color="text" fontWeight="medium">
                    {buttonText}
                    <Icon
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.125rem",
                        marginLeft: "5px",
                        transform: `translate(2px, 2px)`,
                        transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
                        "&:hover, &:focus": {
                          transform: `translate(6px, 2px)`,
                        },
                      }}
                    >
                      arrow_forward
                    </Icon>
                  </SoftTypography>
                </Link>
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ position: "relative", ml: "auto" }}>
            <SoftBox
              height="100%"
              display="grid"
              justifyContent="center"
              alignItems="center"
              bgColor="info"
              borderRadius="lg"
              variant="gradient"
            >
              <SoftBox
                component="img"
                src={wavesWhite}
                alt="waves"
                display="block"
                position="absolute"
                left={0}
                width="100%"
                height="100%"
              />
              <SoftBox component="img" src={rocketWhite} alt="rocket" width="100%" pt={3} />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

BuildByDevelopers.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
};

export default BuildByDevelopers;
