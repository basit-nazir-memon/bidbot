import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { Select, MenuItem, TextField, Alert, AlertTitle } from "@mui/material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { WarningOutlined } from "@mui/icons-material";

function CostAndTimeEstimationSettings() {
  const [formData, setFormData] = useState({
    timeEstimationStrategy: "jobEstimatedTime",
    customTimePercentage: 100,
    usePreviousProjectsData: false,
    perHourPrice: "",
    costingStrategy: "timeAndPerHourPrice",
    customCostPercentage: 100,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
    <SoftBox mx={3} mb={2} style={{width: "100%"}}>
      <Card sx={{ padding: "20px", marginBottom: "20px" }}>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="100%">
            <Alert
              severity="warning"
              icon={<WarningOutlined fontSize="inherit" />}
              sx={{
                backgroundColor: "#fff3cd", // Light yellow background for warning
                color: "#856404", // Dark yellow text for contrast
              }}
            >
              <AlertTitle>
                <strong>Recommended:</strong>
              </AlertTitle>
              Select the Client Estimated Budget and Job Estimated Time options for better results and to increase your chances of winning bids.
            </Alert>
          </SoftBox>
        </SoftBox>
      </Card>


      <Card sx={{ padding: "20px", marginBottom: "20px" }}>
        <SoftBox pt={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h6">Time Estimation Settings</SoftTypography>
        </SoftBox>

        <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
          {/* Time Estimation Strategy */}
          <SoftBox py={1} mb={0.25} alignItems={"center"}>
            <SoftBox mr={2}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Time Estimation Strategy
              </SoftTypography>
            </SoftBox>
            <SoftBox fullWidth mt={0.25}>
              <Select
                name="timeEstimationStrategy"
                value={formData.timeEstimationStrategy}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="jobEstimatedTime">Job Estimated Time</MenuItem>
                <MenuItem value="modulesBreakdown">Modules Breakdown Time Approach Using Previous Projects</MenuItem>
                <MenuItem value="customFormula">Custom Formula</MenuItem>
              </Select>
            </SoftBox>
          </SoftBox>

          {/* Custom Time Percentage */}
          {formData.timeEstimationStrategy === "customFormula" && (
            <SoftBox py={1} mb={0.25}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Select % of the time needed (100% means exact client estimated time)
              </SoftTypography>
              <SoftBox mt={0.25} width="100%">
                <TextField
                  fullWidth
                  type="number"
                  name="customTimePercentage"
                  value={formData.customTimePercentage}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </SoftBox>
            </SoftBox>
          )}

          {/* Use Previous Projects Data for Modules Breakdown */}
          {formData.timeEstimationStrategy === "modulesBreakdown" && (
            <SoftBox display="flex" py={1} mb={0.25}>
              <SoftBox mt={0.25}>
                <Switch
                  checked={formData.usePreviousProjectsData}
                  onChange={handleSwitchChange}
                  name="usePreviousProjectsData"
                />
              </SoftBox>
              <SoftBox width="80%" ml={2}>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  Use Previous Projects Data?
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>
      </Card>

      <Card sx={{ padding: "20px", marginBottom: "20px" }}>
        <SoftBox pt={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h6">Cost Estimation Settings</SoftTypography>
        </SoftBox>

        <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
          
        {/* Per Hour Price */}
          <SoftBox py={1} mb={0.25}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Per Hour Price
            </SoftTypography>
            <SoftBox mt={0.25} width="100%">
              <TextField
                fullWidth
                type="number"
                name="perHourPrice"
                value={formData.perHourPrice}
                onChange={handleInputChange}
                required
              />
            </SoftBox>
          </SoftBox>

          {/* Costing Strategy */}
          <SoftBox py={1} mb={0.25} alignItems={"center"}>
            <SoftBox mr={2}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Costing Strategy
              </SoftTypography>
            </SoftBox>
            <SoftBox fullWidth mt={0.25}>
              <Select
                name="costingStrategy"
                value={formData.costingStrategy}
                onChange={handleInputChange}
                required
                sx={{ width: "500px" }}
              >
                <MenuItem value="timeAndPerHourPrice">Time & Per Hour Price Based</MenuItem>
                <MenuItem value="clientEstimatedBudget">Client Estimated Budget</MenuItem>
                <MenuItem value="previousProjectsBased">Previous Projects Based</MenuItem>
                <MenuItem value="customFormula">Custom Formula</MenuItem>
              </Select>
            </SoftBox>
          </SoftBox>

          {/* Custom Cost Percentage */}
          {formData.costingStrategy === "customFormula" && (
            <SoftBox py={1} mb={0.25}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                Select % of the cost (100% means exact client estimated cost)
              </SoftTypography>
              <SoftBox mt={0.25} width="100%">
                <TextField
                  fullWidth
                  type="number"
                  name="customCostPercentage"
                  value={formData.customCostPercentage}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>
      </Card>

      {/* Save Button */}
      <SoftBox display="flex" justifyContent="flex-end" mt={3}>
        <SoftButton size="small" variant="gradient" color="info" onClick={() => { /* handle save changes logic */ }}>
          Save Changes
        </SoftButton>
      </SoftBox>
    </SoftBox>
  );
}

export default CostAndTimeEstimationSettings;
