import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { Select, MenuItem, TextField, Checkbox, ListItemText, Grid } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function GeneralFiltersSettings() {
  const [formData, setFormData] = useState({
    jobType: "hourly",
    minFixedPrice: "",
    minHourlyPrice: "",
    minEstimatedPrice: "",
    maxProposals: 30,
    onlyPaymentVerified: true,
    excludedCountries: [],
    minProjectDuration: "1 day",
    hoursPerWeek: "lessThan30",
    minClientRating: 1,
    clientMinSpent: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: prevData[name].includes(value)
        ? prevData[name].filter((item) => item !== value)
        : [...prevData[name], value],
    }));
  };

  return (
    <Card sx={{ padding: "20px", width: "100%", mx: 3 }}>
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6">General Settings</SoftTypography>
        <SoftButton size="small" variant="gradient" color="info" onClick={() => { /* handle save changes logic */ }}>
          Save Changes
        </SoftButton>
      </SoftBox>

      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <Grid container spacing={2} alignItems="center">
          {/* Job Type */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Job Type
            </SoftTypography>
            <Select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ width: "100%" }}
            >
              <MenuItem value="hourly">Hourly</MenuItem>
              <MenuItem value="fixed">Fixed Price</MenuItem>
              <MenuItem value="both">Both</MenuItem>
            </Select>
          </Grid>

          {/* Minimum Fixed Price */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Minimum Fixed Price
            </SoftTypography>
            <TextField
              fullWidth
              type="number"
              name="minFixedPrice"
              value={formData.minFixedPrice}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Minimum Hourly Price */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Minimum Hourly Price
            </SoftTypography>
            <TextField
              fullWidth
              type="number"
              name="minHourlyPrice"
              value={formData.minHourlyPrice}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Minimum Estimated Price */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Minimum Estimated Price
            </SoftTypography>
            <TextField
              fullWidth
              type="number"
              name="minEstimatedPrice"
              value={formData.minEstimatedPrice}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* Max Proposals Submitted */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Max Proposals Submitted
            </SoftTypography>
            <TextField
              fullWidth
              type="number"
              name="maxProposals"
              value={formData.maxProposals}
              onChange={handleInputChange}
              inputProps={{ max: 30 }}
              required
            />
          </Grid>

          
          {/* Countries to Exclude */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Excluded Countries
            </SoftTypography>
            <Select
              multiple
              displayEmpty
              fullWidth
              name="excludedCountries"
              value={formData.excludedCountries}
              onChange={handleCheckboxChange}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "Select Countries")}
            >
              {["USA", "Canada", "UK", "Germany", "India"].map((country) => (
                <MenuItem key={country} value={country}>
                  <Checkbox checked={formData.excludedCountries.includes(country)} />
                  <ListItemText primary={country} />
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Minimum Project Duration */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Minimum Project Duration
            </SoftTypography>
            <Select
              fullWidth
              name="minProjectDuration"
              value={formData.minProjectDuration}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="1 day">1 day</MenuItem>
              <MenuItem value="1 week">1 week</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="6 months">6 months</MenuItem>
              <MenuItem value="1 year">1 year</MenuItem>
              <MenuItem value="2 years">2 years</MenuItem>
            </Select>
          </Grid>

          {/* Hours Per Week */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Hours Per Week
            </SoftTypography>
            <Select
              fullWidth
              name="hoursPerWeek"
              value={formData.hoursPerWeek}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="lessThan30">Less than 30</MenuItem>
              <MenuItem value="moreThan30">More than 30</MenuItem>
            </Select>
          </Grid>

          {/* Minimum Client Rating */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Minimum Client Rating
            </SoftTypography>
            <Select
              fullWidth
              name="minClientRating"
              value={formData.minClientRating}
              onChange={handleInputChange}
              required
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Client Minimum Spent */}
          <Grid item xs={12} md={6}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Client Minimum Spent (USD)
            </SoftTypography>
            <Select
              fullWidth
              name="clientMinSpent"
              value={formData.clientMinSpent}
              onChange={handleInputChange}
              required
            >
              {[0, 10, 50, 100, 200, 500, 1000, 5000, 10000, 50000].map((spent) => (
                <MenuItem key={spent} value={spent}>
                  {spent} USD
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        {/* Only Payment Verified */}
        <Grid item xs={12} md={6} mt={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
                Only Payment Verified
            </SoftTypography>
            <SoftBox display="flex" alignItems="center">
              <Switch
                checked={formData.onlyPaymentVerified}
                onChange={() => setFormData((prevData) => ({ ...prevData, onlyPaymentVerified: !prevData.onlyPaymentVerified }))}
              />
              
            </SoftBox>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default GeneralFiltersSettings;
