import { useState } from "react";
import axios from "axios";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved14.jpg";
import { useNavigate } from "react-router-dom";
import { envConfig } from "env";

function SignUp() {
  const [agreement, setAgreement] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSetAgreement = () => setAgreement(!agreement);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAccountTypeChange = (event) => {
    setFormData({ ...formData, accountType: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error message
    setError("");

    // Front-end validation checks
    if (!formData.name) {
      return setError("Name is required");
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address");
    }

    if (!formData.password || !passwordRegex.test(formData.password)) {
      return setError("Password should have one lowercase letter, one uppercase letter, one special character, one number, and be at least 8 characters long");
    }

    try {
      const response = await axios.post(`${envConfig.backend}/register`, formData);
      
      setSuccessMessage("User Registered Successfully! Redirecting to Sign In...");

      // Delay for 2 seconds before navigating to sign-in page
      setTimeout(() => {
        navigate("/authentication/sign-in");
      }, 2000);

    } catch (error) {
      console.error(error); // Handle error
      setError(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <BasicLayout
      title="Welcome!"
      description="Create an account to automate bidding & focus on quality work."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register with
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2}>
          <Socials />
        </SoftBox>
        <Separator />
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={2}>
              <SoftInput
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </SoftBox>
            {/* Account type dropdown */}
            {/* <SoftBox mb={2}>
              <Select
                value={formData.accountType || ""}
                onChange={handleAccountTypeChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  <span style={{ marginLeft: "-10px", color: "rgb(178 179 196)", font: "inherit" }}>Select Account Type</span>
                </MenuItem>
                <MenuItem value="Company">Company</MenuItem>
                <MenuItem value="Individual">Individual</MenuItem>
              </Select>
            </SoftBox> */}

            {/* Error message */}
            {error && (
              <SoftBox mb={2}>
                <SoftTypography color="error" variant="caption">
                  {error}
                </SoftTypography>
              </SoftBox>
            )}

            {successMessage && (
              <SoftBox mb={2}>
                <SoftTypography color="success" variant="caption">
                  {successMessage}
                </SoftTypography>
              </SoftBox>
            )}

            <SoftBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgreement} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgreement}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                Terms and Conditions
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth type="submit">
                Sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
