import React from "react";
import { Link } from "react-router-dom";

// @mui material components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Images
import notFoundImage from "assets/images/illustrations/404.png"; 

function NotFound() {
  return (
    <SoftBox
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        textAlign="center"
    >
        <img
            src={notFoundImage}
            alt="404 Not Found"
            style={{ maxWidth: "200px", height: "auto", marginBottom: "20px" }}
        />
        <SoftTypography variant="h1" fontWeight="bold" color="info" gutterBottom>
            404
        </SoftTypography>
        <SoftTypography variant="h4" color="text">
            {"Oops! The page you're looking for isn't here."}
        </SoftTypography>
        <SoftTypography variant="body2" color="text" mb={4}>
            It might have been moved or deleted.
        </SoftTypography>
        <SoftButton variant="gradient" color="info" component={Link} to="/">
            Go to Homepage
        </SoftButton>
    </SoftBox>
);
}

export default NotFound;
