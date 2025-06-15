import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// MUI components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftInput from "components/SoftInput";
import { envConfig } from "env";
import SubscriptionPlans from "./components/SubscriptionPlans";

// Initialize Stripe
const stripePromise = loadStripe(envConfig.stripePublicKey);

function UserOnboarding() {
    const [formData, setFormData] = useState({
        gender: "",
        phone: "",
        accountType: "",
        profilePicture: null,
        profilePreview: null,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPlans, setShowPlans] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, profilePicture: file, profilePreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAccountTypeSelect = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, accountType: value });
        setShowPlans(true);
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.gender || !formData.phone || !formData.accountType) {
            setError("Please fill all required fields");
            return;
        }

        if (!selectedPlan) {
            setError("Please select a subscription plan");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("gender", formData.gender);
            data.append("phone", formData.phone);
            data.append("accountType", formData.accountType);
            data.append("subscriptionPlan", selectedPlan.name);
            if (formData.profilePicture) {
                data.append("profilePicture", formData.profilePicture);
            }

            const response = await axios.post(`${envConfig.backend}/onboard`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                },
            });

            if (response.data.pagesAccess) {
                localStorage.setItem('pagesAccess', JSON.stringify(response.data.pagesAccess));
            }

            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox mt={4} p={3} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h4" mb={2}>
                    Complete Your Profile
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
                    {/* Profile Picture (Optional) */}
                    <SoftBox mb={3} display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            src={formData.profilePreview || "/default-avatar.png"}
                            sx={{ width: 120, height: 120 }}
                        />
                        <SoftButton 
                            sx={{ mt: 2 }}
                            color={"info"}
                            variant={"gradient"}
                            size="small"
                            component="label"
                            startIcon={<PhotoCamera />}
                        >
                            Upload Profile Picture
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </SoftButton>
                        
                        {formData.profilePicture && (
                            <Typography fontSize={12} variant="body2" mt={1}>
                                Selected: {formData.profilePicture.name}
                            </Typography>
                        )}
                    </SoftBox>

                    <SoftBox mb={2}>
                        <Select
                            displayEmpty
                            fullWidth
                            labelId="gender-label"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <MenuItem value="" disabled>
                                <span style={{ marginLeft: "-10px", color: "rgb(178 179 196)", font: "inherit" }}>Select Gender</span>
                            </MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </SoftBox>

                    <SoftBox mb={2}>
                        <SoftInput
                            placeholder="Phone Number"
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </SoftBox>

                    <Typography variant="h6" mt={2} mb={1} align="center" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
                        How will you use your BidBot account?
                    </Typography>
                    <RadioGroup
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleAccountTypeSelect}
                        row
                        sx={{
                            justifyContent: "center",
                            '& .MuiFormControlLabel-label': {
                                fontWeight: 500,
                                fontSize: "1rem",
                                color: "#555",
                            },
                            '& .MuiRadio-root': {
                                color: "#1a73e8",
                            },
                            '& .Mui-checked': {
                                color: "#1a73e8",
                            }
                        }}
                    >
                        <FormControlLabel sx={{ margin: "0px 15px" }} value="individual" control={<Radio />} label="Individual" />
                        <FormControlLabel sx={{ margin: "0px 15px" }} value="company" control={<Radio />} label="Company" />
                    </RadioGroup>

                    {showPlans && (
                        <SoftBox mt={4}>
                            <Typography variant="h6" mb={3} align="center" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
                                Choose Your Plan
                            </Typography>
                            <Elements stripe={stripePromise}>
                                <SubscriptionPlans 
                                    accountType={formData.accountType} 
                                    onPlanSelect={handlePlanSelect}
                                />
                            </Elements>
                        </SoftBox>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Typography variant="body2" color="error" align="center" mt={2}>
                            {error}
                        </Typography>
                    )}

                    {/* Submit Button */}
                    <SoftBox mt={4} mb={1} display="flex" justifyContent="center">
                        <SoftButton
                            variant="gradient"
                            color="info"
                            type="submit"
                            disabled={loading || !selectedPlan}
                            endIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                        >
                            {loading ? "Completing Setup..." : "Complete Setup"}
                        </SoftButton>
                    </SoftBox>
                </form>
            </SoftBox>
        </DashboardLayout>
    );
}

export default UserOnboarding;
