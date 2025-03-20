import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/job-details/components/Header";
import { AccessTime, AddCircle, Create, FilterAlt, Info } from "@mui/icons-material";
import { useState } from "react";
import JobInfo from "./tabPages/JobInfo";
import JobBid from "./tabPages/JobBid";
import JobApply from "./tabPages/JobApply";

function JobDetails() {
  const [tabValue, setTabValue] = useState(0);
  const [jobStatus, setJobStatus] = useState("Info")

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleSetJobStatus = (newValue) => setJobStatus(newValue);

  const tabs = [
      {
        tabName: "Job Information",
        icon: <Info />,
      },
      {
        tabName: "Apply Job",
        icon: <AddCircle />,
      },
      {
        tabName: "Bid Information",
        icon: <Info />,
      },
  ];

  const filterTabs = () => {
    if (jobStatus === "Suggested") {
      return tabs.filter((tab) => tab.tabName !== "Bid Information");
    } else if (jobStatus === "Applied") {
      return tabs.filter((tab) => tab.tabName !== "Apply Job");
    }
    return tabs;
  };

  return (
    <DashboardLayout>
      <Header tabs={filterTabs()} tabValue={tabValue} handleSetTabValue={handleSetTabValue} />
      
      {
        tabValue == 0 && (
          <JobInfo handleSetTabValue={handleSetTabValue} handleSetJobStatus={handleSetJobStatus} />
        )
      }

      {
        tabValue == 1 && jobStatus === "Suggested" && jobStatus !== "Applied" && (
          <JobApply />
        )
      }

      {
        tabValue == 1 && jobStatus === "Applied" && (
          <JobBid />
        )
      }

    </DashboardLayout>
  );
}

export default JobDetails;
