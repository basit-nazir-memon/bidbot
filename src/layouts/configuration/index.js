import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/configuration/components/Header";
import { AccessTime, Create, FilterAlt } from "@mui/icons-material";
import { useState } from "react";
import ProposalTab from "./tabPages/ProposalTab";
import JobFiltersTab from "./tabPages/JobFiltersTab";
import CostTimeTab from "./tabPages/CostTimeTab";

function Configuration() {
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const tabs = [
      {
        tabName: "Proposal",
        icon: <Create />,
      },
      {
        tabName: "Job Filters",
        icon: <FilterAlt />,
      },
      {
        tabName: "Time & Cost",
        icon: <AccessTime />,
      }
  ];


  return (
    <DashboardLayout>
      <Header tabs={tabs} tabValue={tabValue} handleSetTabValue={handleSetTabValue} />
      
      {
        tabValue == 0 && (
          <ProposalTab />
        )
      }

      {
        tabValue == 1 && (
          <JobFiltersTab />
        )
      }

{
        tabValue == 2 && (
          <CostTimeTab />
        )
      }

    </DashboardLayout>
  );
}

export default Configuration;
