import { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { MenuItem, Select } from "@mui/material";
import DropArea from "../DropArea/DropArea";
import DraggableItem from "../DragableItem/DragableItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SoftInput from "components/SoftInput";

function ProposalTemplateSettings() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customComponents, setCustomComponents] = useState([]);
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("/api/templates"); // Replace with your API endpoint
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    setIsCustomTemplate(value === "other");
  };

  const addComponentToDropArea = (component) => {
    setCustomComponents((prevComponents) => [...prevComponents, component]);
  };

  const deleteComponent = (index) => {
    setCustomComponents((prevComponents) =>
      prevComponents.filter((_, i) => i !== index)
    );
  };

  const handleSaveChanges = async () => {
    if (isCustomTemplate) {
      setDialogOpen(true); // Open dialog to ask for the template name
    } else {
      // Save predefined template
      try {
        const response = await axios.post("/api/save-predefined-template", {
          templateId: selectedTemplate,
        });
        console.log("Predefined template saved:", response.data);
        alert("Template saved successfully!");
      } catch (error) {
        console.error("Error saving predefined template:", error);
      }
    }
  };

  const handleSaveCustomTemplate = async () => {
    setDialogOpen(false); // Close dialog
    try {
      const response = await axios.post("/api/save-custom-template", {
        name: templateName,
        components: customComponents.map((component) => component.name),
      });
      console.log("Custom template saved:", response.data);
      alert("Custom template saved successfully!");
      setTemplateName("");
      setCustomComponents([]);
      setSelectedTemplate("");
      setIsCustomTemplate(false);
    } catch (error) {
      console.error("Error saving custom template:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card sx={{ padding: "20px", width: "100%", mx: 3 }}>
        <SoftBox
          pt={2}
          px={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <SoftTypography variant="h6">Proposal Template Settings</SoftTypography>
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
          <SoftTypography variant="button" fontWeight="regular" color="text">
            Select a prebuilt template
          </SoftTypography>

          <SoftBox mb={2}>
            <Select
              fullWidth
              name="templateChoice"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              required
            >
              <MenuItem value="" disabled>
                <span
                  style={{
                    marginLeft: "-10px",
                    color: "rgb(178 179 196)",
                    font: "inherit",
                  }}
                >
                  Select template
                </span>
              </MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </SoftBox>

          {isCustomTemplate && (
            <SoftBox mb={2} style={{ marginTop: "20px", width: "100%" }}>
              <SoftTypography variant="h6" >
                Create Custom Template
              </SoftTypography>

              <div style={{ display: "flex", width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: "20px",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <DraggableItem name="Greetings" addComponent={addComponentToDropArea} />
                  <DraggableItem name="Introduction" addComponent={addComponentToDropArea} />
                  <DraggableItem name="Current Job Explanation" addComponent={addComponentToDropArea} />
                  <DraggableItem name="Previous Similar Jobs Info" addComponent={addComponentToDropArea} />
                  <DraggableItem name="Modules Beakdown" addComponent={addComponentToDropArea} />
                  <DraggableItem name="Call To Action" addComponent={addComponentToDropArea} />
                </div>

                <DropArea
                  customComponents={customComponents}
                  deleteComponent={deleteComponent}
                  style={{ flex: 1 }}
                />
              </div>
            </SoftBox>
          )}
        </SoftBox>

        {/* Dialog for entering custom template name */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          PaperProps={{
            sx: {
              width: '500px', // Set the desired width here
              maxWidth: '80%', // Optional: Ensure dialog is responsive
            },
          }}
        >
          <DialogTitle>Save Custom Template</DialogTitle>
          <DialogContent>
            <SoftBox mb={2}>
              <SoftInput
                name="name"
                placeholder="Template Name"
                fullWidth
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </SoftBox>
          </DialogContent>
          <DialogActions>
            <SoftButton variant="gradient" color="error" onClick={() => setDialogOpen(false)}>
              Cancel
            </SoftButton>
            <SoftButton onClick={handleSaveCustomTemplate} color="info" variant="gradient">
              Save
            </SoftButton>
          </DialogActions>
        </Dialog>
      </Card>
    </DndProvider>
  );
}

export default ProposalTemplateSettings;
