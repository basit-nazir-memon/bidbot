
// @mui material components
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox";
import { Card } from "@mui/material";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import ListCard from "examples/Cards/InfoCards/ListCard";
import { Check } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { envConfig } from "env";


JobInfo.propTypes = {
  handleSetTabValue: PropTypes.func.isRequired,
  handleSetJobStatus: PropTypes.func.isRequired,
};


function JobInfo({handleSetTabValue, handleSetJobStatus}) {
  
  const { id } = useParams(); // Get jobId from URL
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth-token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${envConfig.backend}/jobs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        

        const jobStatusTag = (response.data.applied ? "Applied" : response.data.suggested ? "Suggested" : "Info");
        handleSetJobStatus(jobStatusTag)
        
        setJobData(response.data);

      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to fetch job details");

      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]); // Fetch data when jobId changes

  if (loading) return <p>Loading job details...</p>;

  const generalTabs = [
    { title: "Job Type", value: (jobData ? (jobData.job.type === "fixed" ? "Fixed Price" : "Hourly") : "-") },
        { title: jobData && jobData.job.type === "fixed" ? "Estimated Budget" : "Estimated Hourly Rate", value: jobData ? jobData.job.type === "fixed" ?  `$${jobData.job.budget}` : `$${jobData.job.minHourlyPrice} - $${jobData.job.maxHourlyPrice}` : '-' },
    { title: "Posted On", value: jobData ?  new Date(jobData.job.postedOn).toLocaleString() : '-' },
    { title: "Payment Status", value: jobData ?  jobData.job.payment_status : '-' },
    { title: "Rating", value: jobData ? jobData.job.rating : '-' },
    { title: "Country", value: jobData ?  jobData.job.country : '-' },
    { title: "Spendings", value: jobData ? `$${jobData.job.spendings.toLocaleString()}+` : '-' },
    { title: "Proposals Submitted", value: jobData ? jobData.job.proposals < 5 ? "Less than 5" : jobData.job.proposals : '-' }
];

  const tags = jobData ? jobData.job.items : [];

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
                    <SoftTypography fontWeight="bold" variant="h6">{item.title}</SoftTypography>
                    <SoftTypography fontWeight="regular"  variant="h6" mt={2}>{item.value}</SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
            ) )
          }
        </Grid>
      </SoftBox>

      <SoftBox mt={2} mb={2} mx={3}>
        <Grid container spacing={2}>
          <Grid item md={12} lg={8}>
            <Grid container spacing={2}>
              <Grid item lg={12}>
                <Card sx={{ padding: "20px", width: "100%"}}>
                  <SoftBox
                    px={2}
                  >
                    <SoftTypography fontWeight="bold" variant="h6">Job Title</SoftTypography>
                    <SoftTypography variant="h6" mt={2}>{ jobData ? jobData.job.title : "-"}</SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card sx={{ padding: "20px", width: "100%"}}>
                  <SoftBox
                    px={2}
                  >
                    <SoftTypography fontWeight="bold" variant="h6">Job Description</SoftTypography>
                    <SoftTypography variant="h6" mt={2} fontWeight="light"  sx={{ whiteSpace: "pre-line" }}>{jobData ? jobData.job.description : '-'}</SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item lg={12}>
                <Card sx={{ padding: "20px", width: "100%"}}>
                  <SoftBox
                    px={2}
                  >
                    <SoftTypography variant="h6">Job Application Status</SoftTypography>
                    <SoftTypography variant="h5" mt={2}>
                      {
                        jobData && jobData.applied ? (
                          <SoftTypography variant="h5" mt={2} color="success">
                            <Check /> Applied 
                          </SoftTypography>
                        ) : (
                          <SoftButton
                            size="small"
                            variant="gradient"
                            color="info"
                            onClick={(e) => handleSetTabValue(e, 1)}
                          >
                            Apply Now
                          </SoftButton>
                        )
                      }
                    </SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card sx={{ padding: "20px", width: "100%"}}>
                  <SoftBox
                    px={2}
                  >
                    <SoftTypography variant="h6">Job Status</SoftTypography>
                    <SoftTypography fontWeight="regular" variant="h6" mt={2}>{jobData ? jobData.job.job_status : '-'}</SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <ListCard title="Job Tags"
                  info={tags.map((skill, idx) => ({
                    key: idx,
                    label: skill
                  }))}
                  
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
    </>
  );
}

export default JobInfo;
