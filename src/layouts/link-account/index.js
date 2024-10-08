import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

// MUI components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { envConfig } from "env";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";

function LinkAccount() {
  const [formData, setFormData] = useState({
    upworkEmail: "",
    upworkPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false); // Track verification status
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Basic regex to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Clear error when input changes
  };

  const handleVerifyCredentials = async () => {
    // Check if email is valid
    if (!isValidEmail(formData.upworkEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Make sure required fields are filled
    if (!formData.upworkEmail || !formData.upworkPassword) {
      setError("Please enter your Upwork email and password.");
      return;
    }

    setLoading(true); // Start loading
    try {
      // Send request to verify Upwork credentials (replace with your API)
      const response = await axios.post(`${envConfig.backend}/verifyUpwork`, {
        email: formData.upworkEmail,
        password: formData.upworkPassword,
      });

      if (response.data.verified) {
        setVerified(true); // Mark as verified if credentials are correct
      } else {
        setError("Verification failed. Please check your credentials.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSaveAccount = async () => {
    try {
      // API call to save the verified account to localhost:5000/onboard
      await axios.post(`${envConfig.backend}/onboard`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={4} p={3} display="flex" flexDirection="column" alignItems="center">
        <SoftBox mb={1}>
          <SoftTypography variant="h3" fontWeight="bold" color="info" textGradient>
            Link Your Upwork Account
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="body2" fontWeight="regular" color="text">
          Add upwork credentials and verify them to automate your work
        </SoftTypography>

        <SoftBox component="form" role="form">
          <SoftBox mb={2} sx={{ width: "400px" }}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Upwork Email
              </SoftTypography>
            </SoftBox>
            <SoftInput
              label="Upwork Email"
              name="upworkEmail"
              value={formData.upworkEmail}
              onChange={handleInputChange}
              fullWidth
              disabled={verified} // Disable after verification
              required
              type="email"
              placeholder="Upwork Email"
            />
          </SoftBox>

          <SoftBox mb={2} sx={{ width: "400px" }}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">
                Upwork Password
              </SoftTypography>
            </SoftBox>
            <SoftInput
              placeholder="Password"
              label="Upwork Password"
              name="upworkPassword"
              type="password"
              value={formData.upworkPassword}
              onChange={handleInputChange}
              fullWidth
              disabled={verified}
              required
            />
          </SoftBox>

          {/* Verification Button */}
          <SoftBox mt={2} mb={3} display="flex" justifyContent="center" alignItems="center">
            {!verified ? (
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleVerifyCredentials}
                disabled={loading} // Disable while verifying
                endIcon={loading ? <CircularProgress size={24} color="inherit" /> : null} // Show loader when verifying
              >
                {loading ? "Verifying..." : "Verify Credentials"}
              </SoftButton>
            ) : (
              <SoftBox display="flex" alignItems="center">
                <SoftButton variant="contained" color="success" disabled>
                  Verified
                </SoftButton>
                <CheckCircleIcon sx={{ color: "green", ml: 1 }} />
              </SoftBox>
            )}
          </SoftBox>

          {/* Error Message */}
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}

          {/* Save Account Button (Visible only after verification) */}
          {verified && (
            <SoftBox mt={4} mb={1} display="flex" justifyContent="center">
              <SoftButton variant="gradient" color="success" onClick={handleSaveAccount}>
                Save and Add Account
              </SoftButton>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default LinkAccount;