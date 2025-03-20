// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SoftBox from "components/SoftBox";
import { Card, Modal, CircularProgress, Select, MenuItem,  Snackbar, Alert  } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import axios from "axios";
import SoftInput from "components/SoftInput";
import { useParams } from "react-router-dom";
import { envConfig } from "env";
import { useNavigate } from "react-router-dom";

function JobApply() {

  const { id } = useParams(); // Get jobId from URL

  const [proposalStages, setProposalStages] = useState([
    {
      stage: 1,
      content: "Initial Proposal Content",
    },
  ]);
  const [jobData, setJobData] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [changes, setChanges] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const [durationType, setDurationType] = useState("lessThan1Month");
  const [jobCost, setJobCost] = useState(300);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const generalTabs = [
    { title: "Job Type", value: (jobData ? (jobData.job.type === "fixed" ? "Fixed Price" : "Hourly") : "-") },
    { title: jobData && jobData.job.type === "fixed" ? "Client Estimated Budget" : "Client Hourly Rate", value: jobData ? jobData.job.type === "fixed" ?  `$${jobData.job.budget}` : `$${jobData.job.minHourlyPrice} - $${jobData.job.maxHourlyPrice}` : '-' },
    { title: "Client Rating", value: jobData ? jobData.job.rating : '-' },
    { title: "Job Status", value: jobData ?  jobData.job.payment_status : '-' },
  ];

  const [proposal, setProposal] = useState();


  // Function to close snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // API call for ignoring job
  const handleIgnoreJob = async () => {
    setIsLoadingUpdate(true);
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setSnackbar({ open: true, message: "Token Not Found!", severity: "error" });
        return;
      }

      await axios.post(`${envConfig.backend}/ignore/job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Job successfully ignored!", severity: "success" });
      navigate("/jobs");
    } catch (error) {
      console.error("Error ignoring job:", error);
      setSnackbar({ open: true, message: "Failed to ignore job!", severity: "error" });
    }
    setIsLoadingUpdate(false);
  };

  // API call for marking job as spam
  const handleMarkAsSpam = async () => {
    setIsLoadingUpdate(true);
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setSnackbar({ open: true, message: "Token Not Found!", severity: "error" });
        return;
      }

      await axios.post(`${envConfig.backend}/mark/job/spam/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({ open: true, message: "Job marked as spam!", severity: "success" });
      navigate("/jobs");
    } catch (error) {
      console.error("Error marking job as spam:", error);
      setSnackbar({ open: true, message: "Failed to mark job as spam!", severity: "error" });
    }
    setIsLoadingUpdate(false);
  };


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // setLoading(true);
        const token = localStorage.getItem("auth-token");
        if (!token) {
          // setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${envConfig.backend}/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProposal(response?.data?.suggestedJob?.proposalGenerated)
        setJobCost(response?.data?.jobType == "fixed" ? response?.data?.suggestedJob?.bidPrice : response?.data?.suggestedJob?.hourlyPrice)
        setDurationType(response?.data?.suggestedJob?.jobDuration || "")
        setJobData(response?.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setSnackbar({ open: true, message: "Failed to fetch job details!", severity: "error" });

      } 
    };

    fetchJobDetails();
  }, [id]); // Fetch data when jobId changes

  // const handleGenerateProposal = async () => {
  //   setIsLoadingGenerate(true);
  //   try {
  //     const response = await axios.post("/api/proposal/generate", { proposal });
  //     setProposal(response.data.generatedProposal);
  //   } catch (error) {
  //     console.error("Error generating proposal:", error);
  //   } finally {
  //     setIsLoadingGenerate(false);
  //   }
  // };

  const handleGenerateProposal = async () => {
    setIsLoadingGenerate(true);
    try {
        const requestBody = {
            job_description: proposal, // Assuming `proposal` holds the job description
            additional_context: "", // Add context if needed
            tone: "Professional",
            max_length: 500,
            model: "default-model", // Replace with actual model name if required
            previous_proposals: [],
            associated_files: [],
            job_tags: [],
            job_type: "general", // Adjust based on the job type
            user_previous_projects: []
        };

        const response = await axios.post(`${envConfig.model}/api/generateProposal`, requestBody);

        // Assuming response contains { proposal, status, model_used }
        setProposal(response.data.proposal);
    } catch (error) {
        console.error("Error generating proposal:", error);
        setSnackbar({ open: true, message: "Failed to Generate the Proposal!", severity: "error" });
    } finally {
        setIsLoadingGenerate(false);
    }
};


  const handleUpdateProposal = async () => {
    setIsLoadingUpdate(true);
    try {
        const requestBody = {
            job_description: proposal, // Assuming `proposal` holds the job description
            additional_context: changes, // Add context if needed
            tone: "Professional",
            max_length: 500,
            model: "default-model", // Replace with actual model name if required
            previous_proposals: [],
            associated_files: [],
            job_tags: [],
            job_type: "general", // Adjust based on the job type
            user_previous_projects: []
        };

        const response = await axios.post(`${envConfig.model}/api/generateProposal`, requestBody);

        // Assuming response contains { proposal, status, model_used }
        setProposal(response.data.proposal);
    } catch (error) {
        console.error("Error generating proposal:", error);
        setSnackbar({ open: true, message: "Failed to Generate the Proposal!", severity: "error" });
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handleLoadStage = (index) => {
    setCurrentStage(index);
    setProposal(proposalStages[index].content);
  };

  const handleApplyJob = async () => {
    if (!jobData || !proposal) {
      setSnackbar({
        open: true,
        message: "Job details or proposal are missing!",
        severity: "warning",
      });
      return;
    }
  
    setIsLoadingUpdate(true);
  
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "User not authenticated!",
          severity: "error",
        });
        setIsLoadingUpdate(false);
        return;
      }
  
      const requestBody = {
        proposal,
        bidamount: jobData.job.type == "fixed" ? jobCost : null,
        hourlyPrice: jobData.job.type == "hourly" ? jobCost : null,
        duration: jobData.job.type == "hourly" ? null : durationType,
      };
  
      const response = await axios.post(
        `${envConfig.backend}/job/apply/${id}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setSnackbar({
        open: true,
        message: response.data.message || "Job successfully applied!",
        severity: "success",
      });
  
      setJobData({ ...jobData, jobApplicationStatus: "Applied" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to apply for the job! ${error.response.data.message}`,
        severity: "error",
      });
    } finally {
      setIsLoadingUpdate(false);
    }
  };
  

  return (
    <>
      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          {generalTabs.map((item, index) => (
            <Grid item md={6} lg={3} key={index}>
              <Card sx={{ padding: "20px", width: "100%" }}>
                <SoftBox px={2}>
                  <SoftTypography variant="h6">{item.title}</SoftTypography>
                  <SoftTypography variant="h5" mt={2}>
                    {item.value}
                  </SoftTypography>
                </SoftBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SoftBox>

      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          <Grid item md={12} lg={12}>
            <Card sx={{ padding: "20px", width: "100%" }}>
              <SoftBox px={2}>
                <SoftBox pt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <SoftTypography variant="h6">Proposal / Cover Letter</SoftTypography>
                  <SoftBox display="flex" gap={2}>
                    <SoftButton
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={handleGenerateProposal}
                      disabled={isLoadingGenerate}
                    >
                      {isLoadingGenerate ? <CircularProgress size={20} color="inherit" /> : "Generate Proposal"}
                    </SoftButton>
                    <SoftButton
                      size="small"
                      variant="gradient"
                      color="info"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Make Changes
                    </SoftButton>
                  </SoftBox>
                </SoftBox>

                <TextField
                  multiline
                  rows={16}
                  fullWidth
                  margin="normal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input": {
                      width: "100% !important", // Enforces full width
                      padding: "0", // Adjust padding if needed
                      height: "auto", // Resets height
                    },
                  }}
                />

                {/* <SoftBox my={2}>
                  <SoftTypography variant="h6">Proposal Stages</SoftTypography>
                  <SoftBox p={2} sx={{ border: "1px solid #ccc", borderRadius: "5px" }}>
                    <SoftBox sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        p: 0.5,
                        m: 0,
                      }}
                      component="ul"
                    >
                        {
                        proposalStages.map((stage, index) => {
                          return (
                            <ListItem key={index}>
                              <Chip
                                variant="outlined"
                                color={index === currentStage ? "success" : "info"}
                                fullWidth
                                onClick={() => handleLoadStage(index)}
                                sx={{ mt: 1 }}
                                label={`Stage ${stage.stage}`}
                              />
                            </ListItem>
                          );
                      })}
                    </SoftBox>
                  </SoftBox>
                </SoftBox> */}
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          {/* <Grid item md={12} lg={6}>
            <Card sx={{ padding: "20px", width: "100%" }}>
              <SoftBox px={2}>
                <SoftTypography variant="h6" mt={2}>Job Duration</SoftTypography>
                <SoftBox mt={2} gap={2}>
                  {/* Duration Type 
                  <SoftBox py={1} mb={0.25} alignItems={"center"}>
                    <SoftBox mr={2}>
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        Duration Type
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox fullWidth mt={0.25}>
                      <Select
                        value={durationType}
                        onChange={(e) => setDurationType(e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="days">Days</MenuItem>
                        <MenuItem value="weeks">Weeks</MenuItem>
                        <MenuItem value="months">Months</MenuItem>
                        <MenuItem value="years">Years</MenuItem>
                      </Select>
                    </SoftBox>
                  </SoftBox>

                  {/* Duration Count 
                  <SoftBox py={1} mb={0.25} alignItems={"center"}>
                    <SoftBox mr={2}>
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        Duration Count
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox fullWidth mt={0.25}>
                      <Select
                        value={durationCount}
                        onChange={(e) => setDurationCount(e.target.value)}
                        fullWidth
                        required
                      >
                        {Array.from(
                          { length: { days: 30, weeks: 10, months: 12, years: 10 }[durationType] || 0 },
                          (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid> */}

          {
            jobData && jobData.job.type === "fixed" && (
              <Grid item md={12} lg={6}>
                <Card sx={{ padding: "20px", width: "100%" }}>
                  <SoftBox px={2}>
                    <SoftTypography variant="h6" mt={2}>Job Duration</SoftTypography>
                      <SoftBox py={1} mb={0.25} alignItems={"center"}>
                        <SoftBox fullWidth mt={0.25}>
                          <Select
                            value={durationType}
                            onChange={(e) => setDurationType(e.target.value)}
                            fullWidth
                            required
                          >
                            <MenuItem value="moreThan6Months">More than 6 months</MenuItem>
                            <MenuItem value="3To6Months">3 to 6 months</MenuItem>
                            <MenuItem value="1To3Months">1 to 3 months</MenuItem>
                            <MenuItem value="lessThan1Month">Less than 1 month</MenuItem>
                          </Select>
                        </SoftBox>
                      </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            )
          }
          

          {
            jobData && jobData.job.type === "fixed" && (
              <Grid item md={12} lg={6}>
                <Card sx={{ padding: "20px", width: "100%" }}>
                  <SoftBox px={2}>
                    <SoftTypography variant="h6" mt={2}>Job Cost (USD)</SoftTypography>
                    <SoftBox mt={2}>
                      <SoftInput
                        type="number"
                        value={jobCost}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) setJobCost(value);
                        }}
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            )
          }


          {
            jobData && jobData.job.type === "hourly" && (
              <Grid item md={12} lg={6}>
                <Card sx={{ padding: "20px", width: "100%" }}>
                  <SoftBox px={2}>
                    <SoftTypography variant="h6" mt={2}>Hourly Charge (USD/hr)</SoftTypography>
                    <SoftBox mt={2}>
                      <SoftInput
                        type="number"
                        value={jobCost}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) setJobCost(value);
                        }}
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </SoftBox>
                  </SoftBox>
                </Card>
              </Grid>
            )
          }
        </Grid>
      </SoftBox>

      <Card sx={{ padding: "20px", mx: 3}}>
        <SoftBox display="flex" justifyContent="space-between" gap={2}>
          <SoftButton
            variant="gradient"
            color="warning"
            onClick={handleIgnoreJob}
            disabled={isLoadingUpdate}
            sx={{width: "25%"}}
            // size="small"
          >
            {isLoadingUpdate ? <CircularProgress size={20} color="inherit" /> : "Ignore Job"}
          </SoftButton>

          <SoftButton
            variant="gradient"
            color="error"
            onClick={handleMarkAsSpam}
            disabled={isLoadingUpdate}
            sx={{width: "25%"}}
            // size="small"
          >
            {isLoadingUpdate ? <CircularProgress size={20} color="inherit" /> : "Ignore & Mark As Spam"}
          </SoftButton>
          
          <SoftButton
            variant="gradient"
            color="info"
            onClick={handleApplyJob}
            disabled={isLoadingUpdate}
            // size="small"
            sx={{width: "50%"}}
          >
            {isLoadingUpdate ? <CircularProgress size={20} color="inherit" /> : "Apply For Job"}
          </SoftButton>
        </SoftBox>
      </Card>



      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Card sx={{ padding: "20px", width: "500px", margin: "100px auto" }}>
          <SoftBox display="flex" flexDirection="column" gap={2}>
            <SoftTypography variant="h6">Make Changes in Proposal</SoftTypography>
            <TextField
              placeholder="Enter the changes you want to make"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  width: "100% !important", // Enforces full width
                  padding: "0", // Adjust padding if needed
                  height: "auto", // Resets height
                },
              }}
            />
            <SoftBox display="flex" justifyContent="flex-end" gap={2}>
              <SoftButton variant="gradient" size="small" color="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </SoftButton>
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleUpdateProposal}
                disabled={isLoadingUpdate}
                size="small"
              >
                {isLoadingUpdate ? <CircularProgress size={20} color="inherit" /> : "Update Proposal"}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </Card>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default JobApply;
