import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CircularProgress from "@mui/material/CircularProgress"; // Importing the loader

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import successImage from "assets/images/illustrations/rocket-white.png";
import { envConfig } from "env";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading status

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    // Function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that email is not empty and is in correct format
        if (!email) {
            setError("Email is required.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError(null); // Clear any previous error messages
        setLoading(true); // Set loading state to true when request starts

        try {
            const response = await axios.post(`${envConfig.backend}/reset-password`, { email });
            setSuccessMessage(response.data.message);
            setEmail(""); // Clear the email input
        } catch (error) {
            setError(error.response?.data?.msg || "Failed to send link. Please try again.");
        } finally {
            setLoading(false); // Set loading state to false when request is complete
        }
    };

    return (
        <CoverLayout
            title={successMessage ? "" : "Forgot Password"}
            description={successMessage ? "" : "Enter your email address to receive a password reset link"}
            image={curved9}
        >
            {successMessage ? (
                <SoftBox textAlign="center">
                    <img src={successImage} alt="Success" style={{ width: '200px', marginBottom: '20px' }} />
                    <SoftTypography variant="h5" fontWeight="bold">
                        Check Your Email!
                    </SoftTypography>
                    <SoftTypography variant="body1">
                        A password reset link has been sent to your email address.
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text">
                        Please check your inbox and follow the instructions.
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text">
                        If you do not see it, please check your spam folder.
                    </SoftTypography>
                    <SoftBox mt={4}>
                        <SoftButton variant="gradient" color="info" component={Link} to="/authentication/sign-in">
                            Back to Sign In
                        </SoftButton>
                    </SoftBox>
                </SoftBox>
            ) : (
                <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                    <SoftBox mb={2}>
                        <SoftBox mb={1} ml={0.5}>
                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                Email
                            </SoftTypography>
                        </SoftBox>
                        <SoftInput
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleInputChange}
                        />
                    </SoftBox>
                    {error && (
                        <SoftBox mt={2}>
                            <SoftTypography variant="caption" color="error">
                                {error}
                            </SoftTypography>
                        </SoftBox>
                    )}
                    <SoftBox mt={4} mb={1}>
                        <SoftButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
                            {loading ? <CircularProgress color="inherit" size={24} /> : "Send Reset Link"}
                        </SoftButton>
                    </SoftBox>
                    <SoftBox mt={3} textAlign="center">
                        <SoftTypography variant="button" color="text" fontWeight="regular">
                            Remembered your password?{" "}
                            <SoftTypography
                                component={Link}
                                to="/authentication/sign-in"
                                variant="button"
                                color="info"
                                fontWeight="medium"
                                textGradient
                            >
                                Sign in
                            </SoftTypography>
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            )}
        </CoverLayout>
    );
}

export default ForgotPassword;
