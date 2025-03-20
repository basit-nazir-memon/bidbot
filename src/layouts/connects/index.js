import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "./components/Header";
import { AccessTime, Create, FilterAlt, History, Money } from "@mui/icons-material";
import { useState } from "react";
import ConnectsHistory from "./tabPages/connectsHistory";
import ConnectsInfo from "./tabPages/ConnectsInfo";

function Connects() {
  const [tabValue, setTabValue] = useState(0);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const tabs = [
      {
        tabName: "Analytics & Purchasing",
        icon: <Money />,
      },
      {
        tabName: "History",
        icon: <History />,
      }
  ];


  return (
    <DashboardLayout>
      <Header tabs={tabs} tabValue={tabValue} handleSetTabValue={handleSetTabValue} />
      
      {
        tabValue == 0 && (
          <ConnectsInfo />
        )
      }

      {
        tabValue == 1 && (
          <ConnectsHistory />
        )
      }

    </DashboardLayout>
  );
}

export default Connects;
