import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

// MUI components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftInput from "components/SoftInput";
import { envConfig } from "env";

function UserOnboarding() {
    const [formData, setFormData] = useState({
        gender: "",
        phone: "",
        accountType: "",
        profilePicture: null,
        profilePreview: null,  // To hold the preview of the selected image
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null); // Clear error when input changes
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Make sure required fields are filled
        if (!formData.gender || !formData.phone || !formData.accountType) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true); // Start loading
        try {
            const data = new FormData();
            data.append("gender", formData.gender);
            data.append("phone", formData.phone);
            data.append("accountType", formData.accountType);
            if (formData.profilePicture) {
                data.append("profilePicture", formData.profilePicture);
            }

            // API call to submit the form to localhost:5000/onboard
            const response = await axios.post(`${envConfig.backend}/onboard`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                },
            });

            if (response.data.pagesAccess){
              localStorage.setItem('pagesAccess', JSON.stringify(response.data.pagesAccess));
            }

            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox mt={4} p={3} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h4" mb={2}>
                    Complete Your Profile
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px" }}>
                    {/* Profile Picture (Optional) */}
                    <SoftBox mb={3} display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            src={formData.profilePreview || "/default-avatar.png"}  // Default avatar or the selected image
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
                        onChange={handleInputChange}
                        row
                        sx={{
                            justifyContent: "center",
                            '& .MuiFormControlLabel-label': {
                                fontWeight: 500,
                                fontSize: "1rem",
                                color: "#555",
                            },
                            '& .MuiRadio-root': {
                                color: "#1a73e8",  // Primary color
                            },
                            '& .Mui-checked': {
                                color: "#1a73e8",
                            }
                        }}
                    >
                        <FormControlLabel sx={{ margin: "0px 15px" }} value="individual" control={<Radio />} label="Individual" />
                        <FormControlLabel sx={{ margin: "0px 15px" }} value="company" control={<Radio />} label="Company" />
                    </RadioGroup>

                    {/* Error Message */}
                    {error && (
                        <Typography variant="body2" color="error" align="center">
                            {error}
                        </Typography>
                    )}

                    {/* Submit Button */}
                    <SoftBox mt={4} mb={1} display="flex" justifyContent="center">
                        <SoftButton
                            variant="gradient"
                            color="info"
                            type="submit"
                            disabled={loading} // Disable button when loading
                            endIcon={loading ? <CircularProgress size={24} color="inherit" /> : null} // Show loader when loading
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
