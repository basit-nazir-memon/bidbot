import { useState } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function GeneralProposalSettings() {
  const [settings, setSettings] = useState({
    mentionPreviousProjects: true,
    mentionModuleDivision: false,
    mentionTimeDivision: false,
    mentionCostDivision: false,
  });

  const handleSwitchChange = (field) => {
    setSettings((prevSettings) => {
      // Enforce constraints
      if (field === "mentionModuleDivision" && !prevSettings.mentionModuleDivision) {
        // If enabling module division, allow toggling time and cost
        return {
          ...prevSettings,
          mentionModuleDivision: !prevSettings.mentionModuleDivision,
        };
      } else if (field === "mentionModuleDivision" && prevSettings.mentionModuleDivision) {
        // If disabling module division, disable time and cost
        return {
          ...prevSettings,
          mentionModuleDivision: false,
          mentionTimeDivision: false,
          mentionCostDivision: false,
        };
      } else if (
        (field === "mentionTimeDivision" || field === "mentionCostDivision") &&
        !prevSettings.mentionModuleDivision
      ) {
        // Prevent toggling time or cost if module division is inactive
        return prevSettings;
      } else {
        // Default toggle behavior
        return {
          ...prevSettings,
          [field]: !prevSettings[field],
        };
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("/api/save-settings", settings);
      console.log("Settings saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Card sx={{ padding: "20px", width: "100%", mx: 3 }}>
      <SoftBox
        pt={2}
        px={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SoftTypography variant="h6">General Settings</SoftTypography>
        <SoftButton
          size="small"
          variant="gradient"
          color="info"
          onClick={handleSaveChanges}
        >
          Save Changes
        </SoftButton>
      </SoftBox>
      <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Switch
              checked={settings.mentionPreviousProjects}
              onChange={() => handleSwitchChange("mentionPreviousProjects")}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Mention previous projects in proposal
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Switch
              checked={settings.mentionModuleDivision}
              onChange={() => handleSwitchChange("mentionModuleDivision")}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Mention module-wise division in proposal
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Switch
              checked={settings.mentionTimeDivision}
              onChange={() => handleSwitchChange("mentionTimeDivision")}
              disabled={!settings.mentionModuleDivision}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Mention time division in proposal
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox mt={0.25}>
            <Switch
              checked={settings.mentionCostDivision}
              onChange={() => handleSwitchChange("mentionCostDivision")}
              disabled={!settings.mentionModuleDivision}
            />
          </SoftBox>
          <SoftBox width="80%" ml={2}>
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Mention cost division in proposal
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default GeneralProposalSettings;
