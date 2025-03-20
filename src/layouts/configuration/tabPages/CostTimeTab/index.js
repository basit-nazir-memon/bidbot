
// @mui material components
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox";

import CostAndTimeEstimationSettings from "layouts/configuration/components/GeneralTimeCostSettings";

function CostTimeTab() {

  return (
    <>
      <SoftBox mt={5} mb={3}>
        <Grid container>
            <CostAndTimeEstimationSettings />
        </Grid>
      </SoftBox>
    </>
  );
}

export default CostTimeTab;
