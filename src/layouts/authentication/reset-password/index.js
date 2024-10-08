import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// @mui material components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { envConfig } from "env";

function ResetPassword() {
    const { token } = useParams(); // Get token from URL params
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
        }

        try {
        const response = await axios.post(`${envConfig.backend}/reset-password/${token}`, {
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
        });
        setSuccess("Password reset successfully.");
        setTimeout(() => {
            navigate("/authentication/sign-in"); // Redirect to sign-in after success
        }, 2000);
        } catch (error) {
        setError(error.response?.data?.error || "Failed to reset password. Please try again.");
        }
    };

    return (
        <CoverLayout
        title="Reset Your Password"
        description="Enter a new password to reset your account password"
        image={curved9}
        >
        <SoftBox component="form" role="form" onSubmit={handleSubmit}>
            <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                New Password
                </SoftTypography>
            </SoftBox>
            <SoftInput
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
            />
            </SoftBox>
            <SoftBox mb={2}>
            <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                Confirm New Password
                </SoftTypography>
            </SoftBox>
            <SoftInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
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
            {success && (
            <SoftBox mt={2}>
                <SoftTypography variant="caption" color="success">
                {success}
                </SoftTypography>
            </SoftBox>
            )}
            <SoftBox mt={4} mb={1}>
            <SoftButton variant="gradient" color="info" fullWidth type="submit">
                Reset Password
            </SoftButton>
            </SoftBox>
        </SoftBox>
        </CoverLayout>
    );
}

export default ResetPassword;
