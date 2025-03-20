
// @mui material components
import Grid from "@mui/material/Grid";

import SoftBox from "components/SoftBox";

import GeneralFiltersSettings from "layouts/configuration/components/GeneralFiltersSettings";

function JobFiltersTab() {

  return (
    <>
      <SoftBox mt={5} mb={3}>
        <Grid container>
            <GeneralFiltersSettings />
        </Grid>
      </SoftBox>
    </>
  );
}

export default JobFiltersTab;
