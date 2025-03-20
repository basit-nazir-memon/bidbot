
// @mui material components
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox";
import { Card } from "@mui/material";
import SoftTypography from "components/SoftTypography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { envConfig } from "env";



function JobBid() {

  const { id } = useParams(); // Get jobId from URL
  const [jobData, setJobData] = useState(null);
  
  
  const generalTabs = [
    {title: "Job Status", value: jobData ? jobData.appliedJob.jobStatus : "-" },
    {title: "Job Type", value: (jobData ? (jobData.job.type === "fixed" ? "Fixed Price" : "Hourly") : "-") },
    {title: jobData && jobData.job.type === "fixed" ? "Budget Quoted (USD)" : "Hourly Rate (USD)", value: jobData ? jobData.job.type === "fixed" ?  `$${jobData.appliedJob.bidPrice}` : `$${jobData.appliedJob.hourlyPrice}` : '-' },
    {
      title: "Job Duration", 
      value: jobData && jobData.job.type === "fixed" ? 
      ( jobData.appliedJob.jobDuration === "lessThan1Month" ? "Less Than 1 Month" :  
        jobData.appliedJob.jobDuration === "1To3Months" ? "1 To 3 Months" :  
        jobData.appliedJob.jobDuration === "3To6Months" ? "3 To 6 Months" : "More Than 6 Months"
      ) : "-"
    },
  ];

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
        setJobData(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } 
    };

    fetchJobDetails();
  }, [id]); // Fetch data when jobId changes

  return (
    <>
      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          {
            generalTabs.map((item, index) => (
              <Grid item md={6} lg={3} key={index}>
                <Card sx={{ padding: "20px", width: "100%"}}>
                  <SoftBox
                    px={2}
                  >
                    <SoftTypography variant="h6">{item.title}</SoftTypography>
                    <SoftTypography variant="h5" mt={2}>{item.value}</SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
            ) )
          }
        </Grid>
      </SoftBox>

      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          <Grid item md={12} lg={12}>
            <Card sx={{ padding: "20px", width: "100%"}}>
              <SoftBox
                px={2}
              >
                <SoftTypography variant="h6">Job Title</SoftTypography>
                <SoftTypography variant="h5" mt={2}>{jobData ? jobData.job.title : "-"}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
          <Grid item md={12} lg={12}>
            <Card sx={{ padding: "20px", width: "100%"}}>
              <SoftBox
                px={2}
              >
                <SoftTypography variant="h6">Proposal Submitted</SoftTypography>
                <SoftTypography variant="h6" mt={2} fontWeight="light" sx={{ whiteSpace: "pre-line" }} >{jobData ? jobData.appliedJob.proposalGenerated : "No Proposal Generated"}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </>
  );
}

export default JobBid;
