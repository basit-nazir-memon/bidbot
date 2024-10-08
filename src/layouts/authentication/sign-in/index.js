import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved9 from "assets/images/curved-images/curved-6.jpg";
import { envConfig } from "env";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${envConfig.backend}/login`, formData);
      const data = response.data;

      const storage = localStorage;

      storage.setItem('auth-token', data.token);
      storage.setItem('email', data.email);
      storage.setItem('role', data.role);
      storage.setItem('avatar', data.avatar);
      storage.setItem('id', data.id);
      storage.setItem('name', data.name);
      storage.setItem('pagesAccess', data.pagesAccess)

      console.log(data);

      navigate("/" + data.pagesAccess[0]);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Failed to sign in. Please try again.");
    }
  }

  return (
    <CoverLayout
      title="Welcome back"
      description="Enter your email and password to sign in"
      image={curved9}
    >
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </SoftBox>

        <SoftBox mb={2}>
          <SoftTypography
            component={Link}
            to="/authentication/forgot-password" // Change to your actual forgot password route
            variant="button"
            color="info"
            fontWeight="regular"
            textGradient
          >
            Forgot Password?
          </SoftTypography>
        </SoftBox>
        {error && (
          <SoftBox mt={2}>
            <SoftTypography variant="caption" color="error">
              {error}
            </SoftTypography>
          </SoftBox>
        )}
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" fullWidth type="submit">
            sign in
          </SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
